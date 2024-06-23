'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export type RecordPersistentData = {
	problem: {
		id: number,
		title: string,
		author: string,
		authorId: string
	},
	agentId: string,
	sourceCode: string,
	language: string,
	submitTime: Date
}

export async function GetRecordPersistentData(recordId: string) {
  const record = await serverPrisma.record.findUnique({
	where: {
	  id: parseInt(recordId),
	},
	include: {
	  problem: {
		include: {
			author: true,
		}
	  },
	  agent: true,
	},
  });

  const data: RecordPersistentData = {
	problem: {
	  id: record!.problem.id,
	  title: record!.problem.title,
	  authorId: record!.problem.author.id,
	  author: record!.problem.author.userName,
	},
	agentId: record!.agent!.id,
	sourceCode: record!.sourceCode,
	language: record!.languageId,
	submitTime: record!.submitTime,
  };
  return JSON.stringify(data);
}
