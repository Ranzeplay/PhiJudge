'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export async function GetProblemBasicInfo(problemId: number) {
	const problem = await serverPrisma.problem.findUnique({
		where: {
			id: problemId
		}
	});

	const result = {
		title: problem?.title,
		description: problem?.description
	}

	return JSON.stringify(result);
}

export async function UpdateTitle(problemId: number, title: string) {
	await serverPrisma.problem.update({
		where: {
			id: problemId
		},
		data: {
			title: title
		}
	});
}

export async function UpdateDescription(problemId: number, description: string) {
	await serverPrisma.problem.update({
		where: {
			id: problemId
		},
		data: {
			description: description
		}
	});
}
