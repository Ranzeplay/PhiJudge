"use server";

import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import { RegisterFormSchema } from "./schema";
import { serverPrisma } from "@/lib/serverSidePrisma";

export async function HandleRegister(formData: FormData): Promise<string> {
  const data = await RegisterFormSchema.parseAsync({
    email: formData.get("email"),
    userName: formData.get("userName"),
    passwordScope: {
      password: formData.get("password"),
      confirmPassword: formData.get("password"),
    },
  });

  const supabase = createSupabaseServerSideClient();
  const supabaseRequestResult = await supabase.auth.signUp({
    email: data.email,
    password: data.passwordScope.password,
  });

  if (!supabaseRequestResult.error) {
    const isFirstUser = (await serverPrisma.user.count()) === 0;
    await serverPrisma.user.create({
      data: {
        id: supabaseRequestResult.data.user?.id!,
        userName: data.userName,
        isAdmin: isFirstUser,
      },
    });
  }

  return JSON.stringify(supabaseRequestResult!);
}
