import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Flag, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServerSideClient } from '@/lib/supabase/server';

export default async function Page({ params }: { params: { id: string } }) {
  const problem = await serverPrisma.problem.findUnique({
    where: { id: parseInt(params.id) },
  });
  const testPointCount = await serverPrisma.problemTestPoint.count({
    where: { problemId: parseInt(params.id) },
  });
  const exampleData = await serverPrisma.problemTestPoint.findFirst({
    where: { problemId: parseInt(params.id), order: 0 },
  });

  const supaUser = (await createSupabaseServerSideClient().auth.getUser()).data
    ?.user;
  const prismaUser = await serverPrisma.user.findUnique({
    where: {
      id: (supaUser || { id: '' }).id,
    },
  });

  return (
    <>
      <title>Problem details | PhiJudge</title>
      <div className='grid w-full grid-cols-3 gap-4'>
        <div className='col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <h2 className='text-xl font-bold'>{problem?.title}</h2>
              <Separator />
              <div className='prose'>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {problem?.description || '> No description'}
                </Markdown>
              </div>
              <Separator />
              <h2 className='text-xl font-semibold'>Example data</h2>
              <div className='flex flex-row space-x-4'>
                <div className='flex flex-grow flex-col space-y-1'>
                  <h3>Input</h3>
                  <textarea
                    readOnly
                    className='h-24 w-full resize-none rounded-md bg-gray-100 px-2 py-1 font-mono'
                    value={exampleData?.input}
                    placeholder='None'
                  />
                </div>
                <div className='flex flex-grow flex-col space-y-1'>
                  <h3>Output</h3>
                  <textarea
                    readOnly
                    className='h-24 w-full resize-none rounded-md bg-gray-100 px-2 py-1 font-mono'
                    value={exampleData?.expectedOutput}
                    placeholder='None'
                  />
                </div>
              </div>
              <div className='flex flex-row items-center space-x-2'>
                <p>Requirements: </p>
                <Badge variant='outline'>
                  {exampleData?.timeLimitMs || 'N/A'} ms
                </Badge>
                <Badge variant='outline'>
                  {exampleData?.memoryLimitBytes || 'N/A'} bytes
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='col-span-1 space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p>Id</p>
                <p className='font-serif text-lg'>{params.id}</p>
              </div>
              <div className='flex flex-col space-y-1'>
                <p>Pass rate</p>
                <Progress
                  value={
                    problem?.totalSubmits === 0
                      ? 0
                      : (problem?.totalPassed || 0) / (problem?.totalSubmits || 0) * 100
                  }
                />
              </div>
              <div>
                <p>History</p>
                <Badge variant='destructive'>Unknown</Badge>
              </div>
              <div>
                <p>Test points</p>
                <p className='font-serif text-lg'>{testPointCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col space-y-1'>
              <Button
                className='w-min text-blue-500 hover:underline'
                variant={'link'}
                asChild
              >
                <Link
                  className='flex flex-row space-x-2'
                  href={`/problem/${params.id}/submit`}
                >
                  <Send size={14} />
                  <span>Submit</span>
                </Link>
              </Button>
              <Button
                className='w-min cursor-not-allowed text-blue-200'
                variant={'link'}
                asChild
                disabled
              >
                <Link className='flex flex-row space-x-2' href={'#'}>
                  <Flag size={14} />
                  <span>Report</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
          {prismaUser?.isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Admin area</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button variant={'link'} className='text-blue-500' asChild>
                  <Link href={`/problem/${params.id}/edit/general`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
