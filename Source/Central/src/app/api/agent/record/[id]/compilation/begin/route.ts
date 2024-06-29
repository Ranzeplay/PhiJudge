import { serverPrisma } from "@/lib/serverSidePrisma";
import { RecordStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  await serverPrisma.record.update({
	where: { id: parseInt(params.id) },
	data: {
	  status: RecordStatus.COMPILING,
	},
  });

  return NextResponse.json({});
}
