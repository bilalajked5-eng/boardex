#!/usr/bin/env node
// Builds ONE self-contained HTML file from dist/ for offline review (double-click, no server).
// Every page is stored inside the file and rendered into an <iframe srcdoc>; assets are data URIs.
// This is a REVIEW CONVENIENCE ONLY — the deployable site is dist/ (real URLs, crawlable).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'plum-catering-complete.html');
const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt' };

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

/* ---- pages ---- */
const pages = {};
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const url = '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  pages[url] = fs.readFileSync(f, 'utf8');
}

/* ---- assets (binary → data URI) ---- */
const assets = {};
for (const f of walk(path.join(DIST, 'assets'))) {
  const ext = path.extname(f).toLowerCase();
  if (!MIME[ext]) continue;
  const url = '/' + path.relative(DIST, f).replace(/\\/g, '/');
  assets[url] = `data:${MIME[ext]};base64,${fs.readFileSync(f).toString('base64')}`;
}
const css = fs.readFileSync(path.join(DIST, 'assets/styles/site.css'), 'utf8').replace(/url\((['"]?)(\/assets\/[^'")]+)\1\)/g, (m, q, u) => (assets[u] ? `url(${assets[u]})` : m));

/* ---- JS: bundle the ES modules into one classic script ---- */
const SCR = path.join(DIST, 'assets/scripts');
const order = ['dialog', 'tracking-adapter', 'cookie-consent', 'navigation', 'quote-modal', 'product-filters', 'gallery'];
let js = 'const PLUM_MODULES = {};\n';
for (const name of order) {
  let src = fs.readFileSync(path.join(SCR, `${name}.js`), 'utf8');
  const exportsList = [];
  src = src.replace(/^import\s*\{([^}]+)\}\s*from\s*'\.\/([\w-]+)\.js';\s*$/gm, (m, names, mod) => `const {${names}} = PLUM_MODULES['${mod}'];`);
  src = src.replace(/^export\s+(async\s+)?function\s+(\w+)/gm, (m, a, n) => { exportsList.push(n); return `${a || ''}function ${n}`; });
  src = src.replace(/^export\s+const\s+(\w+)/gm, (m, n) => { exportsList.push(n); return `const ${n}`; });
  js += `\n/* ${name}.js */\n(function(){\n${src}\nPLUM_MODULES['${name}'] = {${exportsList.join(', ')}};\n})();\n`;
}
let main = fs.readFileSync(path.join(SCR, 'main.js'), 'utf8').replace(/^import[^\n]*\n/gm, '');
const MOD = { initTracking: 'tracking-adapter', initCookieConsent: 'cookie-consent', initNavigation: 'navigation', initQuoteModal: 'quote-modal', initProductFilters: 'product-filters', initGallery: 'gallery' };
main = main.replace(/\b(initTracking|initCookieConsent|initNavigation|initQuoteModal|initProductFilters|initGallery)\b/g, (m) => `${m}: PLUM_MODULES['${MOD[m]}'].${m}`);
js += `\n/* main.js */\n(function(){\n${main}\n})();\n`;
// in-frame link routing: send page links to the parent router
js += `
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#/"]');
  if (!a || a.hasAttribute('download') || a.hasAttribute('data-quote-open') || e.defaultPrevented) return;
  e.preventDefault();
  parent.postMessage({ plumRoute: a.getAttribute('href').slice(1) }, '*');
});
`;

/* ---- page transform (done once at build time; assets substituted at runtime to keep the file small) ---- */
const transformed = {};
for (const [url, html] of Object.entries(pages)) {
  let h = html
    .replace('<head>', '<head><script>window.PLUM_REVIEW_BUNDLE=true;</script>')
    .replace(/<link rel="stylesheet" href="\/assets\/styles\/site\.css[^"]*">/, '<style>__CSS__</style>')
    .replace(/<script type="module" src="\/assets\/scripts\/main\.js[^"]*"><\/script>/, '<script>__JS__</script>')
    .replace(/(href|action)="(\/(?:ar|en)\/[^"#]*|\/)(#[^"]*)?"/g, (m, attr, p, hash) => `${attr}="#${p}${hash || ''}"`)
    .replace(/<link rel="canonical"[^>]*>|<link rel="alternate"[^>]*>|<meta property="og:url"[^>]*>/g, '');
  transformed[url] = h;
}

const title = 'Plum Catering — complete website (offline review bundle)';
const out = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
html,body{margin:0;height:100%;background:#F8F6F2;font-family:Inter,Tajawal,Arial,sans-serif}
#bar{position:fixed;inset:0 0 auto 0;height:36px;display:flex;align-items:center;gap:12px;padding:0 12px;background:#341835;color:#EAE7DC;font-size:13px;z-index:10;box-sizing:border-box}
#bar code{background:rgba(255,255,255,.12);padding:2px 8px;border-radius:6px;direction:ltr;font-size:12px}
#bar a{color:#fff}
iframe{position:absolute;top:36px;left:0;width:100%;height:calc(100% - 36px);border:0;background:#F8F6F2}
</style>
</head>
<body>
<div id="bar"><strong>Plum Catering · offline review bundle</strong><span>Page:</span><code id="cur">/ar/</code><span style="margin-inline-start:auto"><a href="#/ar/">العربية</a> · <a href="#/en/">English</a> · <a href="#/en/services/b2b/">B2B</a></span></div>
<iframe id="frame" title="Plum Catering website"></iframe>
<script id="pages" type="application/json">${JSON.stringify(transformed).replace(/<\/script/gi, '<\\/script')}</script>
<script id="assets" type="application/json">${JSON.stringify(assets).replace(/<\/script/gi, '<\\/script')}</script>
<script id="css" type="text/plain">${css.replace(/<\/script/gi, '<\\/script')}</script>
<script id="js" type="text/plain">${js.replace(/<\/script/gi, '<\\/script')}</script>
<script>
(function(){
  const PAGES = JSON.parse(document.getElementById('pages').textContent);
  const ASSETS = JSON.parse(document.getElementById('assets').textContent);
  const CSS = document.getElementById('css').textContent;
  const JS = document.getElementById('js').textContent;
  const frame = document.getElementById('frame');
  const cur = document.getElementById('cur');
  const subst = (s) => s.replace(/\\/assets\\/[^"' )]+/g, (m) => ASSETS[m.split('?')[0]] || m);
  let current = null;
  function render() {
    let route = (location.hash || '#/ar/').slice(1).split('#')[0];
    if (route === current) return; // same page, only an in-page fragment changed
    current = route;
    if (!route.endsWith('/') && !route.endsWith('.html')) route += '/';
    let html = PAGES[route];
    if (!html) { html = PAGES[route.startsWith('/en/') ? '/en/404.html' : '/ar/404.html']; }
    html = html.replace('__CSS__', () => subst(CSS)).replace('__JS__', () => JS);
    html = subst(html);
    frame.srcdoc = html;
    cur.textContent = route;
    const t = html.match(/<title>([^<]*)<\\/title>/);
    document.title = (t ? t[1] + ' · ' : '') + 'offline bundle';
  }
  window.addEventListener('hashchange', render);
  window.addEventListener('message', (e) => { if (e.data && e.data.plumRoute) location.hash = '#' + e.data.plumRoute; });
  render();
})();
</script>
</body>
</html>
`;
fs.writeFileSync(OUT, out);
console.log(`Wrote ${OUT} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB, ${Object.keys(pages).length} pages, ${Object.keys(assets).length} assets)`);
