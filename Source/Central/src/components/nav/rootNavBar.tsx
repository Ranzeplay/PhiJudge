import Link from "next/link"

export function RootNavBar() {
	return (
		<header className="sticky top-0 flex h-12 items-center gap-4 bg-background px-4 backdrop-blur-md shadow-md text-xs">
			<nav className="flex flex-row flex-grow gap-x-3 items-center">
				<NavBarLink href="/" caption="PhiJudge" className="text-black mr-2 font-medium text-base font-serif" />
				<NavBarLink href="/problems" caption="Problems" className="text-muted-foreground" />
				<NavBarLink href="/contests" caption="Contests" className="text-muted-foreground" />
				<NavBarLink href="/records" caption="Records" className="text-muted-foreground" />
				<NavBarLink href="/community" caption="Community" className="text-muted-foreground" />
				<NavBarLink href="/status" caption="Status" className="text-muted-foreground" />
			</nav>
			<nav className="flex flex-grow-0 gap-x-3 items-center mr-4">
				<NavBarLink href="/auth/login" caption="Login" className="text-muted-foreground" />
				<NavBarLink href="/auth/register" caption="Register" className="text-muted-foreground" />
			</nav>
		</header>
	)
}

function NavBarLink(props: { href?: string, caption: string, className?: string}) {
	return (
		<Link
			href={props.href || '#'}
			className={`hover:text-black hover:underline hover:text-foreground transition ${props.className}`}
		>
			{props.caption}
		</Link>
	)
}
