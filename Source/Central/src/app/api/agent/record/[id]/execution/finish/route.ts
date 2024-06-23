import { serverPrisma } from "@/lib/serverSidePrisma";
import { RecordStatus, RecordTestPointStatus } from "@prisma/client";

export async function GET(_request: Request, { params }: { params: { id: number } }) {
  const testPoints = await serverPrisma.recordTestPoint.findMany({
	where: {
	  record: {
		id: params.id
	  }
	},
	select: {
		status: true
	}
  });

  const allTestPointsPassed = testPoints.every(testPoint => testPoint.status === RecordTestPointStatus.Accepted);
  await serverPrisma.record.update({
	where: { id: params.id },
	data: {
	  status: allTestPointsPassed ? RecordStatus.PASSED : RecordStatus.FAILED,
	},
  });
}
