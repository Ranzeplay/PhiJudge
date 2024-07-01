'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export async function HandleTestDataAddition(problemId: number, timeLimit: number, memoryLimit: number, inputData: string, expectedOutputData: string) {
	const pushBackOrder = await serverPrisma.problemTestPoint.count({
		where: {
			problemId: problemId
		}
	});

	await serverPrisma.problemTestPoint.create({
		data: {
			timeLimitMs: timeLimit,
			memoryLimitBytes: memoryLimit,
			input: inputData,
			expectedOutput: expectedOutputData,
			order: pushBackOrder,
			problem: {
				connect: {
					id: problemId
				}
			}
		}
	});
}
