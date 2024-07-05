'use server';

import {
  CompilationResult,
  CompilationResultType,
} from '@/lib/models/record/compilation';
import { serverPrisma } from '@/lib/serverSidePrisma';
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

  // End the whole record testing since the compilation failed
  if(resultType === CompilationStatus.FAILED_WITH_ERRORS) {
    await serverPrisma.record.update({
      where: { id: parseInt(params.id) },
      data: {
        status: RecordStatus.FAILED,
      },
    });
  }

  return NextResponse.json({});
}
