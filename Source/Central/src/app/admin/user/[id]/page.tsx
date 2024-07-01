import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { serverPrisma } from "@/lib/serverSidePrisma";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
	const dbUser = await serverPrisma.user.findUnique({
		where: {
			id: params.id
		}
	});
	const supaUser = await createSupabaseServiceRoleClient().auth.admin.getUserById(params.id);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>User details</CardTitle>
					<CardDescription>{params.id}</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Key</TableHead>
								<TableHead>Value</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell>{dbUser?.id}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Email address</TableCell>
								<TableCell>{supaUser.data.user?.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Is admin</TableCell>
								<TableCell>{dbUser?.isAdmin ? 'true' : 'false'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Operations</CardTitle>
				</CardHeader>
				<CardContent className="space-x-2">
					<Button disabled>Switch admin state</Button>
					<Button variant={'destructive'} disabled>Delete</Button>
				</CardContent>
			</Card>
		</>
	)
}
