#!/usr/bin/env node
// Plum Catering — static site generator (zero dependencies, Node >= 18).
// Usage: node src/build/build.mjs [--clean]
//   --clean   hide review flags and omit pending-content blocks (provisional facts are then omitted too)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_ROUTES, route, productRoute, serviceRoute, familyRoute } from '../templates/routes.mjs';
import { placeholderSVG, esc } from '../templates/helpers.mjs';
import { document } from '../templates/layout.mjs';
import * as Pages from '../templates/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const PREVIEW = path.join(ROOT, 'preview');
const args = new Set(process.argv.slice(2));

const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(SRC, 'data', p), 'utf8'));
const config = readJSON('site-config.json');
if (args.has('--clean')) config.prototype.showReviewFlags = false;
const content = { ar: readJSON('content.ar.json'), en: readJSON('content.en.json') };
const productsData = readJSON('products.json');
const media = readJSON('media-manifest.json');
const clientLogos = readJSON('client-logos.json').logos;
media.byId = Object.fromEntries(media.images.map((m) => [m.id, m]));
const categories = productsData.categories;
const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
const products = productsData.products;
const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
const buildId = Date.now().toString(36);
const LANGS = ['ar', 'en'];

/* ---------------- Data validation (fail the build on integrity errors) ---------------- */
const errors = [];
const seen = { id: new Set(), ar: new Set(), en: new Set() };
const familySlugs = new Set(categories.map((c) => c.slug));
for (const p of products) {
  if (seen.id.has(p.id)) errors.push(`Duplicate product id ${p.id}`);
  seen.id.add(p.id);
  if (!categoriesById[p.category]) errors.push(`${p.id}: unknown category ${p.category}`);
  for (const l of LANGS) {
    const s = p.slug?.[l];
    if (!s || !/^[a-z0-9؀-ۿ-]+$/.test(s)) errors.push(`${p.id}: invalid ${l} slug "${s}"`);
    if (seen[l].has(s)) errors.push(`${p.id}: slug collision in ${l}: ${s}`);
    if (familySlugs.has(s)) errors.push(`${p.id}: slug ${s} collides with a product-family route`);
    seen[l].add(s);
    if (!p.name?.[l]) errors.push(`${p.id}: missing ${l} name`);
  }
  for (const r of p.relatedProducts || []) if (!productsById[r]) errors.push(`${p.id}: related product ${r} not found`);
  if (p.heroImage && !media.byId[p.heroImage]) errors.push(`${p.id}: unknown heroImage ${p.heroImage}`);
  if (p.status === 'approved') {
    for (const l of LANGS) if (!p.longDescription?.[l]) errors.push(`${p.id}: approved but missing ${l} longDescription`);
  }
}
const keysOf = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keysOf(v, `${pre}${k}.`) : [`${pre}${k}`]));
const arKeys = new Set(keysOf(content.ar)), enKeys = new Set(keysOf(content.en));
for (const k of enKeys) if (!arKeys.has(k)) errors.push(`content.ar.json missing key ${k}`);
for (const k of arKeys) if (!enKeys.has(k)) errors.push(`content.en.json missing key ${k}`);
if (errors.length) {
  console.error('Data validation failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}

/* ---------------- Helpers ---------------- */
const isIndexableProduct = (p) => p.status === 'approved' && p.indexabilityOverride !== 'noindex';
const write = (base, urlPath, html) => {
  const file = urlPath.endsWith('/') ? path.join(base, urlPath, 'index.html') : path.join(base, urlPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
};

function makeCtx(lang, pageKey, p = {}) {
  return {
    lang, pageKey, config, media, clientLogos, categories, categoriesById, products, productsById, buildId,
    ui: content[lang].ui, pages: content[lang].pages, isIndexableProduct,
    ...p,
  };
}

/* ---------------- Clean & assets ---------------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.rmSync(PREVIEW, { recursive: true, force: true });
const ASSETS = path.join(DIST, 'assets');
fs.mkdirSync(path.join(ASSETS, 'styles'), { recursive: true });
const css = ['tokens.css', 'main.css', 'components.css', 'responsive.css'].map((f) => `/* ${f} */\n` + fs.readFileSync(path.join(SRC, 'styles', f), 'utf8')).join('\n');
fs.writeFileSync(path.join(ASSETS, 'styles', 'site.css'), css);
copyDir(path.join(SRC, 'scripts'), path.join(ASSETS, 'scripts'));
for (const d of ['logo', 'images', 'video', 'pdf', 'fonts']) copyDir(path.join(SRC, 'assets', d), path.join(ASSETS, d));
const PH = path.join(ASSETS, 'images', 'placeholders');
fs.mkdirSync(PH, { recursive: true });
for (const m of [...media.images, ...media.gallery]) if (!m.src) fs.writeFileSync(path.join(PH, `${m.id}.svg`), placeholderSVG(m));

/* ---------------- Pages ---------------- */
const matrix = [];
const pageRenderers = { home: Pages.home, about: Pages.about, corporates: Pages.corporates, celebrations: Pages.celebrations, b2b: Pages.b2b, facility: Pages.facility, gallery: Pages.galleryPage, contact: Pages.contact, privacy: Pages.privacy };
const defaultService = { corporates: 'corporate', celebrations: 'celebration', b2b: 'b2b' };

function render(ctx, result, indexable) {
  const meta = { ...result.meta, indexable };
  return document(ctx, meta, result.main, { afterMain: result.afterMain || '' });
}
const record = (row) => matrix.push(row);

for (const key of Object.keys(PAGE_ROUTES)) {
  for (const lang of LANGS) {
    const p = route(key, lang);
    const alternates = { ar: route(key, 'ar'), en: route(key, 'en') };
    const ctx = makeCtx(lang, key, { path: p, alternates, defaultService: defaultService[key] });
    const result = pageRenderers[key](ctx);
    ctx.pageTitleShort = result.meta.title;
    let indexable = true;
    let status = 'ready-for-review';
    if (key === 'facility') { indexable = result.live === true; status = result.live ? 'live' : 'coming-soon (noindex)'; if (result.live) ctx.defaultService = 'facility'; }
    if (key === 'privacy') { indexable = result.indexable; status = indexable ? 'approved' : 'legal-review-draft (noindex)'; }
    write(DIST, p, render(ctx, result, indexable));
    record({ path: p, lang, type: 'page', key, status, indexable, canonical: indexable ? config.productionBaseUrl + p : '', alt_ar: alternates.ar, alt_en: alternates.en, title: result.meta.title });
  }
}

/* Service sub-pages (7 corporate + 6 celebration) */
for (const hubKey of ['corporates', 'celebrations']) {
  const slugs = content.en.pages[hubKey].services.items.map((s) => s.slug);
  for (const slug of slugs) {
    for (const lang of LANGS) {
      const item = content[lang].pages[hubKey].services.items.find((s) => s.slug === slug);
      const p = serviceRoute(hubKey, slug, lang);
      const alternates = { ar: serviceRoute(hubKey, slug, 'ar'), en: serviceRoute(hubKey, slug, 'en') };
      const ctx = makeCtx(lang, 'service', { path: p, alternates, navParent: hubKey, defaultService: defaultService[hubKey], defaultDetail: slug, pageTitleShort: item.title || item.h3 });
      const result = Pages.servicePage(ctx, hubKey, item);
      write(DIST, p, render(ctx, result, true));
      record({ path: p, lang, type: 'service', key: `${hubKey}/${slug}`, status: 'ready-for-review', indexable: true, canonical: config.productionBaseUrl + p, alt_ar: alternates.ar, alt_en: alternates.en, title: result.meta.title });
    }
  }
}

/* Product-family pages */
for (const cat of categories) {
  for (const lang of LANGS) {
    const p = familyRoute(cat.slug, lang);
    const alternates = { ar: familyRoute(cat.slug, 'ar'), en: familyRoute(cat.slug, 'en') };
    const ctx = makeCtx(lang, 'family', { path: p, alternates, navParent: 'b2b', defaultService: 'b2b', defaultDetail: cat.slug, pageTitleShort: cat.name[lang] });
    const result = Pages.family(ctx, cat);
    const hasProducts = products.some((x) => x.category === cat.id && x.status !== 'archived');
    write(DIST, p, render(ctx, result, hasProducts));
    record({ path: p, lang, type: 'family', key: cat.id, status: hasProducts ? 'ready-for-review' : 'empty (noindex)', indexable: hasProducts, canonical: hasProducts ? config.productionBaseUrl + p : '', alt_ar: alternates.ar, alt_en: alternates.en, title: result.meta.title });
  }
}

/* Facility Management phase-2 template preview (never deployed; noindex) */
for (const lang of LANGS) {
  const p = route('facility', lang);
  const ctx = makeCtx(lang, 'facility', { path: p, alternates: { ar: route('facility', 'ar'), en: route('facility', 'en') }, defaultService: 'facility' });
  const res = Pages.facility(ctx, { forceLive: true });
  const html = render(ctx, res, false).replace('<body class="', '<body class="is-preview ');
  write(PREVIEW, `/facility-live/${lang}/`, html);
}

/* ---------------- Products ---------------- */
let productPages = 0;
for (const prod of products) {
  if (prod.status === 'archived') continue;
  for (const lang of LANGS) {
    const p = productRoute(prod, lang);
    const alternates = { ar: productRoute(prod, 'ar'), en: productRoute(prod, 'en') };
    const ctx = makeCtx(lang, 'product', { path: p, alternates, navParent: 'b2b', defaultService: 'b2b', pageTitleShort: prod.name[lang] });
    const result = Pages.product(ctx, prod);
    const indexable = isIndexableProduct(prod);
    write(DIST, p, render(ctx, result, indexable));
    productPages++;
    record({ path: p, lang, type: 'product', key: prod.id, status: `${prod.status}${indexable ? '' : ' (noindex)'}`, indexable, canonical: indexable ? config.productionBaseUrl + p : '', alt_ar: alternates.ar, alt_en: alternates.en, title: result.meta.title });
  }
}

/* ---------------- 404s ---------------- */
for (const lang of LANGS) {
  const ctx = makeCtx(lang, 'notfound', { path: `/${lang}/404.html`, alternates: { ar: '/ar/404.html', en: '/en/404.html' } });
  write(DIST, `/${lang}/404.html`, render(ctx, Pages.notFound(ctx), false));
}
{
  const ctx = makeCtx('ar', 'notfound', { path: '/404.html', alternates: { ar: '/ar/', en: '/en/' } });
  write(DIST, '/404.html', render(ctx, Pages.notFound(ctx), false));
}

/* ---------------- Root entry (Arabic-first language gateway) ---------------- */
{
  const logo = config.brand.logo;
  write(DIST, '/', `<!doctype html>
<html lang="ar" dir="rtl" class="no-js">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>بلام للتموين | Plum Catering</title>
<meta name="description" content="بلام للتموين — خدمات التموين والإعاشة في الرياض. Plum Catering — catering services in Riyadh.">
<meta name="robots" content="noindex,follow">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Tajawal:wght@500;700&display=swap">
<link rel="stylesheet" href="/assets/styles/site.css?v=${buildId}">
<style>.gate{min-height:100vh;display:grid;place-items:center;text-align:center;padding:40px 20px}.gate img{width:180px;margin:0 auto 32px}.gate .btn-row{justify-content:center}.gate p{color:var(--text-muted)}</style>
</head>
<body>
<main class="gate"><div>
  <img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="بلام للتموين — Plum Catering">
  <h1 class="visually-hidden">بلام للتموين — Plum Catering</h1>
  <div class="btn-row">
    <a class="btn btn--primary" href="/ar/" hreflang="ar" lang="ar">العربية</a>
    <a class="btn btn--secondary" href="/en/" hreflang="en" lang="en" style="font-family:Inter,Arial,sans-serif">English</a>
  </div>
  <p class="small" style="margin-top:24px">Production: <code>/</code> should 301/302 to <code>/ar/</code> at the server — see docs/deployment-and-redirects.md</p>
</div></main>
</body></html>
`);
}

/* ---------------- Sitemap & robots ---------------- */
const indexables = matrix.filter((r) => r.indexable);
const today = new Date().toISOString().slice(0, 10);
const urlXml = (r) => `  <url>
    <loc>${esc(r.canonical)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="ar-SA" href="${config.productionBaseUrl}${r.alt_ar}"/>
    <xhtml:link rel="alternate" hreflang="en-SA" href="${config.productionBaseUrl}${r.alt_en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${config.productionBaseUrl}${config.xDefaultLanguage === 'ar' ? r.alt_ar : r.alt_en}"/>
  </url>`;
const sitemapFile = (rows) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rows.map(urlXml).join('\n')}
</urlset>
`;
const pagesRows = indexables.filter((r) => r.type !== 'product');
const productRows = indexables.filter((r) => r.type === 'product');
fs.writeFileSync(path.join(DIST, 'sitemap-pages.xml'), sitemapFile(pagesRows));
const sitemaps = ['sitemap-pages.xml'];
if (productRows.length) { fs.writeFileSync(path.join(DIST, 'sitemap-products.xml'), sitemapFile(productRows)); sitemaps.push('sitemap-products.xml'); }
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap><loc>${config.productionBaseUrl}/${s}</loc><lastmod>${today}</lastmod></sitemap>`).join('\n')}
</sitemapindex>
`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `# Production robots.txt for ${config.productionBaseUrl}
# STAGING: replace this file with "User-agent: *\\nDisallow: /" AND protect staging with HTTP auth.
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?*utm_
Disallow: /*?s=

Sitemap: ${config.productionBaseUrl}/sitemap.xml
`);

/* ---------------- Docs: URL matrix & build report ---------------- */
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const header = ['path', 'lang', 'type', 'key', 'status', 'indexable', 'in_sitemap', 'canonical', 'hreflang_ar-SA', 'hreflang_en-SA', 'x_default', 'title'];
const csv = [header.join(',')].concat(
  matrix.map((r) => [r.path, r.lang, r.type, r.key, r.status, r.indexable ? 'yes' : 'no', r.indexable ? 'yes' : 'no', r.canonical, r.indexable ? config.productionBaseUrl + r.alt_ar : '', r.indexable ? config.productionBaseUrl + r.alt_en : '', r.indexable ? config.productionBaseUrl + r.alt_ar : '', r.title].map(csvCell).join(','))
);
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'seo-url-matrix.csv'), csv.join('\n') + '\n');

const report = {
  servicePages: matrix.filter((r) => r.type === 'service').length,
  familyPages: matrix.filter((r) => r.type === 'family').length,
  builtAt: new Date().toISOString(),
  mode: config.prototype.showReviewFlags ? 'review' : 'clean',
  corePages: matrix.filter((r) => r.type === 'page').length,
  productRecords: products.length,
  productRecordsApproved: products.filter((p) => p.status === 'approved').length,
  expectedProducts: categories.reduce((s, c) => s + c.expectedCount, 0),
  productPages,
  indexableUrls: indexables.length,
  noindexUrls: matrix.length - indexables.length,
  sitemapUrls: indexables.length,
  galleryPhotosSupplied: media.gallery.filter((g) => g.src && !g.demo).length,
  galleryTarget: media.galleryTarget,
};
fs.writeFileSync(path.join(ROOT, 'docs', 'build-report.json'), JSON.stringify(report, null, 2));
console.log('Build complete:', report);
