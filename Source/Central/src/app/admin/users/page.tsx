import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserView } from "@/lib/models/user";
import { serverPrisma } from "@/lib/serverSidePrisma";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {
	let users: UserView[] = [];
	const dbUsers = await serverPrisma.user.findMany();

	const supabase = createSupabaseServerSideClient();
	for (const user of dbUsers) {
		const supabaseUser = await supabase.auth.admin.getUserById(user.id);
		users.push({
			id: user.id,
			userName: user.userName,
			email: supabaseUser.data.user?.email || 'Unknown',
			isAdmin: user.isAdmin,
		});
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Existing users</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col space-y-2">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Username</TableHead>
								<TableHead>Email address</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Operations</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.userName}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
									<TableCell>
										<Button variant={'link'} className="text-blue-500" asChild>
											<Link href={`/admin/user/${user.id}`} className="flex">Edit</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	)
}
