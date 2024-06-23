import { serverPrisma } from "@/lib/serverSidePrisma";
import { RecordStatus } from "@prisma/client";

export async function GET(_request: Request, { params }: { params: { id: number } }) {
  await serverPrisma.record.update({
	where: { id: params.id },
	data: {
	  status: RecordStatus.COMPILING,
	},
  });
}
