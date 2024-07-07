'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UpdatePassword } from "./server";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordCardError, setPasswordCardError] = useState<string>('');

  async function updatePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordCardError('Passwords do not match');
      return;
    }

    await UpdatePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Update password</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          <div className="flex flex-col space-y-1">
            <Label>New password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Confirm password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="block">
            <Button onClick={async () => await updatePassword()}>Update</Button>
          </div>
          {passwordCardError !== '' && <div className="text-red-500">{passwordCardError}</div>}
        </CardContent>
      </Card>
    </>
  )
}
