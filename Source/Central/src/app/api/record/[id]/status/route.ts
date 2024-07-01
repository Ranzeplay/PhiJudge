import { serverPrisma } from '@/lib/serverSidePrisma';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const recordSelectResult = await serverPrisma.record.findUnique({
    where: {
      id: parseInt(params.id),
    },
    select: {
      status: true,
    },
  });

  if (!recordSelectResult) {
    return NextResponse.json({ message: 'Record not found' }, { status: 404 });
  }

  return NextResponse.json({ status: recordSelectResult.status });
}
