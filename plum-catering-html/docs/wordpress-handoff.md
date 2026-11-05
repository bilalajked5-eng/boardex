# WordPress handoff plan (phase 3)

> This is an **implementation plan**. The HTML prototype has no WordPress admin, no PHP and no database. The target is a **custom theme with no page builder** (no Elementor, Divi, WPBakery or Gutenberg-layout dependence for page structure).

## 1. Architecture
| Concern | Recommendation |
|---|---|
| Theme | `plum-catering` custom classic theme (PHP templates + template parts). Optional `theme.json` for editor palette/typography only. |
| Fields | **ACF Pro** (field groups below) or native `register_post_meta`. Use ACF Options pages for global settings. |
| Translation | **Polylang Pro** or **WPML**, depending on licence. Each page/product is one translated pair linked by the plugin, never two disconnected inventories. Arabic is the default language with directory URLs `/ar/` and `/en/`. Make sure slugs per language don't collide (the WPML/Polylang setting "allow same slug in both languages" is needed if Latin slugs are reused). |
| SEO | One SEO plugin (Yoast, Rank Math or SEOPress) **or** theme-generated meta, never both. Disable plugin schema that would duplicate theme JSON-LD. Hreflang comes from the translation plugin; check `ar-SA` / `en-SA` locale codes and `x-default`. |
| Forms | Theme REST endpoint `plum/v1/quote` + Microsoft Graph mailer (see `quote-api-contract.md`). No form plugin is needed. |
| Consent | Keep the prototype's consent JS, or a CMP certified for Google Consent Mode v2 if legal requires one. |
| Caching | Cloudflare + a page cache plugin. Exclude `/wp-json/plum/v1/quote` from caching. |

## 2. Content model
### Post types and taxonomies
| Key | Type | Notes |
|---|---|---|
| `page` | core | 7 pages per language. Each is assigned a template (below). |
| `plum_product` | CPT, public, `has_archive=false`, rewrite `products` | One record per product per language, linked as translations |
| `plum_product_category` | taxonomy, non-public archives for now | Bread, Croissants, Danish & Focaccia, Éclairs, Miracle Cakes, Molded Cakes, Whole Cakes. Phase 1.5: enable archives only with unique intro + FAQ. |
| `plum_client` | CPT, not public | Logo wall: name, logo, `approved` boolean, approval reference |
| Gallery | Media Library + taxonomy `plum_gallery_category` (corporates, celebrations, kitchen, b2b) | 117 images. Use `wp_get_attachment_image()` for srcset. |
| `post` | core | Reserved for the future blog (keep `/blog/` unpublished) |

### Product fields (`plum_product`), mapped from `src/data/products.json`
| JSON | ACF field | Type |
|---|---|---|
| `id` | `product_uid` | text (stable, shared across translations) |
| `category` | taxonomy `plum_product_category` | — |
| `status` | `publish_status` (+ WP post status) | select: draft / provisional / approved |
| `slug.{lang}` | post slug | — |
| `name.{lang}` / `h1.{lang}` | title / `product_h1` | text |
| `productCode` | `product_code` | text |
| `heroImage` / `galleryImages` | `hero_image` / `gallery_images` | image / gallery |
| `variants[]` | `variants` | **repeater**: weight value, unit, energy value, unit, energy basis |
| `shortDescription` / `longDescription` | `short_description` / `long_description` | textarea (60–120 / 100–180 words, with field instructions) |
| `ingredients` / `allergens` | `ingredients` / `allergens` | textarea, help text "only from approved documentation" |
| `packaging`, `storage`, `foodserviceUse` | same names | textarea |
| `freshOrFrozen` | `shelf_life_source` | select: inherit category / product-specific (+ fresh, frozen fields) |
| `relatedProducts` | `related_products` | relationship (max 4, same language) |
| `pdfAttachment` | `pdf_attachment` | file |
| `seo.title/description` | SEO plugin fields | — |
| `indexabilityOverride` | `indexability_override` | select: auto / noindex |

**Indexability rule** (port of `isIndexableProduct`): `publish_status === 'approved'` AND override ≠ noindex → index. Anything else → `noindex,follow`, excluded from the sitemap and from ItemList schema.

### Global options (ACF Options, translatable), mapped from `site-config.json`
Logo (+ reverse logo), site name, contact phone/email/address/hours, WhatsApp number + default message, social links, quote endpoint (auto), GTM ID, Ads conversion ID/label, consent mode type, Search Console token, provisional facts **with a "verified" toggle each** (kitchen area, certifications + certificate files, parent company), catalogue PDF AR/EN + version/date, Facility Management `launch_mode`, `privacy_approved`, footer summary, cookie banner strings, quote form labels.

