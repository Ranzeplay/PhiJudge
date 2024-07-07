'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { AgentStatus } from '@prisma/client';

export async function FetchAgent(id: string) {
  return await serverPrisma.agent.findUnique({ where: { id } });
}

export async function SwitchSuspensionState(id: string) {
  const agent = await FetchAgent(id);

  if (!agent) {
    throw new Error('Agent not found');
  }

  await serverPrisma.agent.update({
    where: { id },
    data: {
      status:
        agent.status === AgentStatus.SUSPENDED
          ? AgentStatus.DISCONNECTED
          : AgentStatus.SUSPENDED,
    },
  });
}

export async function DeleteAgent(id: string) {
  await serverPrisma.agent.delete({ where: { id } });
}
