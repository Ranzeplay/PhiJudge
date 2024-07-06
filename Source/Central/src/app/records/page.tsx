'use client';

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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RecordIndexView } from './schema';
import { GetRecords } from './server';

export default function Page() {
  const [recordIndex, setRecordIndex] = useState<RecordIndexView | null>(null);

  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function fetchRecords() {
      const data = await GetRecords(page, 20);
      setRecordIndex(data);
    }

    fetchRecords();
  }, [page]);

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
                    {recordIndex?.records.map((record) => (
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
                <RecordIndexPagination
                  currentPage={recordIndex?.page || 1}
                  totalPages={recordIndex?.totalPages || 1} />
              </CardContent>
            </Card>
          </div>
          <div className='space-y-2'>
            <Card>
              <CardHeader>
                <CardTitle>Go to a specific record</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Record id' type='number' />
                <Button asChild>
                  <Link href={`/record/${searchText}`}>Go</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );

  function RecordIndexPagination(props: { currentPage: number; totalPages: number }) {
    function trySetPage(newPage: number) {
      if (newPage >= 1 && newPage <= props.totalPages && newPage != props.currentPage) {
        setPage(newPage);
      }
    }

    function onManualInputPage(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter') {
        trySetPage(parseInt(e.currentTarget.value));
      }
    }

    return (
      <Pagination>
        <PaginationContent>
          {page != 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious href='#' onClick={() => trySetPage(page - 1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#' onClick={() => trySetPage(1)}>1</PaginationLink>
              </PaginationItem>
            </>
          )}
          {page > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href='#' isActive>{props.currentPage}</PaginationLink>
          </PaginationItem>
          {page < props.totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page != props.totalPages && (
            <>
              <PaginationItem>
                <PaginationLink href='#' onClick={() => trySetPage(props.totalPages)}>{props.totalPages}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' onClick={() => trySetPage(page + 1)} />
              </PaginationItem>
            </>
          )}
          <PaginationItem className='flex flex-row space-x-1'>
            <Input placeholder='Go to page (Enter)' onKeyDown={onManualInputPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
}
