import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Flag, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge"
import { serverPrisma } from "@/lib/serverSidePrisma";

export default async function Page({ params }: { params: { id: string } }) {
	const problem = await serverPrisma.problem.findUnique({ where: { id: parseInt(params.id) } });
	const testPointCount = await serverPrisma.problemTestData.count({ where: { problemId: parseInt(params.id) } });
	const exampleData = await serverPrisma.problemTestData.findFirst({ where: { problemId: parseInt(params.id), order: 0 } });

	return (
		<div className="grid grid-cols-3 w-full gap-4">
			<div className="col-span-2">
				<Card>
					<CardHeader>
						<CardTitle>Content</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<h2 className="text-xl font-bold">{problem?.title}</h2>
						<Separator />
						<div className="prose">
							<Markdown remarkPlugins={[remarkGfm]}>
								{problem?.description}
							</Markdown>
						</div>
						<Separator />
						<h2 className="text-xl font-semibold">Example data</h2>
						<div className="flex flex-row space-x-4">
							<div className="flex flex-col flex-grow space-y-1">
								<h3>Input</h3>
								<textarea readOnly className="w-full h-24 px-2 py-1 bg-gray-100 rounded-md resize-none font-mono" value={exampleData?.input} placeholder="None" />
							</div>
							<div className="flex flex-col flex-grow space-y-1">
								<h3>Output</h3>
								<textarea readOnly className="w-full h-24 px-2 py-1 bg-gray-100 rounded-md resize-none font-mono" value={exampleData?.expectedOutput} placeholder="None" />
							</div>
						</div>
						<div className="flex flex-row space-x-2 items-center">
							<p>Requirements: </p>
							<Badge variant="outline">{exampleData?.timeLimitMs || 'N/A'} ms</Badge>
							<Badge variant="outline">{exampleData?.memoryLimitBytes || 'N/A'} bytes</Badge>
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
						<div>
							<p>Id</p>
							<p className="font-serif text-lg">{params.id}</p>
						</div>
						<div className="flex flex-col space-y-1">
							<p>Pass rate</p>
							<Progress value={problem?.totalSubmits === 0 ? 0 : (problem!.totalPassed / problem!.totalSubmits)} />
						</div>
						<div>
							<p>History</p>
							<Badge variant="destructive">Unknown</Badge>
						</div>
						<div>
							<p>Test points</p>
							<p className="font-serif text-lg">{testPointCount}</p>
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
	);
}