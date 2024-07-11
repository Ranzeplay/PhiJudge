'use client';

import { RootNavBar } from "@/components/nav/rootNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDataView } from "@/lib/models/user";
import { useEffect, useState } from "react";
import { FetchUserData } from "./server";
import dayjs from "dayjs";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Page({ params }: { params: { id: string } }) {
  const [userData, setUserData] = useState<UserDataView | null>(null);
  const [correctnessChartValue, setCorrectnessChartValue] = useState<{ name: string, value: number }[]>([]);
  useEffect(() => {
    async function fetchData() {
      const data = await FetchUserData(params.id);
      setUserData(data);

      const correntness = [
        { name: 'Passed', value: data.statistics.totalPassed },
        { name: 'Failed', value: data.statistics.totalSubmissions - data.statistics.totalPassed },
      ];
      setCorrectnessChartValue(correntness);
    }

    fetchData();
  }, [params.id]);

  return (
    <>
      <title>User details | PhiJudge</title>
      <div className='flex min-h-screen w-full flex-col'>
        <RootNavBar />
        <main className='flex min-h-screen-without-nav flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
          <div className='flex flex-row space-x-4'>
            <div className='flex flex-col flex-grow space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Problems created</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[100px]'>Id</TableHead>
                        <TableHead>Title</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData?.problemsCreated.map((problem) => (
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>History submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[100px]'>Id</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData?.submissions.map((record) => (
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
                          <TableCell>{record.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className='flex flex-col flex-grow-0 space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row space-x-1">
                    <h5 className="font-semibold">Username:</h5>
                    <p>{userData?.profile.userName}</p>
                  </div>
                  <div className="flex flex-row space-x-1">
                    <h5 className="font-semibold">Account created at:</h5>
                    <p>{userData?.profile.createAt && dayjs(userData?.profile.createAt).format('MM/DD/YYYY HH:mm')}</p>
                  </div>
                  <div className="flex flex-row space-x-1">
                    <h5 className="font-semibold">Last submission at:</h5>
                    <p>{userData && dayjs(userData?.submissions.at(0)?.submitTime).format('MM/DD/YYYY HH:mm')}</p>
                  </div>
                  {userData?.profile.isAdmin && (<Badge className="mt-2" variant='secondary'>Admin</Badge>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart width={400} height={400}>
                    <Pie data={correctnessChartValue} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      <Cell fill="#00c49f" />
                      <Cell fill="#ff8042" />
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
