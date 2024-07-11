import { RootNavBar } from '@/components/nav/rootNavBar';

export default function Home() {
  return (
    <>
      <title>Home | PhiJudge</title>
      <RootNavBar />
      <div className='container flex flex-row items-center min-h-screen-without-nav'>
        <div className='flex flex-col -translate-y-8 space-y-4'>
          <h1 className='text-4xl font-bold font-serif'>PhiJudge</h1>
          <p>An easy-to-use open judge system.</p>
        </div>
      </div>
    </>
  );
}
