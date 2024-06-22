"use server";

import { serverPrisma } from "@/lib/serverSidePrisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(
  request: NextApiRequest,
  { params }: { params: { id: number } }
) {
  const agent = serverPrisma.agent.findUnique({
	where: {
	  id: request.headers.authorization,
	},
  });

  if (!agent) {
	return NextResponse.json({ message: "Agent not found" }, { status: 401 });
  }

  const problem = await serverPrisma.problem.findUnique({
    where: {
      id: params.id,
    },
    include: {
      testData: true,
    },
  });

  if (!problem) {
    return NextResponse.json({ message: "Problem not found" }, { status: 404 });
  }

  const testData = problem.testData.map((t) => ({
    input: t.input,
    expectedOutput: t.expectedOutput,
    timeLimitMilliseconds: t.timeLimitMs,
    memoryLimitBytes: t.memoryLimitBytes,
	order: t.order,
  }));

  return NextResponse.json({
	id: problem.id,
	testPoints: testData,
  });
}
