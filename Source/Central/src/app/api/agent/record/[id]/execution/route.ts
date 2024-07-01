import { serverPrisma } from "@/lib/serverSidePrisma";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import { RecordStatus, RecordTestPointStatus } from "@prisma/client";
import { NextResponse } from "next/server";

type ExecutionResult = {
  recordId: number;
  order: number;
  type: ExecutionResultType;
  output: string;
  timeMilliseconds: number;
  peakMemoryBytes: number;
};

enum ExecutionResultType {
  Accepted = "Accepted",
  WrongAnswer = "WrongAnswer",
  TimeLimitExceeded = "TimeLimitExceeded",
  MemoryLimitExceeded = "MemoryLimitExceeded",
  OutputLimitExceeded = "OutputLimitExceeded",
  RuntimeError = "RuntimeError",
  Unknown = "Unknown",
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as ExecutionResult;

  let testPointStatus: RecordTestPointStatus;
  switch (body.type) {
    case ExecutionResultType.Accepted:
      testPointStatus = RecordTestPointStatus.ACCEPTED;
      break;
    case ExecutionResultType.WrongAnswer:
      testPointStatus = RecordTestPointStatus.WRONG_ANSWER;
      break;
    case ExecutionResultType.TimeLimitExceeded:
      testPointStatus = RecordTestPointStatus.TIME_LIMIT_EXCEEDED;
      break;
    case ExecutionResultType.MemoryLimitExceeded:
      testPointStatus = RecordTestPointStatus.MEMORY_LIMIT_EXCEEDED;
      break;
    case ExecutionResultType.OutputLimitExceeded:
      testPointStatus = RecordTestPointStatus.OUTPUT_LIMIT_EXCEEDED;
      break;
    case ExecutionResultType.RuntimeError:
      testPointStatus = RecordTestPointStatus.RUNTIME_ERROR;
      break;
    default:
      throw new Error("Invalid test point status");
  }

  await serverPrisma.recordTestPoint.create({
    data: {
      order: body.order,
      status: testPointStatus,
      actualOutput: body.output,
      actualTimeMs: body.timeMilliseconds,
      actualPeakMemoryBytes: body.peakMemoryBytes,
      record: {
        connect: {
          id: parseInt(params.id),
        },
      },
    },
  });

  await serverPrisma.record.update({
    where: { id: parseInt(params.id) },
    data: {
      status: RecordStatus.TESTING,
    },
  });

  const channel = createSupabaseServerSideClient().realtime.channel(
    `phijudge.record.${params.id}`
  );

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.send({
        type: "broadcast",
        event: "testPoint",
        payload: {
          order: body.order,
          status: testPointStatus,
          actualTimeMs: body.timeMilliseconds,
          actualPeakMemoryBytes: body.peakMemoryBytes,
        },
      });
    }
  });
  channel.unsubscribe();

  return NextResponse.json({ success: true });
}
