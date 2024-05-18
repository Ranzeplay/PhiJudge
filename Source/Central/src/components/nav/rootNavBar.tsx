"use client";

import { Login, Notification, Search } from "@carbon/icons-react";
import { Theme, Header, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderGlobalBar, HeaderGlobalAction, SkipToContent, HeaderMenuButton } from "@carbon/react";

export function RootNavBar() {
	return (
		<Theme theme={'g100'}>
			<Header aria-label="IBM Platform Name">
				<SkipToContent />
				<HeaderMenuButton />
				<HeaderName href="/" prefix="#Dev">
					PhiJudge
				</HeaderName>
				<HeaderNavigation>
					<HeaderMenuItem href="/problems">Problems</HeaderMenuItem>
					<HeaderMenuItem href="/contests">Contests</HeaderMenuItem>
					<HeaderMenuItem href="/records">Records</HeaderMenuItem>
					<HeaderMenuItem href="/community">Community</HeaderMenuItem>
					<HeaderMenuItem href="/status">Status</HeaderMenuItem>
				</HeaderNavigation>
				<HeaderGlobalBar>
					<HeaderGlobalAction>
						<Search />
					</HeaderGlobalAction>
					<HeaderGlobalAction>
						<Notification />
					</HeaderGlobalAction>
					<HeaderGlobalAction>
						<Login />
					</HeaderGlobalAction>
				</HeaderGlobalBar>
			</Header>
		</Theme>
	)
}