/**
 * Central place to read Supabase configuration. The site must still build and
 * run when these are empty, so every consumer tolerates that and falls back to
 * the static defaults in `lib/content.ts`.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Server-only. Bypasses row-level security — never expose to the browser. */
export const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? '';

/** True when the browser-safe Supabase credentials are both present. */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/** True when the secret (service) key is also available — server actions, cron. */
export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && SUPABASE_SECRET_KEY.length > 0;
}

/** Public storage base URL for a bucket, e.g. for building image `src`s. */
export function storagePublicUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
