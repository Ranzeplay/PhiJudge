'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { AddNewAgent } from "./server";
import { useRouter } from "next/navigation";

export function AddAgentSheet() {
	const [name, setName] = useState("");

	const router = useRouter();
	async function handleSubmit() {
		if (name.trim() != "") {
			const agentId = await AddNewAgent(name);
			router.push(`/admin/agent/${agentId}`);
		}
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Add new</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add new agent</SheetTitle>
					<SheetDescription>
						Add a new agent to your PhiJudge server
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input id="name" className="col-span-3" value={name} onChange={e => setName(e.target.value)} />
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button onClick={handleSubmit}>Submit</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
