# QA report — 5 November 2026

## Build output (review mode)
| Metric | Value |
|---|---|
| Core pages | **18** (9 × AR/EN: Home, About, Corporates, Celebrations, B2B, Gallery, Contact, Facility, Privacy) |
| Product records / expected | **76 / 76** imported from the client catalogue PDF (all provisional, 0 approved) |
| Product pages generated | **152** (76 × AR/EN), all **noindex** until the client approves catalogue data |
| Service pages | **26** (7 corporate + 6 celebration × AR/EN) |
| Product-family pages | **14** (7 × AR/EN) |
| HTML files | 214 (18 core + 26 service + 14 family + 152 products + 3 × 404 + root gateway) |
| Indexable URLs / in sitemap | **54** (7 core pairs + 26 service + 14 family) |
| Noindex | 160 (FM Coming Soon ×2, Privacy draft ×2, products ×152, 404 ×3, root gateway) |
| Gallery photos supplied / target | **0 / 117** (76 product photos supplied separately via the catalogue) |

## Static checks — `npm run qa` (pass, 0 failures)
Per page: correct `lang`/`dir`, exactly one `<h1>`, title + description present and unique, self-canonical only when indexable, reciprocal `ar-SA`/`en-SA` hreflang to an indexable partner, noindex pages excluded from the sitemap, no `#`/empty/`javascript:` links, every internal link and anchor resolves, every `<img>` has `alt`, JSON-LD parses and contains no `offers`/`price`/`review`/`aggregateRating`/`availability`, no lorem ipsum, no phone/WhatsApp links without an approved number. Site-wide: all 14 core URLs exist, catalogue links every product in the same language, draft products are noindex, FM is noindex while Coming Soon, sitemap URLs exist. Also run against the `--clean` build (0 failures). Results: `docs/qa-static-results.json`.

## Browser checks — `npm run qa:browser` (127/127 pass)
Chromium via Playwright at **1440 / 768 / 390 px**, 25 URLs each (incl. gallery, contact, a family page and two service pages): no console/page errors, no failed requests, no horizontal overflow. Interactions: skip link, cookie banner + Consent Mode defaults denied, reject/customise flows, no GTM loaded without ID, dropdown navigation (click/Escape, 7 items + overview), 3-step quote modal open/focus/Escape/focus-restore, per-step validation, service-detail filtering by category, **"integration pending" with no success and no lead event when no endpoint**, mocked endpoint success → reference + `generate_lead`, mocked 500 → error and no lead, product attached + B2B preselected, language switcher keeps product/page identity, B2B finder (all 76 crawlable links, 8 shown by default, EN + AR search), family page lists 21 bread products, FAQ accordion ARIA, lightbox + arrow keys, floating actions hidden while the consent banner is open, RTL drawer from the left, reduced motion shows all content, **no-JS** page still shows H1/product links/FAQ answers. Results: `docs/qa-browser-results.json`; screenshots in `qa-screenshots/` (`--shots`).

## Manual visual review (performed)
Reviewed full-page screenshots of EN/AR Home, B2B, product, Corporates, FM Coming Soon, Privacy at desktop, tablet and mobile. Fixed during review: nav wrapping at 1440 px (nav now collapses below 1320 px), reveal sections hidden under instant scroll, footer button colour, placeholder tag overlapping mobile breadcrumbs, mixed digit systems in Arabic.

## Not measured / limitations
- **Core Web Vitals / Lighthouse not measured** (no deployment; local numbers would be misleading). Design choices that support the targets: one CSS file, module JS ~14 KB, lazy images with fixed dimensions, hero image eager + `fetchpriority=high`, no video loaded until supplied, placeholder SVGs are lightweight.
- Real font loading is from Google Fonts in the prototype; self-hosting is planned for WordPress.
- Screen-reader walkthrough (NVDA/VoiceOver) not performed; ARIA patterns follow APG (dialog, accordion, switch) and were verified structurally.
- Firefox/Safari not tested; native `<dialog>` is used (supported in all evergreen browsers).
- Live website unreachable from this session, so content parity with the current site is unverified.

## v2 structure (third pass)
Rebuilt on the client's demo IA: utility bar, dropdown mega-nav with 7/6/7 sub-links, split editorial heroes with numbered visual panels, stats strips, numbered outlined cards, 13 service sub-pages, 7 product-family pages, Gallery, Contact & Quotations, 3-step enquiry form, floating Enquire/WhatsApp actions. Static QA: 0 failures (214 files). Visual review of home, B2B, contact, a service page, a family page and Arabic mobile performed from screenshots.

## Catalogue import (second pass)
All 76 products were imported from `Plum_B2B-Catalogue-2026.pdf` with their photos (soft-masked, padded to 800×800 WebP, 2 MB total); mapping of the 76 photos to product names was verified visually against the PDF pages. Static and browser QA re-run after the import: 0 failures / 95 of 95.

## Open defects
None known. Everything outstanding is a content/asset/integration gap, listed in `content-gaps.md`.
