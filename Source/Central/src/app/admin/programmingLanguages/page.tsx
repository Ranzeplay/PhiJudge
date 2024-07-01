'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { LanguageView } from "@/lib/models/language";
import { useEffect, useState } from "react";
import { UpdateLanguage } from "./server";

export default function Page() {
	const [lang, setLang] = useState<LanguageView[]>([]);
	useEffect(() => {
		async function fetchLang() {
			const res = await fetch(`/api/lang`);
			const data = await res.json();
			setLang(data);
		}

		fetchLang();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Programming languages</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Id</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Enabled</TableHead>
							<TableHead>Agents</TableHead>
							<TableHead>Operations</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{lang.map((lang) => (
							<TableRow key={lang.id}>
								<TableCell>{lang.id}</TableCell>
								<TableCell>{lang.name}</TableCell>
								<TableCell>{lang.enabled ? 'true' : 'false'}</TableCell>
								<TableCell>{lang.agents}</TableCell>
								<TableCell><EditLanguageSheet id={lang.id} /></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);

	function EditLanguageSheet(props: { id: string }) {
		useEffect(() => {
			const currentLang = lang.find((l) => l.id === props.id);
			if (currentLang) {
				setName(currentLang.name);
				setEnabled(currentLang.enabled);
			}
		}, [props.id]);

		const [name, setName] = useState<string>('');
		const [enabled, setEnabled] = useState<boolean>(false);

		async function submit() {
			await UpdateLanguage(props.id, name, enabled);

			let langView = lang.find((l) => l.id === props.id);
			if (langView) {
				langView.name = name;
				langView.enabled = enabled;
				setLang([...lang]);
			}
		}

		return (
			<Sheet>
				<SheetTrigger className="text-blue-500 hover:underline">Edit</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Edit language</SheetTitle>
						<SheetDescription>Editing for id: <span className="bg-gray-100 px-1 text-black font-semibold">{props.id}</span></SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="lang-name">Name</Label>
							<Input id="lang-name" placeholder="Name *" value={name} onChange={e => setName(e.target.value)} />
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="enableSubmission" className="transition-all" checked={enabled} onClick={() => setEnabled(!enabled)} />
							<label
								htmlFor="enableSubmission"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Enable submission
							</label>
						</div>
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button type="submit" onClick={() => submit()}>Save changes</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	}
}
