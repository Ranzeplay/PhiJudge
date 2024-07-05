'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Keep database alive
  await serverPrisma.requestLog.findMany({
    take: 10,
  });

  // Keep Supabase alive
  const supabase = createSupabaseServiceRoleClient();
  await supabase.from('requestLogs').select('id').maybeSingle();

  return NextResponse.json({}, { status: 200 });
}
