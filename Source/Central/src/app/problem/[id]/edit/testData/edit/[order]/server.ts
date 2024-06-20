'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export async function FetchOriginalData(problemId: number, order: number) {
	const testData = await serverPrisma.problemTestData.findFirst({
		where: {
			order: order,
			problem: {
				id: problemId
			}
		}
	});

	return JSON.stringify(testData);
}

export async function UpdateLimits(testDataId: number, timeLimit: number, memoryLimit: number) {
	await serverPrisma.problemTestData.update({
		where: {
			id: testDataId
		},
		data: {
			timeLimitMs: timeLimit,
			memoryLimitBytes: memoryLimit
		}
	});
}

export async function UpdateInputData(testDataId: number, inputData: string) {
	await serverPrisma.problemTestData.update({
		where: {
			id: testDataId
		},
		data: {
			input: inputData
		}
	});
}

export async function UpdateExpectedOutputData(testDataId: number, expectedOutputData: string) {
	await serverPrisma.problemTestData.update({
		where: {
			id: testDataId
		},
		data: {
			expectedOutput: expectedOutputData
		}
	});
}

export async function DeleteTestData(testDataId: number) {
	await serverPrisma.problemTestData.delete({
		where: {
			id: testDataId
		}
	});
}
