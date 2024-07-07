'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { FetchUserName, UpdateUserName } from "./server";
import { toast } from "@/components/ui/use-toast";
import { clearUserAuthStatus } from "@/lib/clientUserUtils";

export default function Page() {
  const [userName, setUserName] = useState<string>('');
  useEffect(() => {
    async function fetchUserName() {
      const userName = await FetchUserName();
      setUserName(userName!);
    }

    fetchUserName();
  }, []);

  async function updateUserName() {
    await UpdateUserName(userName);
    toast({
      title: 'Success',
      description: 'User name updated',
    });
    // Will cause a refresh on navbar data
    clearUserAuthStatus();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input className="w-full" value={userName} onChange={e => setUserName(e.target.value)} />
          <Button onClick={async () => await updateUserName()}>Update</Button>
        </CardContent>
      </Card>
    </>
  )
}
