import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {
	const supabase = createSupabaseServerSideClient();
	await supabase.auth.signOut();

	return (
		<Card className="flex flex-col space-y-2 mx-auto w-96">
			<CardHeader>
				<CardTitle>Logout</CardTitle>
				<CardDescription>Successfully logged out from your account.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<Button className="flex" asChild>
					<Link href={"/"}>Go homepage</Link>
				</Button>
				<Button className="flex" variant={'secondary'} asChild>
					<Link href={"/auth/login"}>Login another account</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
