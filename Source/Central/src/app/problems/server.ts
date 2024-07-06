'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { problem } from '@prisma/client';
import { ProblemIndexView } from './schema';

export async function GetProblems(text: string, page: number, size: number) {
  if (text.length > 0) {
    let result: problem[] = [];

    if (Number.isInteger(text)) {
      const problemById = await serverPrisma.problem.findUnique({
        where: {
          id: parseInt(text),
        },
      });
      if (problemById) {
        result.push(problemById);
      }
    }

    const problemMatchTitle = await serverPrisma.problem.findMany({
      where: {
        title: {
          contains: text,
        },
      },
      orderBy: { id: 'asc' },
    });
    result = result.concat(problemMatchTitle);

    const problemMatchDescription = await serverPrisma.problem.findMany({
      where: {
        description: {
          contains: text,
        },
      },
      orderBy: { id: 'asc' },
    });
    result = result.concat(problemMatchDescription);

    //   const distinctResult: problem[] = [];
    //   result.forEach((problem) => {
    // 	if (!distinctResult.find((p) => p.id === problem.id)) {
    // 	  distinctResult.push(problem);
    // 	}
    //   });
    const distinctResult: problem[] = result.filter(
      (problem, index, self) =>
        index === self.findIndex((p) => p.id === problem.id)
    );

    const index = distinctResult.slice((page - 1) * size, page * size);

    return {
      problems: index,
      size: index.length,
      page: page,
      totalPages: Math.ceil(distinctResult.length / size),
    } as ProblemIndexView;
  } else {
    const totalProblemCount = await serverPrisma.problem.count();
    const index = await serverPrisma.problem.findMany({
      orderBy: { id: 'asc' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      problems: index,
      size: index.length,
      page: page,
      totalPages: Math.ceil(
        totalProblemCount / size
      ),
    } as ProblemIndexView;
  }
}
