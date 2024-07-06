import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <>
    <title>Confirmation | PhiJudge</title>
    <Card className='mx-auto flex w-96 flex-col space-y-2'>
      <CardHeader>
        <CardTitle>Needs confirmation</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <p>The last operation needs confirmation, maybe check it out in your mailbox?</p>
      </CardContent>
    </Card>
    </>
  );
}