### Page field groups (one per template)
Each section from `content.{lang}.json → pages.{key}` becomes a field group with an **"enabled" toggle** per section, so editors can hide any block. Examples:
- **Home:** hero (eyebrow, H1, lead, poster, video MP4/WebM), about (H2, body, approach H3/body), services (4 cards: title, body, image), kitchen (H2, intro, H3 items repeater), why (repeater: icon select, H3, body), cuisine (H2, body), gallery selection (relationship to gallery images, max 12), clients heading, FAQ (repeater q/a), final CTA.
- **Corporates / Celebrations:** service rows repeater (anchor id, H3, body, image, CTA service type), process steps repeater, FAQ repeater, gallery selection.
- **B2B:** overview, shelf-life table (derived from category term meta: fresh/frozen per language + verified flag), quality, download, who-we-supply repeater, FAQ.
- **Facility:** `launch_mode` comes from options. Two field sets: `coming_soon_*` and `live_*` (all 10 phase-2 sections, each with an enabled flag).
- **Privacy:** sections repeater (id, H2, rich text) + last updated date.

## 3. Template map
| Prototype (`src/templates`) | WordPress file |
|---|---|
| `layout.mjs → head()` | `header.php` (`wp_head`), `inc/seo/head.php` (canonical, hreflang check, robots) |
| `layout.mjs → header()/drawer()` | `template-parts/global/site-header.php`, `…/mobile-drawer.php`, `wp_nav_menu` (location `primary`) |
| `layout.mjs → footer()` | `footer.php`, `template-parts/global/site-footer.php` |
| `layout.mjs → quoteModal()` | `template-parts/global/quote-modal.php` |
| `layout.mjs → cookieUI()` | `template-parts/global/cookie-consent.php` |
| `layout.mjs → mobileBar()` | `template-parts/global/mobile-bar.php` |
| `components.mjs → hero()` | `template-parts/components/hero.php` (`$args`) |
| `breadcrumbs()` | `template-parts/components/breadcrumbs.php` + BreadcrumbList |
| `serviceCard()/servicesGrid()` | `template-parts/components/service-card.php` |
| `featureCards()/steps()` | `…/feature-cards.php`, `…/steps.php` |
| `kitchenFacts()/kitchenFilm()` | `…/kitchen-trust-strip.php`, `…/video-figure.php` |
| `faq()` | `…/faq-accordion.php` |
| `gallery()/lightbox()` | `…/gallery-grid.php`, `…/lightbox.php` |
| `logoWall()` | `…/logo-wall.php` (queries `plum_client` where approved) |
| `ctaBand()` | `…/cta-section.php` |
| `productCard()` | `…/product-card.php` |
| `serviceRows()/jumpLinks()` | `…/service-rows.php`, `…/jump-links.php` |
| `pages.mjs → home` | `front-page.php` |
| `about` | `page-templates/template-about.php` |
| `corporates` / `celebrations` | `page-templates/template-service.php` (shared) |
| `b2b` | `page-templates/template-b2b.php` (WP_Query over `plum_product`, grouped by term; full server-rendered list) |
| `product` | `single-plum_product.php` |
| `facility` | `page-templates/template-facility.php` (branches on `launch_mode`) |
| `privacy` | `page-templates/template-privacy.php` |
| `notFound` | `404.php` (localised via the translation plugin) |
| `schema.mjs` | `inc/seo/schema.php` (single JSON-LD graph per page) |
| `styles/*.css` | `assets/css/` enqueued with `wp_enqueue_style` (one combined file + version) |
| `scripts/*.js` | `assets/js/` enqueued as `type="module"` (`wp_enqueue_script_module` on WP ≥ 6.5); page config via `wp_add_inline_script` |

## 4. Facility Management switch
`Options → Facility Management → launch_mode`:
- `coming_soon` (default): renders the coming-soon template, outputs `noindex,follow`, the SEO plugin hook `wpseo_sitemap_exclude_post_type`/equivalent removes it from the sitemap, and the quote form has no `facility` option.
- `live`: renders the phase-2 template (each section obeys its own enabled flag), removes noindex, adds it to the sitemap, adds the `facility` quote option and enables Service schema.
Show an admin notice ("Live content incomplete") if any required live field is empty.

## 5. Fonts
Self-host WOFF2 subsets in `assets/fonts/` (Playfair Display, Inter and Tajawal are all under the SIL OFL, but confirm the licence internally). Use `@font-face` with `font-display: swap` and preload the two critical weights per language. This removes the Google Fonts request, which helps privacy and performance.

## 6. Editor documentation to deliver with the theme
Add/edit a product (both languages, with variants), approve a product (status → approved), replace the catalogue PDF, add gallery images, approve a client logo, switch FM live, update contact/WhatsApp, configure GTM, and approve the Privacy Policy.
