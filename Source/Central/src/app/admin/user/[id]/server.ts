'use server';

import { UserView } from '@/lib/models/user';
import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';

export async function FetchUser(id: string) {
  const user = await serverPrisma.user.findUnique({
    where: {
      id,
    },
  });
  const supaUser =
    await createSupabaseServiceRoleClient().auth.admin.getUserById(id);

  return {
    email: supaUser.data.user?.email,
    id: user?.id,
    isAdmin: user?.isAdmin,
    userName: user?.userName,
  } as UserView;
}

export async function DeleteUser(id: string) {
  await serverPrisma.user.delete({
	where: {
	  id,
	},
  });
}

export async function SwitchUserAdminState(id: string) {
  const user = await serverPrisma.user.findUnique({
	where: {
	  id,
	},
  });
  await serverPrisma.user.update({
	where: {
	  id,
	},
	data: {
	  isAdmin: !user?.isAdmin,
	},
  });
}
