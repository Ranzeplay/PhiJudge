import { RootNavBar } from "@/components/nav/rootNavBar"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationLink,
	PaginationEllipsis,
	PaginationNext
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";
export default function Page() {
	return (
		<>
			<RootNavBar />
			<main className="container mt-4 flex flex-col space-y-2 w-full">
				<h1 className="text-3xl font-bold">Records</h1>
				<div className="grid grid-cols-3 w-full gap-4">
					<div className="col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Index</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">Id</TableHead>
											<TableHead>Problem</TableHead>
											<TableHead>Author</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
											<TableRow>
												<TableCell className="font-medium">
													<Link className="flex text-blue-500 hover:underline" href="/record/1/details">1</Link>
												</TableCell>
												<TableCell className="flex flex-row space-x-1 items-center">
													<Badge variant={'secondary'}>1</Badge>
													<Link className="flex text-blue-500 hover:underline" href="/problem/1/details">Hello, world</Link>
												</TableCell>
												<TableCell>
													<Link className="flex text-blue-500 hover:underline" href="/user/1">Jeb Feng</Link>
												</TableCell>
												<TableCell>Failed</TableCell>
											</TableRow>
									</TableBody>
								</Table>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious href="#" />
										</PaginationItem>
										<PaginationItem>
											<PaginationLink href="#">1</PaginationLink>
										</PaginationItem>
										<PaginationItem>
											<PaginationEllipsis />
										</PaginationItem>
										<PaginationItem>
											<PaginationNext href="#" />
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</CardContent>
						</Card>
					</div>
					<div className="space-y-2">
						<Card>
							<CardHeader>
								<CardTitle>Search</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<Input placeholder="Text" />
								<Button>Submit</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</>
	);
}
