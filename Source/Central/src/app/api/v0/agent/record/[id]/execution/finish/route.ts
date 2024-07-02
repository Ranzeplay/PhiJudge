import { serverPrisma } from '@/lib/serverSidePrisma';
import { RecordStatus, RecordTestPointStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const testPoints = await serverPrisma.recordTestPoint.findMany({
    where: {
      record: {
        id: parseInt(params.id),
      },
    },
    select: {
      status: true,
      record: {
        select: {
          problemId: true
        }
      }
    },
  });

  const allTestPointsPassed = testPoints.every(
    (testPoint) => testPoint.status === RecordTestPointStatus.ACCEPTED
  );
  await serverPrisma.record.update({
    where: { id: parseInt(params.id) },
    data: {
      status: allTestPointsPassed ? RecordStatus.PASSED : RecordStatus.FAILED,
    },
  });

  await serverPrisma.problem.update({
    where: {
      id: testPoints[0].record.problemId,
    },
    data: {
      totalPassed: {
        increment: allTestPointsPassed ? 1 : 0,
      },
    },
  });

  return NextResponse.json({});
}