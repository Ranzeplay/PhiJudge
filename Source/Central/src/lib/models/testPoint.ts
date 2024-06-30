import { RecordTestPointStatus } from "@prisma/client"

export type TestPointViewModel = {
	order: number,
	resultType: RecordTestPointStatus,
	actualTimeMs: number,
	averageTimeMs: number,
	timeLimitMs: number,
	actualPeakMemoryBytes: number,
	averagePeakMemoryBytes: number
	memoryLimitBytes: number
}