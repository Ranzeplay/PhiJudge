'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { AgentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const agentId = request.headers.get('Authorization') || '';

  const result = await serverPrisma.agent.update({
    where: {
      id: agentId,
    },
    data: {
      lastHeartbeatTime: new Date(),
      lastNetworkAddress: (
        request.headers.get('X-Forwarded-For') ||
        request.ip ||
        'unknown'
      )
        .split(',')
        .at(0),
    },
  });

  if (result.status === AgentStatus.DISCONNECTED) {
    await serverPrisma.agent.update({
      where: {
        id: agentId,
      },
      data: {
        status: AgentStatus.AVAILABLE,
      },
    });
  }

  // Set a timeout to check if the agent is still alive
  setTimeout(
    async () => {
      const agent = await serverPrisma.agent.findUnique({
        where: {
          id: agentId,
        },
      });

      if (
        agent &&
        agent.status === AgentStatus.AVAILABLE &&
        new Date().getTime() - agent.lastHeartbeatTime.getTime() > 5 * 60 * 1000
      ) {
        await serverPrisma.agent.update({
          where: {
            id: agentId,
          },
          data: {
            status: AgentStatus.DISCONNECTED,
          },
        });
      }
    },
    11 * 60 * 1000
  );

  return NextResponse.json({ message: 'Heartbeat received' });
}
