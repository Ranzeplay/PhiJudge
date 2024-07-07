'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { UserView } from '@/lib/models/user';
import { useEffect, useState } from 'react';
import { DeleteUser, FetchUser, SwitchUserAdminState } from './server';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserView | null>(null);
  useEffect(() => {
    fetchUser();
  }, [params.id]);

  async function fetchUser() {
    const user = await FetchUser(params.id);
    setUser(user);
  }

  const router = useRouter();
  async function deleteUser() {
    await DeleteUser(params.id);
    router.push('/admin/users');
  }

  async function switchAdminState() {
    await SwitchUserAdminState(params.id);
    fetchUser();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User details</CardTitle>
          <CardDescription>{params.id}</CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableCell>{user?.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>{user?.userName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email address</TableCell>
                <TableCell>{user?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Is admin</TableCell>
                <TableCell>{user?.isAdmin ? 'true' : 'false'}</TableCell>
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
          <Button onClick={async () => await switchAdminState()}>Switch admin state</Button>
          <Button variant={'destructive'} onClick={async () => deleteUser()}>
            Delete
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
