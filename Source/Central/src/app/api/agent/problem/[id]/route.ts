"use server";

import { serverPrisma } from "@/lib/serverSidePrisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = serverPrisma.agent.findUnique({
    where: {
      id: request.headers.get("Authorization") || "",
    },
  });

  if (!agent) {
    return NextResponse.json({ message: "Agent not found" }, { status: 401 });
  }

  const problem = await serverPrisma.problem.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      testData: true,
    },
  });

  if (!problem) {
    return NextResponse.json({ message: "Problem not found" }, { status: 404 });
  }

  const testData = problem.testData.map(t => ({
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
