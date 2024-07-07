'use server';

import { createSupabaseServerSideClient } from '@/lib/supabase/server';

export async function UpdatePassword(newPassword: string): Promise<void> {
  const supabase = createSupabaseServerSideClient();
  await supabase.auth.updateUser({ password: newPassword });
}
