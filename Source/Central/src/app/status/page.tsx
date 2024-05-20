import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Network } from "lucide-react";

export default function Page() {
	return (
		<div className="flex flex-col space-y-4">
			<Card>
				<CardHeader>
					<h1 className="font-semibold text-xl">Status: Available</h1>
				</CardHeader>
			</Card>
			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-1 space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Webpage</CardTitle>
							<Activity className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">2.43k <small>requests</small></div>
							<p className="text-xs text-muted-foreground">1.23K Avr.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Database</CardTitle>
							<Database className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">Up</div>
							<p className="text-xs text-muted-foreground">Up time: 93.28%</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Agents</CardTitle>
							<Network className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">12/16</div>
							<p className="text-xs text-muted-foreground">Up rate: 77.62%</p>
						</CardContent>
					</Card>
				</div>
				<div className="col-span-2 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Incidents</CardTitle>
							<CardDescription>In the last 24 hours</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="list-disc list-inside">
								<li>Website: 1 incident</li>
								<li>Database: 0 incidents</li>
								<li>Agents: 1 incident</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
