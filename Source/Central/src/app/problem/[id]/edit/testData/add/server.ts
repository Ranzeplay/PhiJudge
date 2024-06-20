'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export async function HandleTestDataAddition(problemId: number, timeLimit: number, memoryLimit: number, inputData: string, expectedOutputData: string) {
	const pushBackOrder = await serverPrisma.problemTestData.count({
		where: {
			problemId: problemId
		}
	});

	await serverPrisma.problemTestData.create({
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
