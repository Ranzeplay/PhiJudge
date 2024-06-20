'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { ProblemCreation, ProblemCreationSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { HandleProblemCreation } from "./server";
import { serialize } from "object-to-formdata";

export default function Page() {
	const basicInfoForm = useForm<ProblemCreation>({
		resolver: zodResolver(ProblemCreationSchema),
		defaultValues: {
			title: '',
			description: '',
		}
	});

	const router = useRouter();
	const onSaveBasicInfo = async (data: ProblemCreation) => {
		const problemId = await HandleProblemCreation(serialize(data));
		router.push(`/problem/${problemId}/edit/general`);
	}

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
										<Input placeholder="Enter text" {...field} className="mr-8" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField control={basicInfoForm.control} name="description" render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl className="-mt-1">
										<Editor className="border rounded" {...field} height={400} />
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
		</div>
	);
}
