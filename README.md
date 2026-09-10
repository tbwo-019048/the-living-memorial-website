# The Living Memorial

> **Production:** [the-living-memorial-website.vercel.app](https://the-living-memorial-website.vercel.app/) — this is the live prod site.

Next.js website for The Living Memorial / Operation Sweetpea. Supabase-backed
content layer and a protected `/admin` console; the public site falls back to the
bundled default content in `lib/content.ts` when Supabase is not configured.

## Supabase

- Schema: `supabase/migrations/001_living_memorial.sql` (or the consolidated
  `supabase/all_migrations.sql`) — run once in the Supabase SQL editor.
- Client: `@supabase/supabase-js` + `@supabase/ssr` via
  `lib/supabase/{config,client,server,admin}.ts`.
- First administrator: create the auth user in Supabase (Authentication → Users),
  then add a row to `public.admin_users` for that user id.

## Environment

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SECRET_KEY` (server-only), `CRON_SECRET` (keep-alive cron). See
`.env.example`.
