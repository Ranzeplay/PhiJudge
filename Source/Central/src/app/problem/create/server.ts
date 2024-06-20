'use server';

import { PrismaClient } from "@prisma/client";
import { ProblemCreationSchema } from "./schema";
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
