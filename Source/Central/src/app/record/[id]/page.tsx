'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, ArrowRight, Check, Loader } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { RecordStatus, RecordTestPointStatus } from '@prisma/client';
import useSWR from 'swr';
import { CompilationResultType } from '@/lib/models/record/compilation';
import { Editor } from '@monaco-editor/react';
import { RecordPersistentData } from '@/lib/models/record/persistent';
import { TestPointViewModel } from '@/lib/models/record/testPoint';
import { addSpaceBetweenWords, convertToUpperUnderlineToNormalWords } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res: Response) => res.json());

function isRecordFinished(status: RecordStatus) {
  return (
    status === RecordStatus.FAILED ||
    status === RecordStatus.PASSED ||
    status === RecordStatus.ERROR
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const [persistentData, setPersistentData] =
    useState<RecordPersistentData | null>(null);
  const [recordFinished, setRecordFinished] = useState<boolean>(false);

  const swrOptions = {
    isPaused(): boolean {
      return recordFinished;
    },
    refreshInterval: 100,
  };

  const { data: compilationResult } = useSWR<{
    compilationOutput: string;
    compilationResult: CompilationResultType;
  }>(`/api/v0/record/${params.id}/compilation`, fetcher, swrOptions);
  const { data: statusResult } = useSWR<{ status: RecordStatus }>(
    `/api/v0/record/${params.id}/status`,
    fetcher,
    swrOptions
  );
  const { data: testPoints } = useSWR<TestPointViewModel[]>(
    `/api/v0/record/${params.id}/testPoints`,
    fetcher,
    swrOptions
  );

  useEffect(() => {
    setRecordFinished(
      statusResult !== undefined && isRecordFinished(statusResult.status)
    );
  }, [statusResult]);

  useEffect(() => {
    async function fetchPersistentData() {
      const response = await fetch(`/api/v0/record/${params.id}/persistent`);
      const data = (await response.json()) as RecordPersistentData;
      setPersistentData(data);
    }

    fetchPersistentData();
  }, [params.id]);

  return (
    <>
      <title>Record details | PhiJudge</title>
      <div className='grid w-full grid-cols-3 gap-4'>
        <div className='col-span-1 space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Steps</CardTitle>
              <CardDescription>
                {convertToUpperUnderlineToNormalWords(
                  statusResult?.status.toString() || ''
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col space-y-1'>
              <QueueIndicator
                status={statusResult?.status || RecordStatus.UNKNOWN}
              />
              <CompileIndicator
                status={statusResult?.status || RecordStatus.UNKNOWN}
              />
              <TestIndicator
                status={statusResult?.status || RecordStatus.UNKNOWN}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col space-y-1'>
              <div>
                <h4>Id</h4>
                <p className='ml-2 font-mono text-sm'>{params.id}</p>
              </div>
              <div>
                <h4>Time</h4>
                <p className='ml-2 font-mono text-sm'>
                  {dayjs(persistentData?.submitTime).format('YYYY/M/D H:mm')}
                </p>
              </div>
              <div>
                <h4>Problem</h4>
                <Link
                  className='ml-2 flex text-sm text-blue-500 hover:underline'
                  href={`/problem/${persistentData?.problem.id}/details`}
                >
                  {persistentData?.problem.title}
                </Link>
              </div>
              <div>
                <h4>Author</h4>
                <Link
                  className='ml-2 flex text-sm text-blue-500 hover:underline'
                  href={`/user/${persistentData?.problem.authorId}`}
                >
                  {persistentData?.problem.author}
                </Link>
              </div>
              <div>
                <h4>Status & Result</h4>
                <p className='ml-2 font-mono text-sm'>
                  {convertToUpperUnderlineToNormalWords(
                    statusResult?.status.toString() || ''
                  )}
                </p>
              </div>
              <div>
                <h4>Rate</h4>
                <p className='ml-2 font-mono text-sm'>
                  {(testPoints || []).filter(
                    (t) => t.resultType === RecordTestPointStatus.ACCEPTED
                  ).length || NaN}{' '}
                  / {testPoints?.length || NaN}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='col-span-2 space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex flex-row items-center space-x-2'>
                <span>Source code</span>
                <Badge variant={'secondary'}>
                  {persistentData?.language.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <Editor
              className='p-6 pt-0'
              height='30vh'
              language={persistentData?.language.id}
              value={persistentData?.sourceCode}
              options={{ readOnly: true }}
            />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compilation output</CardTitle>
              <CardDescription>
                {convertToUpperUnderlineToNormalWords(
                  compilationResult?.compilationResult || ''
                )}
              </CardDescription>
            </CardHeader>
            <Editor
              className='p-6 pt-0'
              height='30vh'
              language='plaintext'
              value={
                compilationResult?.compilationOutput || '[No output captured]'
              }
              options={{ readOnly: true }}
            />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Test points</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col space-y-4'>
              <div className='flex flex-row space-x-2'>
                <Card className='flex-grow'>
                  <CardHeader>
                    <CardTitle>Time consumption (ms)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TimeChart data={testPoints || []} />
                  </CardContent>
                </Card>
                <Card className='flex-grow'>
                  <CardHeader>
                    <CardTitle>Memory consumption (bytes)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MemoryChart data={testPoints || []} />
                  </CardContent>
                </Card>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px]'>Order</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testPoints?.map((testPoint, index) => (
                    <TableRow key={index}>
                      <TableCell>{testPoint.order}</TableCell>
                      <TableCell>
                        {convertToUpperUnderlineToNormalWords(testPoint.resultType)}
                      </TableCell>
                      <TableCell>
                        {testPoint.actualPeakMemoryBytes} bytes
                      </TableCell>
                      <TableCell>{testPoint.actualTimeMs} ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function QueueIndicator(props: { status: RecordStatus }) {
  return (
    <p
      className={`flex flex-row items-center gap-x-1 ${props.status !== RecordStatus.PENDING && 'text-muted-foreground'}`}
    >
      {props.status !== RecordStatus.PENDING ? (
        <Check size={15} />
      ) : (
        <ArrowRight size={15} />
      )}
      <span>Queue</span>
    </p>
  );
}

function CompileIndicator(props: { status: RecordStatus }) {
  if (props.status === RecordStatus.COMPILING) {
    return (
      <p className='flex flex-row items-center gap-x-1'>
        <ArrowRight size={15} />
        <span>Compile</span>
      </p>
    );
  } else if (props.status === RecordStatus.PENDING) {
    return (
      <p className='flex flex-row items-center gap-x-1 text-muted-foreground'>
        <Loader size={15} opacity={0} />
        <span>Compile</span>
      </p>
    );
  } else {
    return (
      <p className='flex flex-row items-center gap-x-1 text-muted-foreground'>
        <Check size={15} />
        <span>Compile</span>
      </p>
    );
  }
}

function TestIndicator(props: { status: RecordStatus }) {
  if (props.status === RecordStatus.TESTING) {
    return (
      <p className='flex flex-row items-center gap-x-1'>
        <ArrowRight size={15} />
        <span>Test</span>
      </p>
    );
  } else if (
    props.status === RecordStatus.PENDING ||
    props.status === RecordStatus.COMPILING
  ) {
    return (
      <p className='flex flex-row items-center gap-x-1 text-muted-foreground'>
        <Loader size={15} opacity={0} />
        <span>Test</span>
      </p>
    );
  } else if (
    props.status === RecordStatus.ERROR ||
    props.status === RecordStatus.FAILED
  ) {
    return (
      <p className='flex flex-row items-center gap-x-1 text-muted-foreground'>
        <AlertTriangle size={15} />
        <span>Test</span>
      </p>
    );
  } else {
    return (
      <p className='flex flex-row items-center gap-x-1 text-muted-foreground'>
        <Check size={15} />
        <span>Test</span>
      </p>
    );
  }
}

function TimeChart(props: { data: TestPointViewModel[] }) {
  return (
    <>
      <BarChart width={300} height={300} data={props.data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='actualTimeMs' name='Actual' fill='#82ca9d' />
        <Bar dataKey='averageTimeMs' name='Average' fill='#800080' />
        {/* <ReferenceLine y={128} stroke="red" label="Limit" /> */}
      </BarChart>
    </>
  );
}

function MemoryChart(props: { data: TestPointViewModel[] }) {
  return (
    <>
      <BarChart width={300} height={300} data={props.data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='order' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='actualPeakMemoryBytes' name='Actual' fill='#82ca9d' />
        <Bar dataKey='averagePeakMemoryBytes' name='Average' fill='#800080' />
        {/* <ReferenceLine y={128} stroke="red" label="Limit" /> */}
      </BarChart>
    </>
  );
}
