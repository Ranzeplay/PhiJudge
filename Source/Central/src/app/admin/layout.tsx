import { RootNavBar } from '@/components/nav/rootNavBar';
import Link from 'next/link';
import { NavLink } from '@/components/nav/navLink';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title>Administration | PhiJudge</title>
      <div className='flex min-h-screen w-full flex-col'>
        <RootNavBar />
        <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
          <div className='mx-auto grid w-full max-w-6xl gap-2'>
            <h1 className='text-3xl font-semibold'>Administration</h1>
          </div>
          <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
            <nav
              className='grid gap-4 text-sm text-muted-foreground'
              x-chunk='dashboard-04-chunk-0'
            >
              <NavLink href='/admin/overview' title='Overview' pathRoot='/admin/overview' />
              <NavLink href='/admin/users' title='Users' pathRoot='/admin/user' />
              <NavLink href='/problems' title='Problems' pathRoot='//' />
              <NavLink href='/records' title='Records' pathRoot='//' />
              <NavLink href='/admin/agents' title='Agents' pathRoot='/admin/agent' />
              <NavLink href='/admin/programmingLanguages' title='Programming languages' pathRoot='/admin/programmingLanguage' />
              <NavLink href='/admin/maintenance' title='Maintenance' pathRoot='/admin/maintenance' />
            </nav>
            <div className='grid gap-6'>{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
