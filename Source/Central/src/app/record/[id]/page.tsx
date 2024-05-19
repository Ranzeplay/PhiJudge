'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

export default function Page(params: { params: { id: string } }) {
	return (
		<div className="grid grid-cols-3 w-full gap-4">
			<div className="col-span-1 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Steps</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col space-y-1">
						<p className="flex flex-row gap-x-1 text-muted-foreground items-center">
							<Check size={15} />
							<span>Queue</span>
						</p>
						<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
							<Check size={15} />
							<span>Compile</span>
						</p>
						<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
							<AlertTriangle size={15} />
							<span>Execute</span>
						</p>
						<p className="flex flex-row gap-x-1 items-center">
							<ArrowRight size={15} />
							<span>Finalize</span>
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col space-y-1">
						<div>
							<h4>Id</h4>
							<p className="ml-2 font-mono text-sm">1</p>
						</div>
						<div>
							<h4>Time</h4>
							<p className="ml-2 font-mono text-sm">2024/5/19 13:45</p>
						</div>
						<div>
							<h4>Problem</h4>
							<Link className="flex text-blue-500 hover:underline ml-2 text-sm" href="/problem/1/details">Hello, world</Link>
						</div>
						<div>
							<h4>Author</h4>
							<Link className="flex text-blue-500 hover:underline ml-2 text-sm" href="/user/1">Jeb Feng</Link>
						</div>
						<div>
							<h4>Status</h4>
							<p className="ml-2 font-mono text-sm">Finished</p>
						</div>
						<div>
							<h4>Result</h4>
							<p className="ml-2 font-mono text-sm">Failed</p>
						</div>
						<div>
							<h4>Rate</h4>
							<p className="ml-2 font-mono text-sm">3 / 8</p>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="col-span-2 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle className="flex flex-row space-x-2 items-center">
							<span>Source code</span>
							<Badge variant={'secondary'}>C#</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Editor language="csharp" height={300} options={{ readOnly: true }} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Compilation output</CardTitle>
					</CardHeader>
					<CardContent>
						<Editor language="plaintext" height={100} value="[Process exited with code 0]" options={{ readOnly: true }} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Test points</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col space-y-4">
						<div className="flex flex-row space-x-2">
							<Card className="flex-grow">
								<CardHeader>
									<CardTitle>Time consumption</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Limit: 1000ms</p>
									<p>Average: 374.13ms (37.4%)</p>
									<p>Maximum: 443.12ms (44.3%)</p>
								</CardContent>
							</Card>
							<Card className="flex-grow">
								<CardHeader>
									<CardTitle>Memory consumption</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Limit: 1024kB</p>
									<p>Average: 42kB (4.1%)</p>
									<p>Maximum: 82kB (8.0%)</p>
								</CardContent>
							</Card>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Id</TableHead>
									<TableHead>Result</TableHead>
									<TableHead>Memory</TableHead>
									<TableHead>Time</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>1</TableCell>
									<TableCell>Correct</TableCell>
									<TableCell>42kB</TableCell>
									<TableCell>374.13ms</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Wrong Answer</TableCell>
									<TableCell>82kB</TableCell>
									<TableCell>443.12ms</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}