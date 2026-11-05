# Plum Catering — premium bilingual HTML website prototype

**Status:** Premium bilingual (Arabic-first RTL / English LTR) static HTML prototype, ready for client review and for conversion into a custom WordPress theme (phase 3). It is **not** a WordPress site and has **no backend**: forms, email, tracking IDs, redirects and Search Console are prepared as documented contracts, not live integrations.

## Quick start
```bash
npm run build      # review build: provisional facts flagged, pending-content blocks visible
npm run preview    # http://localhost:4173/ar/  (English: /en/)
```
```bash
npm run build:clean   # client-facing build: flags hidden AND all unverified facts omitted
npm run qa            # static QA (counts, H1s, canonicals, hreflang, links, schema honesty)
npm run qa:browser    # Playwright QA — run with `npm run preview` active; add --shots for screenshots
```
No npm dependencies. Node ≥ 18. The browser QA uses an installed Playwright/Chromium (`NODE_PATH=$(npm root -g)` if it is global).

Entry points to inspect: `dist/ar/index.html`, `dist/en/index.html`, `dist/en/services/b2b/index.html`, `dist/ar/products/brown-sourdough-bread/index.html`. `dist/index.html` is a tiny Arabic-first language gateway (noindex); in production `/` must 301 to `/ar/` at the server (see `docs/deployment-and-redirects.md`).

## What is where
```
src/data/          site-config.json · content.ar.json · content.en.json · products.json · media-manifest.json · client-logos.json
src/templates/     build-time components (layout, components, pages, schema, routes, helpers)
src/styles/        tokens.css · main.css · components.css · responsive.css  → dist/assets/styles/site.css
src/scripts/       main.js · navigation.js · quote-modal.js · cookie-consent.js · product-filters.js · gallery.js · tracking-adapter.js · dialog.js
src/build/         build.mjs (generator) · serve.mjs (preview) · qa.mjs · browser-qa.mjs
src/assets/        logo/ (interim) · images/ video/ pdf/ fonts/ (empty until assets are supplied)
dist/              generated site: /ar/… /en/… /assets/ sitemap*.xml robots.txt 404 pages
preview/           FM phase-2 template preview (never deployed)
docs/              inventory, gaps, SEO matrix, redirects, API contract, tracking, WP handoff, deployment, QA, traceability
```

## Demo content vs real data
| Real / source-backed | Demo / placeholder (clearly labelled in review builds) |
|---|---|
| Route plan, headings, page structure, Arabic & English UI/marketing copy written for this site | All photography and video (SVG placeholders) |
| Brand tokens from the guidelines | Client logo slots |
| Provisional facts quoted by the Blueprint (flagged "To confirm") | 3 product records (1 provisional, 2 draft) standing in for 76 |
| Interim logo from the brand board | Privacy policy bracketed placeholders |

Every field that is still `null` in `src/data/site-config.json` is a pending client input; see `docs/content-gaps.md`.

## Switching Facility Management live (prototype)
Set `facilityManagement.launchMode` to `"live"` in `site-config.json` and rebuild: the page becomes indexable, enters the sitemap, renders the phase-2 template and adds "Facility management" to the quote form. Keep it `coming_soon` until approved content exists. Preview the live template today at `/__preview/facility-live/ar/`.

## Adding products
Append records to `src/data/products.json` following the existing shape (same `id` for both languages, unique slugs per language, `status: approved` only with verified data). The build validates ids, slug collisions, categories and related links, and refuses approved products without descriptions.
