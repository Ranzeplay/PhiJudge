'use server';

import { createSupabaseServerSideClient } from "@/lib/supabase";
import { RegisterFormSchema } from "./schema";
import { PrismaClient } from "@prisma/client";

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
    const prisma = new PrismaClient();
    await prisma.user.create({
      data: {
        id: supabaseRequestResult.data.user?.id!,
        userName: data.userName,
      },
    });
  }

  return JSON.stringify(supabaseRequestResult!);
}
