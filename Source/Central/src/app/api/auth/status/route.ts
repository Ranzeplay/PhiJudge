import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(request: NextApiRequest) {
	if(env.DEBUG_ENABLE_AUTH) {
		const supabase = createSupabaseServerSideClient();
	const supabaseUser = await supabase.auth.getUser();

	if(supabaseUser.error) {
		return NextResponse.json({ isLoggedIn: false }, { status: 200 });
	}

	const prisma = new PrismaClient();
	const prismaUser = await prisma.user.findUnique({
		where: {
			id: supabaseUser.data!.user.id
		}
	});

	return NextResponse.json({
		isLoggedIn: true,
		userName: prismaUser?.userName
	}, { status: 200 });
	} else {
		return NextResponse.json({ isLoggedIn: true, userName: "debug" }, { status: 200 });
	}
}
