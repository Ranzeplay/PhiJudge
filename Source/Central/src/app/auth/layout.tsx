export default function MyAccountLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex h-screen w-screen items-center">
			{children}
		</main>
	)
}
