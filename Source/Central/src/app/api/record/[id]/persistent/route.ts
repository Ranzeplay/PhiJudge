import { RecordPersistentData } from "@/lib/models/recordPersistent";
import { serverPrisma } from "@/lib/serverSidePrisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const record = await serverPrisma.record.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      problem: {
        include: {
          author: true,
        },
      },
      agent: {
        select: {
          id: true,
        }
      },
      language: true
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
    language: record!.language,
    submitTime: record!.submitTime,
  };

  return NextResponse.json(data);
}
