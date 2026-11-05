#!/usr/bin/env node
// Static QA checker for dist/ — run after `npm run build`. Exits 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site-config.json'), 'utf8'));
const productsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf8'));
const BASE = config.productionBaseUrl;
const fails = [], warns = [], passes = [];
const fail = (m) => fails.push(m), pass = (m) => passes.push(m);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []));
const files = walk(DIST);
const urlOf = (f) => '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '');
const pages = new Map(files.map((f) => [urlOf(f), fs.readFileSync(f, 'utf8')]));
const exists = (p) => {
  const clean = decodeURIComponent(p.split('#')[0].split('?')[0]);
  const f = path.join(DIST, clean);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html')));
};
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const metas = (html) => {
  const robots = attr(html.match(/<meta name="robots"[^>]*>/)?.[0] || '', 'content') || '';
  const canonical = attr(html.match(/<link rel="canonical"[^>]*>/)?.[0] || '', 'href');
  const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => [m[1], m[2]]));
  return { robots, indexable: robots.startsWith('index'), canonical, alts };
};

const content = { ar: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.ar.json'), 'utf8')), en: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.en.json'), 'utf8')) };
const CORE = ['/ar/', '/en/', '/ar/about-us/', '/en/about-us/', '/ar/services/sharikat/', '/en/services/corporates/', '/ar/services/munasabat/', '/en/services/celebrations/', '/ar/services/qitaa-al-aamal/', '/en/services/b2b/', '/ar/services/idarat-al-marafiq/', '/en/services/facility-management/', '/ar/privacy/', '/en/privacy/', '/ar/gallery/', '/en/gallery/', '/ar/contact/', '/en/contact/'];
for (const c of CORE) (pages.has(c) ? pass : fail)(`core page exists: ${c}`);

const titles = new Map();
const sitemapXml = ['sitemap-pages.xml', 'sitemap-products.xml'].filter((f) => fs.existsSync(path.join(DIST, f))).map((f) => fs.readFileSync(path.join(DIST, f), 'utf8')).join('\n');
const sitemapLocs = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

for (const [url, html] of pages) {
  const isRootGate = url === '/';
  const lang = url.startsWith('/en/') ? 'en' : 'ar';
  const htmlTag = html.match(/<html[^>]*>/)[0];
  if (attr(htmlTag, 'lang') !== lang) fail(`${url}: lang should be ${lang}`);
  if (attr(htmlTag, 'dir') !== (lang === 'ar' ? 'rtl' : 'ltr')) fail(`${url}: wrong dir`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`${url}: expected exactly one <h1>, found ${h1s}`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = attr(html.match(/<meta name="description"[^>]*>/)?.[0] || '', 'content');
  if (!title) fail(`${url}: missing <title>`);
  if (!desc || desc.length < 50) fail(`${url}: missing/short meta description`);
  if (!url.includes('404') && !isRootGate) { if (titles.has(title)) fail(`${url}: duplicate title with ${titles.get(title)}`); titles.set(title, url); }
  const m = metas(html);
  if (m.indexable) {
    if (m.canonical !== BASE + url) fail(`${url}: canonical ${m.canonical} is not self`);
    if (!m.alts['ar-SA'] || !m.alts['en-SA']) fail(`${url}: missing hreflang pair`);
    else {
      const otherUrl = (lang === 'ar' ? m.alts['en-SA'] : m.alts['ar-SA']).replace(BASE, '');
      const other = pages.get(otherUrl);
      if (!other) fail(`${url}: hreflang target ${otherUrl} missing`);
      else {
        const om = metas(other);
        if (!om.indexable) fail(`${url}: hreflang target ${otherUrl} is noindex`);
        if ((lang === 'ar' ? om.alts['ar-SA'] : om.alts['en-SA']) !== BASE + url) fail(`${url}: hreflang not reciprocal from ${otherUrl}`);
      }
    }
    if (!sitemapLocs.has(BASE + url)) fail(`${url}: indexable but not in sitemap`);
  } else {
    if (sitemapLocs.has(BASE + url)) fail(`${url}: noindex but listed in sitemap`);
    if (m.canonical) fail(`${url}: noindex page should not declare canonical`);
  }
  // Links
  for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]*)"/g)) {
    if (href === '#' || href === '' || href.startsWith('javascript:')) fail(`${url}: empty/fake link href="${href}"`);
    else if (href.startsWith('#')) { if (!html.includes(`id="${href.slice(1)}"`)) fail(`${url}: in-page anchor ${href} has no target`); }
    else if (href.startsWith('/')) {
      if (!exists(href)) fail(`${url}: broken internal link ${href}`);
      const hash = href.split('#')[1];
      if (hash) { const target = pages.get(href.split('#')[0]); if (target && !target.includes(`id="${hash}"`)) fail(`${url}: anchor ${href} target id missing`); }
    }
    if (/wa\.me\/|tel:/.test(href) && !config.contact.whatsappNumber && !config.contact.phone) fail(`${url}: phone/WhatsApp link without approved number`);
  }
  // Images need alt
  for (const [tag] of html.matchAll(/<img\s[^>]*>/g)) if (!/\salt="/.test(tag)) fail(`${url}: <img> without alt: ${tag.slice(0, 80)}`);
  // JSON-LD honesty
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const s = JSON.stringify(JSON.parse(json));
      for (const k of ['"offers"', '"aggregateRating"', '"review"', '"price"', '"availability"']) if (s.includes(k)) fail(`${url}: JSON-LD contains forbidden ${k}`);
    } catch (e) { fail(`${url}: invalid JSON-LD (${e.message})`); }
  }
  if (/lorem ipsum/i.test(html)) fail(`${url}: lorem ipsum found`);
  if (html.includes('data-quote-open') && !html.includes('id="site-contact"')) fail(`${url}: quote fallback target missing`);
}

