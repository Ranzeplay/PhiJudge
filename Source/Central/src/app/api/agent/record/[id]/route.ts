import { serverPrisma } from '@/lib/serverSidePrisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const agent = serverPrisma.agent.findUnique({
    where: {
      id: request.headers.get('Authorization') || '',
    },
  });

  if (!agent) {
    return NextResponse.json({ message: 'Agent not found' }, { status: 401 });
  }

  const record = await serverPrisma.record.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      problem: true,
    },
  });

  if (!record) {
    return NextResponse.json({ message: 'Record not found' }, { status: 404 });
  }

  return NextResponse.json({
    recordId: record.id,
    sourceCode: record.sourceCode,
    language: record.languageId,
    problemId: record.problem.id,
    enableOptimization: record.enableOptimization,
    warningAsError: record.warningAsError,
  });
}
