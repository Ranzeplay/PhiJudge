'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteTestData, FetchOriginalData, UpdateExpectedOutputData, UpdateInputData, UpdateLimits } from "./server";
import { problemTestPoint } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string, order: string } }) {
	const [timeLimit, setTimeLimit] = useState<number | null>(null);
	const [memoryLimit, setMemoryLimit] = useState<number | null>(null);
	const [inputData, setInputData] = useState<string>('');
	const [expectedOutputData, setExpectedOutputData] = useState<string>('');
	const [testDataId, setTestDataId] = useState<number>(-1);

	useEffect(() => {
		FetchOriginalData(parseInt(params.id), parseInt(params.order)).then(data => {
			const testData = JSON.parse(data) as problemTestPoint;
			setTimeLimit(testData.timeLimitMs);
			setMemoryLimit(testData.memoryLimitBytes);
			setInputData(testData.input);
			setExpectedOutputData(testData.expectedOutput);
			setTestDataId(testData.id);
		});
	}, []);

	const router = useRouter();
	function DeleteCurrent() {
		DeleteTestData(testDataId).then(() => {
			router.push(`/problem/${params.id}/edit/testData`);
		});
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Limits</CardTitle>
					<CardDescription>All fields required</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Input placeholder="Time limit (ms)" value={timeLimit || ''} onChange={e => setTimeLimit(e.target.valueAsNumber)} type="number" />
					<Input placeholder="Memory limit (bytes)" value={memoryLimit || ''} onChange={e => setMemoryLimit(e.target.valueAsNumber)} type="number" />
					<Button onClick={() => UpdateLimits(testDataId, timeLimit!, memoryLimit!)}>Update</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Input data</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Textarea value={inputData} onChange={e => setInputData(e.target.value)} />
					<Button onClick={() => UpdateInputData(testDataId, inputData)}>Update</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Expected output data</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Textarea value={expectedOutputData} onChange={e => setExpectedOutputData(e.target.value)} />
					<Button onClick={() => UpdateExpectedOutputData(testDataId, expectedOutputData)}>Update</Button>
				</CardContent>
			</Card>
			<div className="block space-x-2">
				<Button variant={'outline'} asChild>
					<Link href={'/problem/[id]/edit/testData'} as={`/problem/${params.id}/edit/testData`}>Back</Link>
				</Button>
				<Button variant={'destructive'} onClick={() => DeleteCurrent()}>Delete</Button>
			</div>
		</>
	)
}
