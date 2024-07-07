'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { agent, AgentStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { DeleteAgent, FetchAgent, SwitchSuspensionState } from './server';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<agent | null>(null);
  useEffect(() => {
    fetchAgent();
  }, [params.id]);

  async function fetchAgent() {
    setAgent(await FetchAgent(params.id));
  }

  async function switchSuspensionState() {
    await SwitchSuspensionState(params.id);
    await fetchAgent();
  }

  const router = useRouter();
  async function deleteAgent() {
    await DeleteAgent(params.id);
    router.push('/admin/agents');
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Agent details</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col space-y-2'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{agent?.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{agent?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>{agent?.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last heartbeat time</TableCell>
                <TableCell>
                  {dayjs(agent?.lastHeartbeatTime).format('YYYY-M-D H:mm:ss')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last network address</TableCell>
                <TableCell>{agent?.lastNetworkAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Supported languages</TableCell>
                <TableCell>
                  {agent?.availableLanguageId.map((lang) => (
                    <Badge key={lang}>{lang}</Badge>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Operations</CardTitle>
        </CardHeader>
        <CardContent className='space-x-2'>
          <Button variant={'outline'} onClick={async () => await switchSuspensionState()}>{agent ? (agent.status === AgentStatus.SUSPENDED ? 'Unsuspend' : 'Suspend') : 'Loading...'}</Button>
          <Button variant={'destructive'} onClick={async () => await deleteAgent()}>Delete</Button>
        </CardContent>
      </Card>
    </>
  );
}
