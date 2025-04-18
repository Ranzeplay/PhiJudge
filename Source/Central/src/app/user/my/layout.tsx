import { RootNavBar } from '@/components/nav/rootNavBar';
import { NavLink } from '@/components/nav/navLink';

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title>My account | PhiJudge</title>
      <div className='flex min-h-screen w-full flex-col'>
        <RootNavBar />
        <main className='flex min-h-screen-without-nav flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
          <div className='mx-auto grid w-full max-w-6xl gap-2'>
            <h1 className='text-3xl font-semibold'>My Account</h1>
          </div>
          <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
            <nav
              className='grid gap-4 text-sm text-muted-foreground'
              x-chunk='dashboard-04-chunk-0'
            >
              <NavLink href='/user/my/general' pathRoot='/user/my/general' title='General' />
              <NavLink href='/user/my/security' pathRoot='/user/my/security' title='Security' />
              <NavLink href='#' pathRoot='//' title='Danger zone' />
            </nav>
            <div className='grid gap-6'>{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
