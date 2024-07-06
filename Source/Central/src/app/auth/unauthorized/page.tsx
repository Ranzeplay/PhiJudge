import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <title>Unauthorized | PhiJudge</title>
      <Card className='mx-auto flex w-96 flex-col space-y-2'>
        <CardHeader>
          <CardTitle>Unauthorized</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p>You are not authorized to view this page.</p>
          <Button asChild>
            <Link href={'/'}>Go back home</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
