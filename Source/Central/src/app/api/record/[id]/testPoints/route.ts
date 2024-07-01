import { TestPointViewModel } from "@/lib/models/testPoint";
import { serverPrisma } from "@/lib/serverSidePrisma";
import { RecordTestPointStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const testPointsDbResult = await serverPrisma.recordTestPoint.findMany({
    where: {
      recordId: parseInt(params.id),
    },
    orderBy: {
      order: "asc",
    },
    include: {
      record: {
        include: {
          problem: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const result: TestPointViewModel[] = [];
  if (testPointsDbResult.length > 0) {
    const problemTestDataDbResult = await serverPrisma.problemTestData.findMany(
      {
        where: {
          problem: {
            id: testPointsDbResult[0].record.problem.id,
          },
        },
        include: {
          problem: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      }
    );

    for (const testPoint of testPointsDbResult) {
      const testData = problemTestDataDbResult.find(
        (x) => x.order === testPoint.order
      );

      const avgResult = await serverPrisma.recordTestPoint.aggregate({
        where: {
          record: {
            problem: {
              id: testPoint.record.problem.id,
            },
          },
          order: testPoint.order,
          status: RecordTestPointStatus.Accepted,
        },
        _avg: {
          actualTimeMs: true,
          actualPeakMemoryBytes: true,
        },
      });

      result.push({
        order: testPoint.order,
        resultType: testPoint.status,
        actualTimeMs: testPoint.actualTimeMs,
        averageTimeMs: avgResult._avg.actualTimeMs ?? 0,
        timeLimitMs: testData?.timeLimitMs ?? 0,
        actualPeakMemoryBytes: testPoint.actualPeakMemoryBytes,
        averagePeakMemoryBytes: avgResult._avg.actualPeakMemoryBytes ?? 0,
        memoryLimitBytes: testData?.memoryLimitBytes ?? 0,
      });
    }
  }

  return NextResponse.json(result);
}
