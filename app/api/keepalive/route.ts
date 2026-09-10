import { NextResponse } from 'next/server';

/**
 * Supabase pauses free-plan projects after a stretch of inactivity. A daily
 * Vercel Cron request to this route runs one trivial query so the project keeps
 * registering activity and never gets paused.
 *
 * Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>` when the
 * CRON_SECRET environment variable is set on the project; the check below
 * rejects anything else. The query is a plain PostgREST call, matching the
 * fetch-based approach in lib/supabase-rest.ts (no supabase-js dependency).
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, error: 'Supabase is not configured.' },
      { status: 500 },
    );
  }

  const response = await fetch(`${url}/rest/v1/site_settings?select=id&limit=1`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `Supabase responded ${response.status}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, checkedAt: new Date().toISOString() });
}
