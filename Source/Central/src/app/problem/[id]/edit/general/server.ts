'use server';

import { PrismaClient } from "@prisma/client";

export async function GetProblemBasicInfo(problemId: number) {
	const prisma = new PrismaClient();
	const problem = await prisma.problem.findUnique({
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
	const prisma = new PrismaClient();
	await prisma.problem.update({
		where: {
			id: problemId
		},
		data: {
			title: title
		}
	});
}

export async function UpdateDescription(problemId: number, description: string) {
	const prisma = new PrismaClient();
	await prisma.problem.update({
		where: {
			id: problemId
		},
		data: {
			description: description
		}
	});
}
