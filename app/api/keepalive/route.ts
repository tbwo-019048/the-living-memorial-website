import { NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Supabase pauses free-plan projects after a stretch of inactivity. A daily
 * Vercel Cron request to this route runs one trivial query so the project keeps
 * registering activity and never gets paused.
 *
 * Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>` when the
 * CRON_SECRET environment variable is set on the project; the check below
 * rejects anything else.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: 'Supabase is not configured.' },
      { status: 500 },
    );
  }

  const { error } = await supabase.from('site_settings').select('id').limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, checkedAt: new Date().toISOString() });
}
