import { RootNavBar } from '@/components/nav/rootNavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServerSideClient } from '@/lib/supabase/server';
import Link from 'next/link';
export default async function Page() {
  const problems = await serverPrisma.problem.findMany({
    orderBy: { id: 'asc' },
  });

  const supaUser = (await createSupabaseServerSideClient().auth.getUser()).data
    ?.user;
  const prismaUser = await serverPrisma.user.findUnique({
    where: {
      id: supaUser?.id,
    },
  });

  return (
    <>
      <RootNavBar />
      <main className='container mt-4 flex w-full flex-col space-y-2'>
        <h1 className='text-3xl font-bold'>Problems</h1>
        <div className='grid w-full grid-cols-3 gap-4'>
          <div className='col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Index</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[100px]'>Id</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Pass rate</TableHead>
                      <TableHead>History</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell className='font-medium'>
                          {problem.id}
                        </TableCell>
                        <TableCell className='flex'>
                          <Link
                            className='flex text-blue-500 hover:underline'
                            href={`/problem/${problem.id}/details`}
                          >
                            {problem.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {problem.totalSubmits === 0
                            ? 'N/A'
                            : `${((problem.totalPassed / problem.totalSubmits) * 100).toFixed(2)}%`}
                        </TableCell>
                        <TableCell>Unknown</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href='#' />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href='#'>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href='#' />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </div>
          <div className='space-y-2'>
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Input placeholder='Text' />
                <Button>Submit</Button>
              </CardContent>
            </Card>
            {prismaUser?.isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin area</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Button variant={'link'} className='text-blue-500' asChild>
                    <Link href='/problem/create'>Create new</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
