# Task Log

## 2026-09-09 — Initial complete website

- Created the Sites/Vinext project and registered its private Sites destination.
- Designed and implemented a responsive, accessible botanical visual system with
  persistent light and dark themes.
- Built Home, About, Events, Gallery, Shop and Contact routes.
- Added the requested horizontal upcoming-events rail, event detail dialogs,
  month calendar, past-event archive and date-range support.
- Added a dynamic memorial-feature story layout and extensible custodian section.
- Added gallery album filters, keyboard-accessible lightbox controls and empty states.
- Added a merchandise catalogue with configurable enquiry flow.
- Added contact, location, social and privacy surfaces with a Supabase-ready form.
- Built the complete administration experience for page content, collections,
  ordering, publish states, media and site settings.
- Added a normalized Supabase schema covering all content entities, administrator
  authorization, Storage, indexes and Row Level Security.
- Generated, reviewed and optimized three original fictional editorial photographs
  for the site. Source prompts are recorded in `image-assets.md`.
- Added per-page metadata and Event structured data.
- Production build and project lint completed successfully across all seven routes.

## 2026-09-09 — GitHub delivery

- Pushed the complete validated website to
  `tbwo-019048/the-living-memorial-website` on the `main` branch.
- Preserved the private Sites source repository as the `sites` remote.

## 2026-09-10 — Native Vercel conversion

- Replaced the Vinext/Cloudflare Worker runtime with native Next.js 16.3.4.
- Replaced Vinext, Vite and Wrangler scripts with standard Next.js development,
  production-build and start scripts.
- Removed Cloudflare, Vinext and Sites runtime packages and configuration.
- Added the standard Tailwind/PostCSS configuration used by Next.js.
- Updated TypeScript configuration and the npm lockfile for the native runtime.
- Confirmed all public and admin routes prerender successfully in a production
  Next.js build.
- Project lint completed successfully.
