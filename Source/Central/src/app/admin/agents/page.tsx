import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAgentSheet } from "./add";
import { serverPrisma } from "@/lib/serverSidePrisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function Page() {
	const agents = await serverPrisma.agent.findMany();

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Operations</CardTitle>
				</CardHeader>
				<CardContent>
					<AddAgentSheet />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Existing agents</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col space-y-2">
					{agents.map(agent => (
						<Card key={agent.id}>
							<CardHeader>
								<CardTitle>
									<Link className="text-blue-500 hover:underline" href={`/admin/agent/${agent.id}`}>{agent.name}</Link>
								</CardTitle>
								<CardDescription>{agent.id}</CardDescription>
							</CardHeader>
							<CardContent>
								<Badge>{agent.status}</Badge>
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>
		</>
	)
}
