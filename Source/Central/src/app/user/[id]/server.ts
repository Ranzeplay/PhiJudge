'use server';

import { UserDataView } from "@/lib/models/user";
import { serverPrisma } from "@/lib/serverSidePrisma";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { RecordStatus } from "@prisma/client";

export async function FetchUserData(id: string): Promise<UserDataView> {
  const supabase = createSupabaseServiceRoleClient();
  const supaUser = (await supabase.auth.admin.getUserById(id)).data.user;
  const prismaUser = await serverPrisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      userName: true,
      isAdmin: true,
      problemsCreated: {
        select: { id: true, title: true },
        orderBy: { id: 'asc' },
      },
      records: {
        select: {
          id: true,
          submitTime: true,
          status: true,
          problem: { select: { id: true, title: true } },
        },
        orderBy: { submitTime: 'desc' },
      },
    },
  });

  return {
    profile: {
      id: prismaUser?.id || '',
      userName: prismaUser?.userName || '',
      email: supaUser?.email || '',
      isAdmin: prismaUser?.isAdmin || false,
      createAt: new Date(supaUser?.created_at || '1970-1-1T00:00:00Z'),
    },
    problemsCreated: prismaUser?.problemsCreated || [],
    submissions: prismaUser?.records || [],
    statistics: {
      totalSubmissions: prismaUser?.records.length || 0,
      totalPassed: prismaUser?.records.filter((record) => record.status === RecordStatus.PASSED).length || 0,
    },
  }
}
