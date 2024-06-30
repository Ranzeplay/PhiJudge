import { serverPrisma } from "@/lib/serverSidePrisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
	const testPoints = await serverPrisma.recordTestPoint.findMany({
		where: {
			recordId: parseInt(params.id)
		},
		orderBy: {
			order: 'asc'
		}
	});

	return NextResponse.json(testPoints);
}
