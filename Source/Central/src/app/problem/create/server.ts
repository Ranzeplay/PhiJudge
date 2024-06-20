'use server';

import { PrismaClient } from "@prisma/client";
import { ProblemCreationSchema, ProblemTestDataSchema, TestDataModification } from "./schema";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";

export async function HandleProblemCreation(formData: FormData): Promise<number> {
	const data = ProblemCreationSchema.parse({
		title: formData.get('title') as string,
		description: formData.get('description') as string,
		testData: formData.getAll('testData').map((testData) => {
			const [input, expectedOutput, timeLimitMs, memoryLimitBytes] = (testData as string).split(',');
			return {
				input,
				expectedOutput,
				timeLimitMs,
				memoryLimitBytes
			};
		})
	});

	const supabase = createSupabaseServerSideClient();
	const { data: user } = await supabase.auth.getUser();

	const prisma = new PrismaClient();
	const problem = await prisma.problem.create({
		data: {
			title: data.title,
			description: data.description,
			author: {
				connect: {
					id: user.user!.id
				}
			}
		}
	});

	return problem.id;
}

export async function HandleTestDataModification(formData: FormData): Promise<number> {
	console.log(formData);

	const data = ProblemTestDataSchema.parse({
		input: formData.get('input') as string,
		expectedOutput: formData.get('expectedOutput') as string,
		timeLimitMs: formData.get('timeLimitMs') as string,
		memoryLimitBytes: formData.get('memoryLimitBytes') as string,
		order: parseInt(formData.get('order') as string),
		modificationType: formData.get('modificationType') as TestDataModification,
		problemId: parseInt(formData.get('problemId') as string),
		existingId: parseInt(formData.get('existingId') as string || '-1')
	});

	const prisma = new PrismaClient();
	if (data.modificationType === TestDataModification.CREATE) {
		const result = await prisma.problemTestData.create({
			data: {
				input: data.input,
				expectedOutput: data.expectedOutput,
				timeLimitMs: parseInt(data.timeLimitMs),
				memoryLimitBytes: parseInt(data.memoryLimitBytes),
				order: data.order,
				problem: {
					connect: {
						id: data.problemId
					}
				}
			}
		});

		return result.id;
	} else if (data.modificationType === TestDataModification.UPDATE) {
		await prisma.problemTestData.update({
			where: {
				id: data.existingId
			},
			data: {
				input: data.input,
				expectedOutput: data.expectedOutput,
				timeLimitMs: parseInt(data.timeLimitMs),
				memoryLimitBytes: parseInt(data.memoryLimitBytes),
				order: data.order
			}
		});
	} else if (data.modificationType === TestDataModification.DELETE) {
		await prisma.problemTestData.delete({
			where: {
				id: data.existingId
			}
		});
	}

	return data.existingId!;
}
