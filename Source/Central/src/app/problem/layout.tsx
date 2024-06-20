import { RootNavBar } from "@/components/nav/rootNavBar"

export default function Layout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<RootNavBar />
			<main className="container mt-4 flex flex-col space-y-2 w-full pb-4">
				{children}
			</main>
		</>
	)
}
