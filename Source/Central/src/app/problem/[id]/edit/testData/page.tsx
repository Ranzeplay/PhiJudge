import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { serverPrisma } from '@/lib/serverSidePrisma';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
  const existingTestData = await serverPrisma.problemTestPoint.findMany({
    where: {
      problemId: parseInt(params.id),
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={'testData/add'}>Add new</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing test data</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col space-y-2'>
          {existingTestData.map((testPoint, order) => (
            <Card key={order}>
              <CardHeader>
                <CardTitle className='cursor-pointer text-blue-500 hover:underline'>
                  <Link href={`testData/edit/${testPoint.order}`}>
                    #{order}
                  </Link>
                </CardTitle>
                {order === 0 && <CardDescription>Example data</CardDescription>}
              </CardHeader>
              <CardContent className='space-x-1'>
                <Badge variant={'destructive'}>{testPoint.timeLimitMs}ms</Badge>
                <Badge variant={'destructive'}>
                  {testPoint.memoryLimitBytes}bytes
                </Badge>
                <Badge>Input length: {testPoint.input.length}</Badge>
                <Badge>Output length: {testPoint.expectedOutput.length}</Badge>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
