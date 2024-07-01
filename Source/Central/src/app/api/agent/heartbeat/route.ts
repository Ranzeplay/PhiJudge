'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { AgentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const result = await serverPrisma.agent.update({
    where: {
      id: request.headers.get('Authorization') || '',
    },
    data: {
      lastHeartbeatTime: new Date(),
      lastNetworkAddress: request.ip,
    },
  });

  if (result.status === AgentStatus.DISCONNECTED) {
    await serverPrisma.agent.update({
      where: {
        id: request.headers.get('Authorization') || '',
      },
      data: {
        status: AgentStatus.AVAILABLE,
      },
    });
  }

  return NextResponse.json({ message: 'Heartbeat received' });
}
