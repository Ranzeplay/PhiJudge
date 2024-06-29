import { serverPrisma } from "@/lib/serverSidePrisma";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import { CompilationStatus } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export type CompilationResult = {
  recordId: number;
  type: CompilationResultType;
  output: string;
};

export enum CompilationResultType {
  PassedWithoutWarnings = "passedWithoutWarnings",
  PassedWithWarnings = "passedWithWarnings",
  FailedWithErrors = "failedWithErrors",
  Unknown = "unknown",
}

export async function POST(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  const body = request.body as CompilationResult;

  let resultType: CompilationStatus;
  switch (body.type) {
    case CompilationResultType.PassedWithoutWarnings:
      resultType = CompilationStatus.PASSED_WITHOUT_WARNINGS;
      break;
    case CompilationResultType.PassedWithWarnings:
      resultType = CompilationStatus.PASSED_WITH_WARNINGS;
      break;
    case CompilationResultType.FailedWithErrors:
      resultType = CompilationStatus.FAILED_WITH_ERRORS;
      break;
    default:
      resultType = CompilationStatus.UNKNOWN;
      break;
  }

  await serverPrisma.record.update({
    where: { id: parseInt(params.id) },
    data: {
      compilationOutput: body.output,
      compilationResult: resultType,
    },
  });

  const channel = createSupabaseServerSideClient().realtime.channel(
    `phijudge.record.${params.id}`
  );
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.send({
        type: "broadcast",
        event: "compilationResult",
        payload: {
          type: body.type,
          output: body.output,
        },
      });
    }
  });
  channel.unsubscribe();

  return NextResponse.json({});
}
