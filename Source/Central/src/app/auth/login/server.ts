'use server';

import { createSupabaseServerSideClient } from '@/lib/supabase/server';
import { LoginFormSchema } from './schema';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';

export async function HandleLogin(formData: FormData): Promise<AuthTokenResponsePassword> {
  const data = await LoginFormSchema.parseAsync({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  const supabase = createSupabaseServerSideClient();

  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return result
}
