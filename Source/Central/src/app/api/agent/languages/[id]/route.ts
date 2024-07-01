import { serverPrisma } from '@/lib/serverSidePrisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const languages = (await request.json()) as string[];

  await serverPrisma.agent.update({
    where: {
      id: params.id,
    },
    data: {
      availableLanguageId: {
        set: languages,
      },
    },
  });

  return NextResponse.json({ message: 'Languages updated' });
}
