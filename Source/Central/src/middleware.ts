import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
	const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
		// Provide a custom schema. Defaults to "public".
		db: { schema: 'phijudge' }
	})
	const result = await supabase.from('requestLog').insert({
		url: request.nextUrl.pathname,
		ip: request.ip || 'unknown',
		timestamp: new Date(),
		isApiRoute: request.nextUrl.pathname.startsWith('/api'),
	});
	return NextResponse.next();
}
