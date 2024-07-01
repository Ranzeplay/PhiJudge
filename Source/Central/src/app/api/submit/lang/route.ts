import { LanguageView } from '@/lib/models/language';
import { serverPrisma } from '@/lib/serverSidePrisma';
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
      },
    });

    result.push({
      id: l.id,
      name: l.name,
      agents: agentCount,
      enabled: l.enabled,
    });
  }

  return NextResponse.json(result);
}
