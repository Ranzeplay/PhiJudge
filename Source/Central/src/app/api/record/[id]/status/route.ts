import { serverPrisma } from "@/lib/serverSidePrisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
	const recordSelectResult = await serverPrisma.record.findUnique({
		where: {
			id: parseInt(params.id),
		},
		select: {
			status: true,
		},
	});

	if (!recordSelectResult) {
		return new Response("Record not found", { status: 404 });
	}

	return new Response(recordSelectResult.status, { status: 200 });
}
