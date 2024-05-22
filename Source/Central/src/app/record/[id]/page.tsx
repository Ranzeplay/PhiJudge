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
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ReferenceLine,
} from 'recharts';
import { useEffect, useState } from "react";
import {
	BundledLanguage,
	BundledTheme,
	codeToHtml,
	getHighlighter
} from 'shiki/bundle/full'

export default function Page(params: { params: { id: string } }) {
	const [sourceCode, setSourceCode] = useState('' as string);
	useEffect(() => {
		async function highlightCode() {
			const code = `
#include <stdio.h>

int main() {
	printf("Hello, World!\\n");
	return 0;
}
			`;
			const html = await codeToHtml(code, {
				lang: 'c',
				theme: 'github-light',
			});
			setSourceCode(html);
		}

		highlightCode();
	});

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
							<span>Finish</span>
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
						{sourceCode && <div dangerouslySetInnerHTML={{ __html: sourceCode }} />}
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
									<TimeChart />
								</CardContent>
							</Card>
							<Card className="flex-grow">
								<CardHeader>
									<CardTitle>Memory consumption</CardTitle>
								</CardHeader>
								<CardContent>
									<MemoryChart />
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
									<TableCell>42 Bytes</TableCell>
									<TableCell>374.13ms</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Wrong Answer</TableCell>
									<TableCell>82 Bytes</TableCell>
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

function TimeChart() {
	const data = [
		{ name: '1', actual: 42.85, average: 42.95 },
		{ name: '2', actual: 43.12, average: 42.65 },
		{ name: '3', actual: 42.93, average: 44.85 },
		{ name: '4', actual: 42.82, average: 40.85 },
		{ name: '5', actual: 42.95, average: 42.85 },
		{ name: '6', actual: 42.78, average: 41.85 },
		{ name: '7', actual: 42.92, average: 47.85 },
		{ name: '8', actual: 43.12, average: 42.25 },
	];

	return (
		<>
			<BarChart width={300} height={300} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="actual" fill="#82ca9d" />
				<Bar dataKey="average" fill="#800080" />
				<ReferenceLine y={128} stroke="red" label="Limit" />
			</BarChart>
		</>
	)
}

function MemoryChart() {
	const data = [
		{ name: '1', actual: 42.85, average: 42.95 },
		{ name: '2', actual: 43.12, average: 42.65 },
		{ name: '3', actual: 42.93, average: 44.85 },
		{ name: '4', actual: 42.82, average: 40.85 },
		{ name: '5', actual: 42.95, average: 42.85 },
		{ name: '6', actual: 42.78, average: 41.85 },
		{ name: '7', actual: 42.92, average: 47.85 },
		{ name: '8', actual: 43.12, average: 42.25 },
	];

	return (
		<>
			<BarChart width={300} height={300} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="actual" fill="#82ca9d" />
				<Bar dataKey="average" fill="#800080" />
				<ReferenceLine y={128} stroke="red" label="Limit" />
			</BarChart>
		</>
	)
}
