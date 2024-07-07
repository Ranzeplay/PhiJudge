import { NextRequest, NextResponse } from 'next/server';
import {
  createSupabaseServerSideClient,
  createSupabaseServiceRoleClient,
} from './lib/supabase/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const serverSupabase = createSupabaseServiceRoleClient();

  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    await serverSupabase.from('requestLogs').insert({
      url: pathname,
      ip: (request.headers.get('X-Forwarded-For') || request.ip || 'unknown').split(',').at(0),
      timestamp: new Date(),
      isApiRoute: pathname.startsWith('/api/v0'),
    });
  }

  const user = (await createSupabaseServerSideClient().auth.getUser()).data
      .user;

  const submissionPathPattern = /^\/problem\/(\d+)\/submit$/;
  if(submissionPathPattern.test(pathname)) {
    if(!user) {
      return NextResponse.redirect(
        new URL('/auth/signin', request.nextUrl)
      );
    }
  }

  if (pathname.startsWith('/admin')) {
    const supaUser = await serverSupabase
      .from('users')
      .select('isAdmin')
      .eq('id', user?.id)
      .single();

    if (!supaUser.data?.isAdmin) {
      return NextResponse.redirect(
        new URL('/auth/unauthorized', request.nextUrl)
      );
    } else {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/v0/agent')) {
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
