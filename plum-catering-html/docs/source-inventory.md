# Source inventory

Inspected on 5 November 2026 before any code was written.

## Files received

| File | Found | Used for |
|---|---|---|
| `Plum_Catering_SEO_Structure_UIUX_Blueprint_v1.md` | ✅ | Routes, page hierarchy, H1/H2/H3, CTAs, product data model, SEO rules, acceptance criteria |
| `Plum_Catering_Brand_Guidelines_Claude_Ready.md` | ✅ | Palette, typography, component rules, logo rules, RTL/accessibility rules |
| Brand board image (`plum_catering_brand_style_guide` equivalent, received as `1.webp`) | ✅ | Mood reference **and the only available copy of the logo artwork** |
| `Plum_Catering_Brand_Guidelines_Claude_Ready.docx` | ❌ not supplied | The .md version was used |
| `Plum_Catering_Brand_Tokens.css` | ❌ not supplied | Tokens transcribed exactly from the Brand Guidelines tables into `src/styles/tokens.css` |
| `Plum_Catering_Logo.png` / SVG | ❌ not supplied | **Interim** logo cropped from the brand board, background removed, no redrawing (`src/assets/logo/plum-logo-interim-from-brandboard.png`, 281×145) |
| Product catalogue PDF / spreadsheet | ❌ | — |
| Photos (target 117), hero video, kitchen film | ❌ | Labelled SVG placeholders generated at build time |
| Client logos, testimonials | ❌ | Labelled pending state |
| Copy, legal text, redirects list, contact details, IDs | ❌ | Placeholders + `docs/content-gaps.md` |

## Live website

`https://plumcatering.com.sa` could not be reached: this session's network policy blocks the host. No product names, counts or copy were taken from the live site. Every "current website" fact comes only from what the Blueprint quotes. To import the real catalogue, allow the host in the environment's network settings or supply an export.

## Requirements extracted (summary)

- 7 core pages × 2 languages; Arabic is the default (RTL), English is the alternate (LTR); legacy service paths stay as they are.
- 76 products across 7 families, each with its own AR + EN detail page (up to 152). Products marked thin or draft stay noindex.
- Facility Management stays public but noindex while it is "coming soon". The full phase-2 template is built and switched by `launch_mode`.
- Quote modal (prefilled by context), WhatsApp, bilingual cookie consent with Consent Mode v2, GTM/Ads only on server-confirmed leads.
- Hero video, kitchen film, 117-image gallery, logo wall, accessible restrained motion with reduced-motion support.
- Schema, hreflang (ar-SA / en-SA), segmented sitemap, robots, 301 mapping, Search Console guidance.
- No ecommerce, prices, invented facts, allergens or testimonials.

## Conflicts and how they were resolved

| Conflict | Resolution |
|---|---|
| Master prompt About H2 list includes "Quality and Food Safety" as its own H2; the Blueprint nests certifications under the kitchen section | Implemented as a separate H2 (`#quality`), because the master prompt takes precedence. Kitchen H3 "Quality & Logistics" is kept. |
| Master prompt service H2 names ("Corporate Catering Overview") vs Blueprint names ("Catering Solutions for Organizations") | Used the Blueprint wording, which the master prompt calls authoritative. Content and order are equivalent. |
| Blueprint B2B order puts the partnership CTA before the FAQ | Followed the Blueprint. |
| Header logo on a dark/transparent hero | The brand guide forbids auto-inverting the logo, so the header stays on Soft Canvas and is never transparent. |
| Footer on dark plum would need a reverse logo | The footer uses Warm Ivory, and the dark plum band is the CTA section above it. |
| Arabic slug for product pages | The Blueprint sample uses the Latin slug on `/ar/` too. Stable Latin slugs are used in both languages (the generator also accepts Arabic slugs). |
| Number formatting in Arabic | Latin digits are used throughout, as is common on Saudi sites, so mixed digit systems never appear. |
