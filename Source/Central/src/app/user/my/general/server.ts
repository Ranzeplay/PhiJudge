'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServerSideClient } from '@/lib/supabase/server';

export async function FetchUserName() {
  const userId = (await createSupabaseServerSideClient().auth.getUser()).data
    .user?.id!;
  const user = await serverPrisma.user.findUnique({
    where: { id: userId },
  });

  return user?.userName;
}

export async function UpdateUserName(userName: string) {
  const userId = (await createSupabaseServerSideClient().auth.getUser()).data
    .user?.id!;
  await serverPrisma.user.update({
    where: { id: userId },
    data: { userName },
  });
}
