import { serverPrisma } from "@/lib/serverSidePrisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(request: NextApiRequest, { params }: { params: { id: string } }) {
	const languages = request.body as string[];

	await serverPrisma.agent.update({
		where: {
			id: params.id,
		},
		data: {
			availableLanguageId: {
				set: languages,
			},
		},
	});

	return NextResponse.json({ message: "Languages updated" });
}
