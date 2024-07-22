import { LanguageView } from '@/lib/models/language';
import { serverPrisma } from '@/lib/serverSidePrisma';
import { AgentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const lang = await serverPrisma.availableProgrammingLanguage.findMany({
    where: { enabled: true },
  });

  const result: LanguageView[] = [];
  for (const l of lang) {
    const agentCount = await serverPrisma.agent.count({
      where: {
        availableLanguageId: {
          has: l.id,
        },
        status: AgentStatus.AVAILABLE
      },
    });

    result.push({
      id: l.id,
      name: l.name,
      agents: agentCount,
      enabled: l.enabled,
    } as LanguageView);
  }

  return NextResponse.json(result);
}
