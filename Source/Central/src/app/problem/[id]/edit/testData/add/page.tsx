'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HandleTestDataAddition } from './server';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [memoryLimit, setMemoryLimit] = useState<number | null>(null);
  const [inputData, setInputData] = useState<string>('');
  const [expectedOutputData, setExpectedOutputData] = useState<string>('');

  const [allowedToSubmit, setAllowedToSubmit] = useState(false);

  useEffect(() => {
    setAllowedToSubmit(
      timeLimit !== null &&
        timeLimit !== 0 &&
        memoryLimit !== null &&
        memoryLimit !== 0
    );
  }, [timeLimit, memoryLimit]);

  const router = useRouter();
  function submit() {
    HandleTestDataAddition(
      parseInt(params.id),
      timeLimit!,
      memoryLimit!,
      inputData,
      expectedOutputData
    ).then(() => router.push(`/problem/${params.id}/edit/testData`));
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Limits</CardTitle>
          <CardDescription>All fields required</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Input
            placeholder='Time limit (ms)'
            value={timeLimit || ''}
            onChange={(e) => setTimeLimit(e.target.valueAsNumber)}
            type='number'
          />
          <Input
            placeholder='Memory limit (bytes)'
            value={memoryLimit || ''}
            onChange={(e) => setMemoryLimit(e.target.valueAsNumber)}
            type='number'
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Input data</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expected output data</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={expectedOutputData}
            onChange={(e) => setExpectedOutputData(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className='block space-x-2'>
        <Button disabled={!allowedToSubmit} onClick={submit}>
          Submit
        </Button>
        <Button variant={'outline'} asChild>
          <Link
            href={'/problem/[id]/edit/testData'}
            as={`/problem/${params.id}/edit/testData`}
          >
            Cancel
          </Link>
        </Button>
      </div>
    </>
  );
}
