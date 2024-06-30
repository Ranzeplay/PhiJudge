import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
	return (
		<Card className="flex flex-col space-y-2 mx-auto w-96">
			<CardHeader>
				<CardTitle>Unauthorized</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<p>You are not authorized to view this page.</p>
				<Button asChild>
					<Link href={"/"}>Go back home</Link>
				</Button>
			</CardContent>
		</Card>
	)
}