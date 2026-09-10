import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

import {
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
  isSupabaseAdminConfigured,
} from './config';

/**
 * Secret-key Supabase client. Bypasses row-level security, so this must only
 * ever run on the server (route handlers, server actions, scripts) and never be
 * imported into a client component. Returns `null` when the secret key is not
 * configured.
 */
export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
