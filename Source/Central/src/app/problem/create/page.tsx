'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { ProblemCreation, ProblemCreationSchema, ProblemTestData, ProblemTestDataSchema, ProblemTestDataSeries, ProblemTestDataSeriesSchema, TestDataModification } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Editor } from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HandleProblemCreation, HandleTestDataModification } from "./server";
import { serialize } from "object-to-formdata";

export default function Page() {
	const [problemId, setProblemId] = useState<number | null>(null);

	const basicInfoForm = useForm<ProblemCreation>({
		resolver: zodResolver(ProblemCreationSchema),
		defaultValues: {
			title: '',
			description: '',
		}
	});

	const testDataForm = useForm<ProblemTestDataSeries>({
		resolver: zodResolver(ProblemTestDataSeriesSchema),
		defaultValues: {
			data: []
		}
	});

	const [currentlyEditingTestDataIndex, setCurrentlyEditingTestDataIndex] = useState<number | null>(null);
	const [testDataEditorOpen, setTestDataEditorOpen] = useState<boolean>(false);
	const [currentlyEditingTestDataId, setCurrentlyEditingTestDataId] = useState<number | null>(null);

	const onSaveBasicInfo = async (data: ProblemCreation) => {
		const problemId = await HandleProblemCreation(serialize(data));
		setProblemId(problemId);
	}

	const router = useRouter();

	return (
		<div className="container flex flex-col space-y-2">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Basic information</CardTitle>
					<CardDescription>Title & description</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...basicInfoForm}>
						<form className="flex flex-col space-y-2">
							<FormField control={basicInfoForm.control} name="title" render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl className="-mt-1">
										<Input placeholder="Enter text" {...field} className="mr-8" readOnly={problemId != null} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField control={basicInfoForm.control} name="description" render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl className="-mt-1">
										<Editor className="border rounded" {...field} height={400} options={{ readOnly: problemId != null }} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />

							<div className="block space-x-4">
								<Button onClick={basicInfoForm.handleSubmit(onSaveBasicInfo)}>Save</Button>
								<Button variant={'outline'} onClick={() => router.back()}>Discard</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Test data</CardTitle>
					<div className="text-sm text-muted-foreground">
						<p>{testDataForm.getValues().data.length} entries logged.</p>
						<p>The first entry will be the example test data shown.</p>
					</div>
				</CardHeader>
				<CardContent>
					<Button variant={'link'} className="text-blue-500" onClick={() => openTestDataEditor(testDataForm.getValues().data.length)}>Add new data</Button>
					<div className="flex flex-col space-y-2 mt-2">
						{testDataForm.getValues().data.map((_, index) => (
							<Card>
								<CardHeader>
									<CardTitle className="text-blue-500 hover:underline hover:cursor-pointer" onClick={() => openTestDataEditor(index)}>#{index}</CardTitle>
									<div className="flex flex-row space-x-2">
										{index === 0 && <Badge>Example data</Badge>}
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			<TestDataEditor />
		</div>
	);

	function openTestDataEditor(index: number) {
		setTestDataEditorOpen(true);
		setCurrentlyEditingTestDataIndex(index);
	}

	function closeTestDataEditor() {
		setTestDataEditorOpen(false);
		setCurrentlyEditingTestDataIndex(null);
	}

	function TestDataEditor() {
		const testDataEditorForm = useForm<ProblemTestData>({
			resolver: zodResolver(ProblemTestDataSchema), defaultValues: {
				input: '',
				expectedOutput: '',
				timeLimitMs: '',
				memoryLimitBytes: '',
				problemId: problemId!,
				modificationType: currentlyEditingTestDataIndex === testDataForm.getValues().data.length ? TestDataModification.CREATE : TestDataModification.UPDATE,
			}
		});
		useEffect(() => {
			if (currentlyEditingTestDataIndex !== testDataForm.getValues().data.length) {
				testDataEditorForm.reset(testDataForm.getValues().data[currentlyEditingTestDataIndex!]);
			} else {
				testDataEditorForm.reset();
			}
		}, [currentlyEditingTestDataIndex]);

		async function onTestDataFormSubmit(newData: ProblemTestData) {
			console.log(newData);
			
			const dataSeries = testDataForm.getValues().data;
			if (currentlyEditingTestDataIndex! == testDataForm.getValues().data.length) {
				dataSeries.push(newData);
			} else {
				dataSeries[currentlyEditingTestDataIndex!] = newData;
			}
			testDataForm.setValue('data', dataSeries);

			const id = await HandleTestDataModification(serialize(newData));
			setCurrentlyEditingTestDataId(id);

			closeTestDataEditor();
		}

		return (
			<Sheet open={testDataEditorOpen} onOpenChange={(e) => { setTestDataEditorOpen(e) }}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Edit test data</SheetTitle>
					</SheetHeader>
					<Form {...testDataEditorForm}>
						<form className="flex flex-col space-y-3 mt-4">
							<FormField control={testDataEditorForm.control} name="timeLimitMs" render={({ field }) => (
								<FormItem>
									<FormLabel>Time limit</FormLabel>
									<FormControl className="-mt-1">
										<Input {...field} placeholder="Milliseconds" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField control={testDataEditorForm.control} name="memoryLimitBytes" render={({ field }) => (
								<FormItem>
									<FormLabel>Memory limit</FormLabel>
									<FormControl className="-mt-1">
										<Input {...field} placeholder="Bytes" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField control={testDataEditorForm.control} name="input" render={({ field }) => (
								<FormItem>
									<FormLabel>Input</FormLabel>
									<FormControl className="-mt-1">
										<Textarea {...field} placeholder="Type or paste text" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField control={testDataEditorForm.control} name="expectedOutput" render={({ field }) => (
								<FormItem>
									<FormLabel>Expected output</FormLabel>
									<FormControl className="-mt-1">
										<Textarea {...field} placeholder="Type or paste text" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />

							<div className="block space-x-2">
								<Button onClick={() => testDataEditorForm.handleSubmit(onTestDataFormSubmit)}>Apply</Button>
								<Button variant={'destructive'} onClick={() => closeTestDataEditor()}>Delete</Button>
								<Button variant={'outline'} onClick={() => closeTestDataEditor()}>Discard</Button>
							</div>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		);
	}
}
