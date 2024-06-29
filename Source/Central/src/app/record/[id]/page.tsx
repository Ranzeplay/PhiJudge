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
import { AlertTriangle, ArrowRight, Check, Loader } from "lucide-react";
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
import { createSupabaseBrowserSideClient } from "@/lib/supabase/client";
import { GetRecordPersistentData, GetRecordStatus, RecordPersistentData } from "./server";
import dayjs from "dayjs";
import { RecordStatus } from "@prisma/client";

export default function Page({ params }: { params: { id: string } }) {
	const [persistentData, setPersistentData] = useState<RecordPersistentData | null>(null);
	const [sourceCodeHtml, setSourceCodeHtml] = useState<string | null>(null);
	const [recordStatus, setRecordStatus] = useState<RecordStatus | null>(null);
	const [compilationOutput, setCompilationOutput] = useState<string | null>(null);

	useEffect(() => {
		async function fetchPersistentData() {
			const data = await GetRecordPersistentData(params.id);
			setPersistentData(JSON.parse(data) as RecordPersistentData);
		}

		async function fetchRecordStatus() {
			const status = await GetRecordStatus(params.id);
			setRecordStatus(status || RecordStatus.UNKNOWN);
		}

		fetchPersistentData();
		fetchRecordStatus();
	}, []);

	useEffect(() => {
		async function highlightCode() {
			const html = await codeToHtml(persistentData?.sourceCode || '', {
				lang: persistentData?.language || '',
				theme: 'github-light',
			});

			setSourceCodeHtml(html);
		}

		highlightCode();
	}, [persistentData]);

	const supabase = createSupabaseBrowserSideClient();
	const channel = supabase.channel(`phijudge.record.${params.id}`);
	channel.on('broadcast', { event: 'compilationResult' }, payload => {
		const { type: CompilationResultType, output: string } = payload;
	});

	return (
		<div className="grid grid-cols-3 w-full gap-4">
			<div className="col-span-1 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Steps</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col space-y-1">
						<QueueIndicator status={recordStatus || RecordStatus.UNKNOWN} />
						<CompileIndicator status={recordStatus || RecordStatus.UNKNOWN} />
						<TestIndicator status={recordStatus || RecordStatus.UNKNOWN} />
						<FinishIndicator status={recordStatus || RecordStatus.UNKNOWN} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col space-y-1">
						<div>
							<h4>Id</h4>
							<p className="ml-2 font-mono text-sm">{params.id}</p>
						</div>
						<div>
							<h4>Time</h4>
							<p className="ml-2 font-mono text-sm">{dayjs(persistentData?.submitTime).format('YYYY/M/D H:mm')}</p>
						</div>
						<div>
							<h4>Problem</h4>
							<Link className="flex text-blue-500 hover:underline ml-2 text-sm" href={`/problem/${persistentData?.problem.id}/details`}>{persistentData?.problem.title}</Link>
						</div>
						<div>
							<h4>Author</h4>
							<Link className="flex text-blue-500 hover:underline ml-2 text-sm" href={`/user/${persistentData?.problem.authorId}`}>{persistentData?.problem.author}</Link>
						</div>
						<div>
							<h4>Status & Result</h4>
							<p className="ml-2 font-mono text-sm">{recordStatus}</p>
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
							<Badge variant={'secondary'}>{persistentData?.language}</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{sourceCodeHtml && <div dangerouslySetInnerHTML={{ __html: sourceCodeHtml }} />}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Compilation output</CardTitle>
					</CardHeader>
					<CardContent>
						<Editor language="plaintext" height={100} value={compilationOutput || 'Waiting...'} options={{ readOnly: true }} />
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

function QueueIndicator(props: { status: RecordStatus }) {
	return (
		<p className={`flex flex-row gap-x-1 items-center ${props.status !== RecordStatus.PENDING && 'text-muted-foreground'}`}>
			{props.status !== RecordStatus.PENDING ? <Check size={15} /> : <ArrowRight size={15} />}
			<span>Queue</span>
		</p>
	)
}

function CompileIndicator(props: { status: RecordStatus }) {
	if (props.status === RecordStatus.COMPILING) {
		return (
			<p className="flex flex-row gap-x-1 items-center">
				<ArrowRight size={15} />
				<span>Compile</span>
			</p>
		)
	} else if (props.status === RecordStatus.PENDING) {
		return (
			<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
				<Loader size={15} opacity={0} />
				<span>Compile</span>
			</p>
		)
	} else {
		return (
			<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
				<Check size={15} />
				<span>Compile</span>
			</p>
		)
	}
}

function TestIndicator(props: { status: RecordStatus }) {
	if (props.status === RecordStatus.TESTING) {
		return (
			<p className="flex flex-row gap-x-1 items-center">
				<ArrowRight size={15} />
				<span>Test</span>
			</p>
		)
	}else if (props.status === RecordStatus.PENDING || props.status === RecordStatus.COMPILING) {
		return (
			<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
				<Loader size={15} opacity={0} />
				<span>Test</span>
			</p>
		)
	} else {
		return (
			<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
				<Check size={15} />
				<span>Test</span>
			</p>
		)
	}
}

function FinishIndicator(props: { status: RecordStatus }) {
	if(props.status === RecordStatus.FAILED || props.status === RecordStatus.PASSED) {
		if(props.status === RecordStatus.FAILED) {
			return (
				<p className="flex flex-row gap-x-1 items-center">
					<AlertTriangle size={15} />
					<span>Finished</span>
				</p>
			)
		} else {
			return (
				<p className="flex flex-row gap-x-1 items-center">
					<Check size={15} />
					<span>Finish</span>
				</p>
			)
		}
	} else {
		return (
			<p className="flex flex-row gap-x-1 items-center text-muted-foreground">
				<Loader size={15} opacity={0} />
				<span>Finish</span>
			</p>
		)
	}
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
