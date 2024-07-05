import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServerSideClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  const supabase = createSupabaseServerSideClient();
  const supabaseUser = await supabase.auth.getUser();

  if (supabaseUser.error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 200 });
  }

  const prismaUser = await serverPrisma.user.findUnique({
    where: {
      id: supabaseUser.data!.user.id,
    },
  });

  return NextResponse.json(
    {
      isLoggedIn: true,
      userName: prismaUser?.userName,
      isAdmin: prismaUser?.isAdmin,
    },
    { status: 200 }
  );
}
