import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Flag, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge"

export default function Page(params: { id: string }) {
	return (
		<>
			<div className="grid grid-cols-3 w-full gap-4">
				<div className="col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Content</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<h2 className="text-xl font-bold">Hello, world</h2>
							<Separator />
							<div className="prose">
								<Markdown remarkPlugins={[remarkGfm]}>
									{`# Hello, world`}
								</Markdown>
							</div>
							<Separator />
							<h2 className="text-xl font-semibold">Example data</h2>
							<div className="flex flex-row space-x-4">
								<div className="flex flex-col flex-grow space-y-1">
									<h3>Input</h3>
									<textarea readOnly className="w-full h-24 p-2 bg-gray-100 rounded-md resize-none font-mono" value={``} placeholder="None" />
								</div>
								<div className="flex flex-col flex-grow space-y-1">
									<h3>Output</h3>
									<textarea readOnly className="w-full h-24 p-2 bg-gray-100 rounded-md resize-none font-mono" value={`Hello, world`} placeholder="None" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="col-span-1 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-col space-y-1">
								<p>Pass rate</p>
								<Progress value={11.4} />
							</div>
							<div>
								<p>History</p>
								<Badge variant="destructive">Failed</Badge>
							</div>
							<div>
								<p>Test points</p>
								<p className="font-serif text-lg">12</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Operations</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-1">
							<Button className="text-blue-500 hover:underline w-min" variant={'link'} asChild>
								<Link className="flex flex-row space-x-2" href={`/problem/${params.id}/submit`}>
									<Send size={14} />
									<span>Submit</span>
								</Link>
							</Button>
							<Button className="text-blue-500 hover:underline w-min" variant={'link'} asChild>
								<Link className="flex flex-row space-x-2" href={`/problem/${params.id}/report`}>
									<Flag size={14} />
									<span>Report</span>
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}