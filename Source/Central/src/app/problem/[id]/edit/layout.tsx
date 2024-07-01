import Link from 'next/link';

export default function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  return (
    <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
      <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-3xl font-semibold'>Edit problem</h1>
      </div>
      <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
        <nav
          className='grid gap-4 text-sm text-muted-foreground'
          x-chunk='dashboard-04-chunk-0'
        >
          <Link
            href={`/problem/${params.id}/edit/general`}
            className='hover:underline'
          >
            General
          </Link>
          <Link
            href={`/problem/${params.id}/edit/testData`}
            className='hover:underline'
          >
            Test data
          </Link>
        </nav>
        <div className='grid gap-6'>{children}</div>
      </div>
    </main>
  );
}
