"use client";

import { RootNavBar } from "@/components/nav/rootNavBar";
import { Content, Heading, Section, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput, Theme } from "@carbon/react";

export default function Page() {
	return (
		<>
			<RootNavBar />
			<Content>
				<Theme theme="white">
					<Section level={1} className="space-y-4">
						<Heading>Problems</Heading>
						<div className="grid grid-cols-5">
							<div className="row">
								<div className="col-span-3">
									<Table>
										<TableHead>
											<TableRow>
												<TableHeader>Id</TableHeader>
												<TableHeader>Title</TableHeader>
												<TableHeader>Pass rate</TableHeader>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>1</TableCell>
												<TableCell>Hello, world!</TableCell>
												<TableCell>42%</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
								<div className="col-span-2">
									<TextInput labelText="" id="searchBar" placeholder="Search" />
								</div>
							</div>
						</div>
					</Section>
				</Theme>
			</Content >
		</>
	);
}