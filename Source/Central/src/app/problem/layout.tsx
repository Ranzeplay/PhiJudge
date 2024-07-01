import { RootNavBar } from '@/components/nav/rootNavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RootNavBar />
      <main className='container mt-4 flex w-full flex-col space-y-2 pb-4'>
        {children}
      </main>
    </>
  );
}
