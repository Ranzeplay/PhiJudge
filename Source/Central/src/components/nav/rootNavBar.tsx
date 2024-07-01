'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type AuthenticationStatus = {
  isLoggedIn: boolean | undefined;
  userName: string | undefined;
  isAdmin: boolean;
};

export function RootNavBar() {
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>({
    isLoggedIn: undefined,
    userName: undefined,
    isAdmin: false,
  });
  useEffect(() => {
    async function fetchAuthStatus() {
      const response = await fetch('/api/v0/auth/status');
      const data = (await response.json()) as AuthenticationStatus;
      setAuthStatus(data);
    }

    fetchAuthStatus();
  }, []);

  return (
    <header className='sticky top-0 z-50 flex h-14 items-center gap-4 bg-background px-4 text-xs shadow-md'>
      <nav className='flex flex-grow flex-row items-center gap-x-3'>
        <NavBarLink
          href='/'
          caption='PhiJudge'
          className='mr-2 font-serif text-base font-medium text-black'
        />
        <NavBarLink
          href='/problems'
          caption='Problems'
          className='text-muted-foreground'
        />
        <NavBarLink
          href='#'
          caption='Contests'
          className='text-muted-foreground'
        />
        <NavBarLink
          href='/records'
          caption='Records'
          className='text-muted-foreground'
        />
        <NavBarLink
          href='#'
          caption='Community'
          className='text-muted-foreground'
        />
        <NavBarLink
          href='#'
          caption='Status'
          className='text-muted-foreground'
        />
      </nav>
      <nav className='mr-4 flex flex-grow-0 items-center gap-x-3'>
        {authStatus.isLoggedIn ? (
          <>
            <NavBarLink
              href='/user/my'
              caption={`Hello, ${authStatus.userName || 'undefined'}`}
              className='text-muted-foreground'
            />
            {authStatus.isAdmin && (
              <NavBarLink
                href='/admin/overview'
                caption='Admin'
                className='text-muted-foreground'
              />
            )}
            <NavBarLink
              href='/auth/logout'
              caption='Logout'
              className='text-muted-foreground'
            />
          </>
        ) : (
          <>
            <NavBarLink
              href='/auth/login'
              caption='Login'
              className='text-muted-foreground'
            />
            <NavBarLink
              href='/auth/register'
              caption='Register'
              className='text-muted-foreground'
            />
          </>
        )}
      </nav>
    </header>
  );
}

function NavBarLink(props: {
  href?: string;
  caption: string;
  className?: string;
}) {
  return (
    <Link
      href={props.href || '#'}
      className={`transition hover:text-black hover:text-foreground hover:underline ${props.className}`}
    >
      {props.caption}
    </Link>
  );
}
