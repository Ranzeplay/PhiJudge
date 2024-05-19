import { RootNavBar } from "@/components/nav/rootNavBar"
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
				<h1 className="text-3xl font-bold">Problems</h1>
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
											<TableHead>Title</TableHead>
											<TableHead>Pass rate</TableHead>
											<TableHead>History</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
											<TableRow>
												<TableCell className="font-medium">1</TableCell>
												<TableCell className="flex">
													<Link className="flex text-blue-500 hover:underline" href="/problem/1/details">Hello, world</Link>
												</TableCell>
												<TableCell>11.4%</TableCell>
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