import { serverPrisma } from '@/lib/serverSidePrisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const languages = (await request.json()) as string[];

  await serverPrisma.agent.update({
    where: {
      id: request.headers.get('Authorization') || '',
    },
    data: {
      availableLanguageId: {
        set: languages,
      },
    },
  });

  for(const lang of languages) {
    const isExisting = await serverPrisma.availableProgrammingLanguage.findFirst({
      where: {
        id: lang,
      },
    });

    if (!isExisting) {
      await serverPrisma.availableProgrammingLanguage.create({
        data: {
          id: lang,
          name: lang,
        },
      });
    }
  }

  return NextResponse.json({ message: 'Languages updated' });
}
