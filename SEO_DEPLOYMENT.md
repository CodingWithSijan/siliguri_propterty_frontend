# SEO Deployment Guide

This project now generates public SEO pages and sitemap artifacts during frontend build.

## 1) Required Environment Variables

Set these in the frontend build environment (Vercel project):

- `VITE_FRONTEND_URL=https://siliguriproperty.in`
- `VITE_BACKEND_URL=https://<your-backend-domain>`
- `SEO_SITE_ORIGIN=https://siliguriproperty.in` (recommended explicit canonical origin)
- `SEO_BACKEND_URL=https://<your-backend-domain>` (recommended explicit listing source for SEO build)

Notes:

- `SEO_BACKEND_URL` is used by `scripts/build-seo-artifacts.mjs` to fetch live approved listing data for prerendered listing pages and sitemap URLs.
- If `SEO_BACKEND_URL` is not reachable at build time, static SEO pages are still generated, but listing-detail pages and listing sitemap entries are omitted.

## 2) Build and Output

Build command:

```bash
npm run build
```

The build now does all of the following:

1. Runs Vite build.
2. Generates SEO pages in `dist/` with route-specific `<title>`, description, canonical, robots, OG/Twitter tags.
3. Generates dynamic `dist/sitemap.xml` and `public/sitemap.xml`.
4. Generates `dist/seo-report.json` and `public/seo-report.json`.
5. Generates `dist/404.html` for true unknown-route 404 handling.

Optional local validation:

```bash
npm run seo:check
```

## 3) Hosting Rules (Vercel)

`vercel.json` now enforces:

- Preferred host redirect: `www.siliguriproperty.in` -> `siliguriproperty.in` (301)
- `trailingSlash: false`
- `cleanUrls: true`
- Targeted SPA rewrites only for protected/auth app routes
- Unknown routes are not blanket-rewritten to root (allows true 404s)

Manual checks after deployment:

1. `https://www.siliguriproperty.in` redirects once to `https://siliguriproperty.in`.
2. No redirect loops for `/`, `/buys`, `/locality/matigara`, `/properties`.
3. Unknown URLs (for example `/this-should-404`) return HTTP 404.

## 4) Freshness Strategy for Listing SEO Pages

Listing detail pages and listing sitemap entries are generated at build time from live approved listings.

To keep listing pages fresh after publication/approval/edit/deletion:

1. Create a Vercel Deploy Hook for the frontend project.
2. Trigger that hook whenever listing visibility changes (approve/reject/sold/delete/significant edit).
3. Ensure the new build can reach `SEO_BACKEND_URL`.

Until rebuild completes, newest listing URLs may not exist as prerendered pages.

## 5) Search Console Manual Steps

After deploying:

1. Submit sitemap:

- `https://siliguriproperty.in/sitemap.xml`

2. URL Inspection on representative URLs:

- Homepage
- `/buys/land`
- `/locality/matigara`
- One published listing detail URL

3. Verify:

- Crawled page has route-specific title/description/canonical.
- Canonical selected by Google matches declared canonical for non-duplicate pages.
- Rendered content includes real listing/locality text and crawlable links.

4. Monitor:

- Page indexing report for new listing URLs.
- Crawl anomalies for 404/soft-404.
- Core Web Vitals and mobile usability.

## 6) Analytics and Monitoring

Track post-release:

- Indexed count of listing detail URLs.
- Non-brand search impressions/clicks for locality/category intents.
- Organic enquiry events (without capturing personal data in analytics payloads).
- Changes to click-through on locality/category landing pages.

## 7) Troubleshooting

If sitemap has no listing detail URLs:

1. Verify `SEO_BACKEND_URL` is set and reachable from build environment.
2. Confirm backend endpoint `/api/user/post/view-all-approved-posts` returns approved listings.
3. Re-run build and inspect `dist/seo-report.json` for `listingCount`.

If listing URLs return 404 unexpectedly:

1. Check if listing was included in `dist/seo-report.json` routes.
2. Rebuild/redeploy after listing approval.
3. Confirm listing is still approved and not marked sold/deleted in backend data.
