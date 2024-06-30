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
			recordId: parseInt(params.id)
		},
		orderBy: {
			order: 'asc'
		},
		include: {
			record: {
				include: {
					problem: {
						select: {
							id: true
						}
					}
				}
			}
		}
	});

	const problemTestDataDbResult = await serverPrisma.problemTestData.findMany({
		where: {
			problem: {
				id: testPointsDbResult[0].record.problem.id
			}
		},
		include: {
			problem: {
				select: {
					id: true
				}
			}
		},
		orderBy: {
			order: 'asc'
		}
	});

	const result: TestPointViewModel[] = [];
	for (const testPoint of testPointsDbResult) {
		const testData = problemTestDataDbResult.find(x => x.order === testPoint.order);

		const avgResult = await serverPrisma.recordTestPoint.aggregate({
			where: {
				record: {
					problem: {
						id: testPoint.record.problem.id
					}
				},
				order: testPoint.order,
				status: RecordTestPointStatus.Accepted
			},
			_avg: {
				actualTimeMs: true,
				actualPeakMemoryBytes: true
			},
		});

		result.push({
			order: testPoint.order,
			resultType: testPoint.status,
			actualTimeMs: testPoint.actualTimeMs,
			averageTimeMs: avgResult._avg.actualTimeMs ?? -1,
			timeLimitMs: testData?.timeLimitMs ?? NaN,
			actualPeakMemoryBytes: testPoint.actualPeakMemoryBytes,
			averagePeakMemoryBytes: avgResult._avg.actualPeakMemoryBytes ?? -1,
			memoryLimitBytes: testData?.memoryLimitBytes ?? NaN
		});
	}

	return NextResponse.json(result);
}
