import { NextRequest, NextResponse } from 'next/server';
import {
  createSupabaseServerSideClient,
  createSupabaseServiceRoleClient,
} from './lib/supabase/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const serverSupabase = createSupabaseServiceRoleClient();
  await serverSupabase.from('requestLogs').insert({
    url: request.nextUrl.pathname,
    ip: request.ip || 'unknown',
    timestamp: new Date(),
    isApiRoute: request.nextUrl.pathname.startsWith('/api'),
  });

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const user = (await createSupabaseServerSideClient().auth.getUser()).data
      .user;
    const supaUser = await serverSupabase
      .from('users')
      .select('isAdmin')
      .eq('id', user?.id)
      .single();

    if (!supaUser.data?.isAdmin) {
      return NextResponse.redirect(
        new URL('/auth/unauthorized', request.nextUrl)
      );
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/agent')) {
    const agent = await serverSupabase
      .from('agents')
      .select('id')
      .eq('id', request.headers.get('Authorization') || '')
      .single();
    if (!agent.data) {
      return NextResponse.json(
        { message: 'Invalid agent id' },
        { status: 401 }
      );
    }
  } else {
    await updateSession(request);
  }

  return NextResponse.next();
}
