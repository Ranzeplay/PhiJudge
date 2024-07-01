import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerSideClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "phijudge" },
    }
  );
  await supabase.from("requestLog").insert({
    url: request.nextUrl.pathname,
    ip: request.ip || "unknown",
    timestamp: new Date(),
    isApiRoute: request.nextUrl.pathname.startsWith("/api"),
  });

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const user = (await createSupabaseServerSideClient().auth.getUser()).data.user;
    const supaUser = await supabase
      .from("user")
      .select("isAdmin")
	  .eq("id", user?.id)
      .single();

    if (!supaUser.data?.isAdmin) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.nextUrl));
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/agent")) {
  }

  return NextResponse.next();
}