// Facility Management must be noindex while coming_soon
if (config.facilityManagement.launchMode !== 'live') {
  for (const u of ['/ar/services/idarat-al-marafiq/', '/en/services/facility-management/']) (!metas(pages.get(u)).indexable ? pass : fail)(`FM noindex while coming soon: ${u}`);
}
const live = productsData.products.filter((p) => p.status !== 'archived');
// Service sub-pages and family pages exist and are linked from their hubs
for (const [hub, base] of [['corporates', { ar: '/ar/services/sharikat/', en: '/en/services/corporates/' }], ['celebrations', { ar: '/ar/services/munasabat/', en: '/en/services/celebrations/' }]]) {
  for (const lang of ['ar', 'en']) {
    const hubHtml = pages.get(base[lang]);
    for (const s of content[lang].pages[hub].services.items) {
      const u = `${base[lang]}${s.slug}/`;
      if (!pages.has(u)) fail(`service page missing ${u}`);
      if (!hubHtml.includes(`href="${u}"`)) fail(`${base[lang]} does not link ${u}`);
    }
  }
}
for (const c of productsData.categories) for (const lang of ['ar', 'en']) {
  const u = `/${lang}/products/${c.slug}/`;
  if (!pages.has(u)) fail(`family page missing ${u}`);
  const b2b = pages.get(lang === 'ar' ? '/ar/services/qitaa-al-aamal/' : '/en/services/b2b/');
  if (!b2b.includes(`href="${u}"`)) fail(`B2B ${lang} hub does not link family ${u}`);
  const fam = pages.get(u);
  for (const p of live.filter((x) => x.category === c.id)) if (!fam.includes(`href="/${lang}/products/${p.slug[lang]}/"`)) fail(`family ${u} does not link ${p.slug[lang]}`);
}
// Catalogue hub links every product, in the same language (finder)
for (const lang of ['ar', 'en']) {
  const b2b = pages.get(lang === 'ar' ? '/ar/services/qitaa-al-aamal/' : '/en/services/b2b/');
  for (const p of live) {
    const u = `/${lang}/products/${p.slug[lang]}/`;
    if (!b2b.includes(`href="${u}"`)) fail(`B2B ${lang} does not link ${u}`);
    if (!pages.has(u)) fail(`product page missing ${u}`);
  }
}
// Draft products must be noindex
for (const p of productsData.products) for (const lang of ['ar', 'en']) {
  const h = pages.get(`/${lang}/products/${p.slug[lang]}/`);
  if (h && p.status !== 'approved' && metas(h).indexable) fail(`${p.id} (${lang}) is ${p.status} but indexable`);
}
// Sitemap URLs must all exist
for (const loc of sitemapLocs) if (!pages.has(loc.replace(BASE, ''))) fail(`sitemap lists missing page ${loc}`);
if (!fs.existsSync(path.join(DIST, 'robots.txt'))) fail('robots.txt missing');

const indexable = [...pages].filter(([u, h]) => metas(h).indexable).length;
const summary = {
  checkedAt: new Date().toISOString(), htmlFiles: pages.size, indexable, noindex: pages.size - indexable, sitemapUrls: sitemapLocs.size,
  productRecords: productsData.products.length, approvedProducts: productsData.products.filter((p) => p.status === 'approved').length,
  expectedProducts: productsData.categories.reduce((s, c) => s + c.expectedCount, 0),
  productPages: [...pages.keys()].filter((u) => /\/products\/[^/]+\/$/.test(u) && !productsData.categories.some((c) => u.endsWith(`/products/${c.slug}/`))).length,
  servicePages: [...pages.keys()].filter((u) => /\/services\/[^/]+\/[^/]+\/$/.test(u)).length,
  familyPages: productsData.categories.length * 2,
  failures: fails, warnings: warns, passedChecks: passes.length,
};
fs.writeFileSync(path.join(ROOT, 'docs', 'qa-static-results.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ ...summary, failures: fails.length ? fails : 'none' }, null, 2));
process.exit(fails.length ? 1 : 0);
