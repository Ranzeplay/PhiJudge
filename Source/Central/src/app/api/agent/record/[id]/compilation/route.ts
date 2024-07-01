'use server';

import {
  CompilationResult,
  CompilationResultType,
} from '@/lib/models/compilation';
import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServerSideClient } from '@/lib/supabase/server';
import { CompilationStatus, RecordStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as CompilationResult;

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

  if(resultType === CompilationStatus.FAILED_WITH_ERRORS) {
    await serverPrisma.record.update({
      where: { id: parseInt(params.id) },
      data: {
        status: RecordStatus.FAILED,
      },
    });
  }

  const channel = createSupabaseServerSideClient().realtime.channel(
    `phijudge.record.${params.id}`
  );
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      channel.send({
        type: 'broadcast',
        event: 'compilationResult',
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
