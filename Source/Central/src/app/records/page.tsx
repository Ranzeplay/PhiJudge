import { RootNavBar } from '@/components/nav/rootNavBar';
import { Badge } from '@/components/ui/badge';
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
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const records = await serverPrisma.record.findMany({
    orderBy: { id: 'desc' },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
        },
      },
      submitter: {
        select: {
          id: true,
          userName: true,
        },
      },
    },
  });

  return (
    <>
      <RootNavBar />
      <main className='container mt-4 flex w-full flex-col space-y-2'>
        <h1 className='text-3xl font-bold'>Records</h1>
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
                      <TableHead>Problem</TableHead>
                      <TableHead>Submitter</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className='font-medium'>
                          <Link
                            className='flex text-blue-500 hover:underline'
                            href={`/record/${record.id}`}
                          >
                            {record.id}
                          </Link>
                        </TableCell>
                        <TableCell className='flex flex-row items-center space-x-1'>
                          <Badge variant={'secondary'}>
                            {record.problem.id}
                          </Badge>
                          <Link
                            className='flex text-blue-500 hover:underline'
                            href={`/problem/${record.problem.id}/details`}
                          >
                            {record.problem.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            className='flex text-blue-500 hover:underline'
                            href={`/user/${record.submitter.id}`}
                          >
                            {record.submitter.userName}
                          </Link>
                        </TableCell>
                        <TableCell>{record.status}</TableCell>
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
          </div>
        </div>
      </main>
    </>
  );
}
