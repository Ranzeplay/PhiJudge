import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serverPrisma } from "@/lib/serverSidePrisma";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
	const existingTestData = await serverPrisma.problemTestData.findMany({
		where: {
			problemId: parseInt(params.id)
		},
	});

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Operations</CardTitle>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link href={'testData/add'}>Add new</Link>
					</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Existing test data</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col space-y-2">
					{existingTestData.map((testData, order) => (
						<Card key={order}>
							<CardHeader>
								<CardTitle className="text-blue-500 hover:underline cursor-pointer">
									<Link href={`testData/edit/${testData.order}`}>#{order}</Link>
								</CardTitle>
								{order === 0 && (
									<CardDescription>Example data</CardDescription>
								)}
							</CardHeader>
							<CardContent className="space-x-1">
								<Badge variant={'destructive'}>{testData.timeLimitMs}ms</Badge>
								<Badge variant={'destructive'}>{testData.memoryLimitBytes}bytes</Badge>
								<Badge>Input length: {testData.input.length}</Badge>
								<Badge>Output length: {testData.expectedOutput.length}</Badge>
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>
		</>
	)
}