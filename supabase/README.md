# Supabase setup

1. Create a Supabase project and run `migrations/001_living_memorial.sql`.
2. Create the first user in Supabase Authentication.
3. Add that user's UUID to `public.admin_users`.
4. Copy the project URL and anon key into `.env.local` using `.env.example`.
5. Use the matching environment values in the hosted Site.

Public access is limited by Row Level Security to published content. Administrative
writes require both an authenticated Supabase user and an active row in
`public.admin_users`.
