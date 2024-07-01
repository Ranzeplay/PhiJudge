'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { GetProblemBasicInfo, UpdateDescription, UpdateTitle } from "./server";

export default function Page({ params }: { params: { id: string } }) {
	const problemId = parseInt(params.id);

	const [enableDangerZone, setEnableDangerZone] = useState(true);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	useEffect(() => {
		async function getInitialValue() {
			const jsonData = await GetProblemBasicInfo(problemId);
			const data = JSON.parse(jsonData);
			setTitle(data.title);
			setDescription(data.description);
		}

		getInitialValue();
	}, [problemId]);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Title</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Input className="w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
					<Button onClick={() => UpdateTitle(problemId, title)}>Update</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Description</CardTitle>
					<CardDescription>Markdown format</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Editor className="border rounded" height={400} value={description} onChange={e => setDescription(e!)} />
					<Button onClick={() => UpdateDescription(problemId, description)}>Update</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Danger zone</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex items-center space-x-2">
						<Checkbox id="enable-danger-zone-checkbox" checked={enableDangerZone} onChange={() => setEnableDangerZone(!enableDangerZone)} />
						<label
							htmlFor="enable-danger-zone-checkbox"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Enable danger zone operations
						</label>
					</div>
					<Button variant={'destructive'} disabled={!enableDangerZone}>Delete problem</Button>
				</CardContent>
			</Card>
		</>
	)
}