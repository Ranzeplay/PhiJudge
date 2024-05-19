"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
	const [lang, setLang] = useState("");

	return (
		<div className="grid grid-cols-3 w-full gap-4">
			<div className="col-span-2">
				<Card>
					<CardHeader>
						<CardTitle>Code</CardTitle>
					</CardHeader>
					<CardContent>
						<Editor language={lang} height={500} />
					</CardContent>
				</Card>
			</div>
			<div className="col-span-1 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Options</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label>Language</Label>
							<Select onValueChange={setLang}>
								<SelectTrigger>
									<SelectValue placeholder="Select language" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="c">C</SelectItem>
									<SelectItem value="cpp">C++</SelectItem>
									<SelectItem value="csharp">C#</SelectItem>
									<SelectItem value="rust">Rust</SelectItem>
									<SelectItem value="java">Java</SelectItem>
									<SelectItem value="kotlin">Kotlin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Additional configurations</Label>
							<div className="flex flex-row space-x-1 items-center">
								<Checkbox className="transition" />
								<p className="text-sm">Enable optimization</p>
							</div>
							<div className="flex flex-row space-x-1 items-center">
								<Checkbox className="transition" />
								<p className="text-sm">Warning as error</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Button className="flex w-full">Submit</Button>
			</div>
		</div>
	);
}