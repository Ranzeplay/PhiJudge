import { serverPrisma } from "@/lib/serverSidePrisma";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import { RecordStatus, RecordTestPointStatus } from "@prisma/client";
import { NextApiRequest } from "next";
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
  Accepted = "accepted",
  WrongAnswer = "wrongAnswer",
  TimeLimitExceeded = "timeLimitExceeded",
  MemoryLimitExceeded = "memoryLimitExceeded",
  OutputLimitExceeded = "outputLimitExceeded",
  RuntimeError = "runtimeError",
  Unknown = "unknown",
}

export async function POST(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  const body = request.body as ExecutionResult;

  let testPointStatus: RecordTestPointStatus;
  switch (body.type) {
    case ExecutionResultType.Accepted:
      testPointStatus = RecordTestPointStatus.Accepted;
      break;
    case ExecutionResultType.WrongAnswer:
      testPointStatus = RecordTestPointStatus.WrongAnswer;
      break;
    case ExecutionResultType.TimeLimitExceeded:
      testPointStatus = RecordTestPointStatus.TimeLimitExceeded;
      break;
    case ExecutionResultType.MemoryLimitExceeded:
      testPointStatus = RecordTestPointStatus.MemoryLimitExceeded;
      break;
    case ExecutionResultType.OutputLimitExceeded:
      testPointStatus = RecordTestPointStatus.OutputLimitExceeded;
      break;
    case ExecutionResultType.RuntimeError:
      testPointStatus = RecordTestPointStatus.RuntimeError;
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
