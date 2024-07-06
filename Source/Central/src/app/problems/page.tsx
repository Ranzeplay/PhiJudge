'use client';

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
import Link from 'next/link';
import { KeyboardEvent, useEffect, useState } from 'react';
import { GetProblems } from './server';
import { ProblemIndexView } from './schema';
import { AuthenticationStatus, getUserAuthStatus } from '@/lib/clientUserUtils';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function Page() {
  const [problemIndex, setProblemIndex] = useState<ProblemIndexView | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const [searchInputText, setSearchInputText] = useState<string>('');

  useEffect(() => {
    GetProblems(searchText, page, pageSize).then((result) => {
      setProblemIndex(result);
      toast({
        title: 'Success',
        description: 'Problems fetched.',
      });
    }).catch((err) => {
      toast({
        title: 'Error',
        description: 'Failed to fetch problems, check console log.',
      });
      console.log(err);
    });
  }, [searchText, page, pageSize]);

  function performSearch() {
    setPage(1);
    setSearchText(searchInputText);
  }

  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>({
    isLoggedIn: undefined,
    userName: undefined,
    isAdmin: false,
  });
  useEffect(() => {
    async function fetchAuthStatus() {
      setAuthStatus(await getUserAuthStatus());
    }

    fetchAuthStatus();
  }, []);

  function performSearchOnEnter(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      performSearch();
    }
  }

  return (
    <>
      <title>Problems | PhiJudge</title>
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
                    {problemIndex?.problems.map((problem) => (
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
                <ProblemIndexPagination
                  currentPage={problemIndex?.page || 1}
                  totalPages={problemIndex?.totalPages || 1} />
              </CardContent>
            </Card>
          </div>
          <div className='space-y-2'>
            <Card>
              <CardHeader>
                <CardTitle>Query</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label>Page size</Label>
                  <Select value={pageSize.toString()} onValueChange={(e) => setPageSize(parseInt(e))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Page size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1'>
                  <Label>Search</Label>
                  <Input value={searchInputText} onChange={(e) => setSearchInputText(e.target.value)} placeholder='Text' onKeyDown={e => performSearchOnEnter(e)} />
                  <Button onClick={() => performSearch()} className='mt-1'>Submit</Button>
                </div>
              </CardContent>
            </Card>
            {authStatus.isAdmin && (
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

  function ProblemIndexPagination(props: { currentPage: number; totalPages: number }) {
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
