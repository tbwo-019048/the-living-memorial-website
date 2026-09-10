# Project Memory

Read this folder before every implementation step.

## Project

- Website: The Living Memorial / Operation Sweetpea.
- Character: respectful, peaceful, personal, established, natural and hopeful.
- Visual direction: editorial garden photography, Cormorant Garamond display type,
  Manrope interface type, botanical greens, muted sweet-pea pink and lavender.
- Public routes: Home, About, Events, Gallery, Shop and Contact.
- Administration route: `/admin`.
- Backend: Supabase PostgreSQL, Auth and Storage using
  `supabase/migrations/001_living_memorial.sql`.
- Theme preference is device-local; editorial content belongs in Supabase.
- Runtime: native Next.js 16 application deployed by Vercel.
- Production URL: `https://the-living-memorial-website.vercel.app/`.

## Working rules

- Preserve user changes.
- Update `task-log.md` after each completed task.
- Build successfully, commit with a meaningful description and push.
- Do not expose Supabase service keys or deployment credentials.
