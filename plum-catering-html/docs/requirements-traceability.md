# Requirements traceability

Status legend: **implemented** · **prototype-only** (works in HTML, must be re-implemented in WP) · **pending real assets** · **requires backend** · **requires server deployment** · **requires client approval** · **future-ready**

| # | Requirement | Where | Status |
|---|---|---|---|
| 1 | 7 core pages × AR/EN with blueprint routes | `routes.mjs`, `dist/ar/*`, `dist/en/*` | implemented |
| 2 | Arabic default RTL, English LTR, `lang`/`dir`, logical CSS | `layout.mjs → document()`, all CSS | implemented |
| 3 | Exact H1s and H2/H3 hierarchy per page | `content.*.json`, `pages.mjs` | implemented (service H2 wording from Blueprint) |
| 4 | Unique title/description per page & locale | `content.*.json → meta`, product generator | implemented |
| 5 | Self-canonical + reciprocal `ar-SA`/`en-SA` hreflang + `x-default` | `layout.mjs → head()` | implemented |
| 6 | XML sitemap (segmented), indexable only | `build.mjs` → `sitemap.xml`, `sitemap-pages.xml`, `sitemap-products.xml` | implemented |
| 7 | robots.txt with staging guidance | `dist/robots.txt` | implemented |
| 8 | JSON-LD: Organization, WebSite, WebPage/AboutPage/CollectionPage, Service, BreadcrumbList, Product, ItemList | `schema.mjs` | implemented (LocalBusiness and VideoObject wait for verified address/video) |
| 9 | No fabricated offers/price/reviews/ratings | `schema.mjs`, enforced by `qa.mjs` | implemented |
| 10 | 76 products × 2 languages, individual crawlable pages | `products.json`, `pages.mjs → product`, `build.mjs` | implemented — **76/76 records, 152 pages generated**, all provisional/noindex until client approves catalogue data |
| 11 | Stable product IDs, collision-safe slugs, structured variants, bilingual pairs | `products.json` schema + build validation | implemented |
| 12 | Thin/draft products noindex and out of sitemap | `isIndexableProduct` | implemented |
| 13 | B2B grid with 7 families, native links, search + filter as enhancement | `pages.mjs → b2b`, `product-filters.js` | implemented |
| 14 | Family counts (21/6/10/12/5/12/10) | `products.json → categories` | implemented — verified against the catalogue PDF |
| 15 | Category-specific shelf life (fresh/frozen) | `categories[].shelfLife` → B2B table + product specs | implemented from catalogue (provisional until confirmed) |
| 16 | Catalogue PDF download (real file only) | `site-config → catalogue.pdf` | implemented — real bilingual PDF served |
| 17 | Product page: breadcrumb, gallery, overview, specs, ingredients/allergens, storage, applications, related, questions, pricing CTA | `pages.mjs → product` | implemented; sections hide/flag when data missing |
| 18 | Facility Management Coming Soon: public, noindex, no false claim, links to live services | `pages.mjs → facility` | implemented |
| 19 | FM phase-2 full template behind `launch_mode` flag | `site-config → facilityManagement.launchMode`, `preview/facility-live/*` | implemented (**requires client approval** to switch) |
| 20 | Privacy policy structure (11 H2s), TOC, cookie settings link | `pages.mjs → privacy` | implemented as review draft; **requires client approval** (noindex until `legal.privacyApproved`) |
| 21 | Sticky responsive header, drawer, language switcher preserving page/product | `layout.mjs`, `navigation.js` | implemented |
| 22 | Footer with services, company, contact, legal, cookie prefs | `layout.mjs → footer()` | implemented (phone + email from catalogue; address pending) |
| 23 | Accessible quote modal: focus trap, Esc, restore, validation, conditional fields, privacy + marketing consent | `layout.mjs → quoteModal()`, `quote-modal.js` | implemented |
| 24 | Quote prefill by service / product | `data-quote-open` attributes | implemented |
| 25 | Quote → Microsoft 365 email | `docs/quote-api-contract.md` | **requires backend** |
| 26 | Honest success: only on server confirmation; lead event only then | `quote-modal.js`, `tracking-adapter.js`; tested in `browser-qa.mjs` | implemented |
| 27 | WhatsApp click-to-chat with approved number, contextual prefill, click tracking | `layout.mjs → whatsappControl()` | implemented; number **requires client approval** (catalogue phone not confirmed as WhatsApp) |
| 28 | Bilingual cookie consent (Accept/Reject/Customise/Change) | `cookie-consent.js`, `layout.mjs → cookieUI()` | implemented (**requires client approval** of legal wording) |
| 29 | GTM Consent Mode v2 (4 signals, default denied) | inline head script, `cookie-consent.js` | implemented |
| 30 | GTM + Google Ads conversion on confirmed lead | `tracking-adapter.js`, `docs/tracking-consent-setup.md` | implemented adapter; **pending real assets** (IDs) |
| 31 | Video hero (muted, poster, pause control, reduced-motion fallback) | `components.mjs → hero()`, `navigation.js` | implemented; **pending real assets** (video) |
| 32 | Kitchen film with controls/captions | `components.mjs → kitchenFilm()` | implemented; **pending real assets** |
| 33 | 117-image categorised gallery, lazy, filters, lightbox, keyboard | `components.mjs → gallery()/lightbox()`, `gallery.js` | implemented; **pending real assets** (0/117) |
| 34 | Client logo wall (approved only) | `logoWall()`, `client-logos.json` | implemented; **pending real assets** |
| 35 | Restrained animations, reduced-motion, nothing hidden without JS | `main.css .reveal`, `navigation.js` | implemented (tested) |
| 36 | FAQ accordion accessible | `faq()`, `navigation.js` | implemented |
| 37 | Cross-link map (Blueprint §5) | `pages.mjs` CTA bands & links | implemented |
| 38 | Localised 404 pages | `pages.mjs → notFound`, `dist/{ar,en}/404.html` | implemented (server mapping **requires server deployment**) |
| 39 | Responsive 320–1920, no overflow, mobile sticky bar not covering consent | `responsive.css`; tested 390/768/1440 | implemented |
| 40 | WCAG 2.2 AA behaviours (focus, labels, contrast rules, 44 px targets) | tokens/components CSS, semantic templates | implemented (manual AT walkthrough pending) |
| 41 | Brand tokens, fonts, logo preserved | `tokens.css`, interim logo | implemented; original logo/tokens file **pending real assets** |
| 42 | Descriptive alt text, lazy loading, fixed dimensions, srcset support | `helpers.mjs → img()` | implemented (srcset populated when real variants exist) |
| 43 | Core Web Vitals targets | — | not measured; **requires server deployment** |
| 44 | 301 redirects, legacy URL preservation | `docs/redirects-mapping.csv`, `docs/deployment-and-redirects.md` | mapping done; **requires server deployment** + GSC crawl |
| 45 | Cloudflare configuration | `docs/deployment-and-redirects.md` | **requires server deployment** |
| 46 | Search Console verification & submission | `docs/deployment-and-redirects.md §5` | **requires server deployment** (no fake token) |
| 47 | All text/media editable in WordPress without page builder | `docs/wordpress-handoff.md`, JSON content model | **future** (phase 3) |
| 48 | Optional category landing pages / blog | `routes.mjs`, WP taxonomy plan | future-ready, not published |
| 49 | Source inventory, content gaps, URL matrix, API contract, tracking, WP handoff, deployment, QA, traceability | `docs/*` | implemented |
| 50 | No invented facts, prices, allergens, testimonials | review flags + clean-build omission; `qa.mjs` | implemented |
