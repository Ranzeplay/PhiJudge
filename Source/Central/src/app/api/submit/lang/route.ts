import { serverPrisma } from '@/lib/serverSidePrisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const lang = await serverPrisma.availableProgrammingLanguage.findMany({
    select: { id: true, name: true },
    where: { enabled: true },
  });

  return NextResponse.json(lang);
}
