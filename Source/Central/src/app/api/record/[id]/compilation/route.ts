import { serverPrisma } from "@/lib/serverSidePrisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const compilationSelectResult = await serverPrisma.record.findUnique({
    where: {
      id: parseInt(params.id),
    },
    select: {
      compilationOutput: true,
      compilationResult: true,
    },
  });

  return NextResponse.json(compilationSelectResult);
}
