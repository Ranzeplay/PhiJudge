import { serverPrisma } from '@/lib/serverSidePrisma';
import { RecordStatus, RecordTestPointStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const record = await serverPrisma.record.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      recordTestPoint: true,
      problem: {
        include: {
          testData: true,
        },
      },
    },
  });

  if (record?.recordTestPoint.length !== record?.problem.testData.length) {
    return NextResponse.json({ message: 'Test has not completed yet!' }, { status: 400 });
  }

  const allTestPointsPassed = record?.recordTestPoint.every(
    (tp) => tp.status === RecordTestPointStatus.ACCEPTED
  );
  await serverPrisma.record.update({
    where: { id: parseInt(params.id) },
    data: {
      status: allTestPointsPassed ? RecordStatus.PASSED : RecordStatus.FAILED,
    },
  });

  await serverPrisma.problem.update({
    where: {
      id: record?.problemId,
    },
    data: {
      totalPassed: {
        increment: allTestPointsPassed ? 1 : 0,
      },
    },
  });

  return NextResponse.json({});
}
