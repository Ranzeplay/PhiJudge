import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { serverPrisma } from "@/lib/serverSidePrisma";
import dayjs from 'dayjs';

export default async function Page({ params }: { params: { id: string } }) {
	const agent = await serverPrisma.agent.findUnique({
		where: {
			id: params.id
		}
	});

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Agent details</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col space-y-2">
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
								<TableCell>{agent?.id}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>{agent?.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Status</TableCell>
								<TableCell>{agent?.status}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Last heartbeat time</TableCell>
								<TableCell>{dayjs(agent?.lastHeartbeat).format('YYYY-M-D H:mm:ss')}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Last network address</TableCell>
								<TableCell>{agent?.lastNetworkAddress}</TableCell>
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
					<Button variant={'outline'}>Suspend</Button>
					<Button variant={'destructive'}>Delete</Button>
				</CardContent>
			</Card>
		</>
	)
}