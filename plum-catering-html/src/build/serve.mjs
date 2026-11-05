#!/usr/bin/env node
// Tiny zero-dependency static preview server for dist/ (LOCAL REVIEW ONLY).
// Resolves /ar/... and /en/... directory URLs to index.html and serves the
// localized 404 page. /__preview/ serves the unpublished FM phase-2 template.
// This is NOT production redirect behaviour — see docs/deployment-and-redirects.md.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'dist');
const PREVIEW = path.join(ROOT, 'preview');
const PORT = Number(process.env.PORT || 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.vtt': 'text/vtt' };

function resolve(urlPath) {
  let base = DIST, p = urlPath;
  if (p.startsWith('/__preview/')) { base = PREVIEW; p = p.slice('/__preview'.length); }
  const file = path.normalize(path.join(base, decodeURIComponent(p)));
  if (!file.startsWith(base)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!urlPath.endsWith('/')) return { redirect: urlPath + '/' };
    const idx = path.join(file, 'index.html');
    return fs.existsSync(idx) ? { file: idx } : null;
  }
  return fs.existsSync(file) ? { file } : null;
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/api/quote') {
    res.writeHead(501, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: false, error: 'not_implemented', message: 'Preview server has no quote backend.' }));
  }
  const r = resolve(url.pathname);
  if (r?.redirect) { res.writeHead(301, { Location: r.redirect }); return res.end(); }
  if (!r) {
    const lang = url.pathname.startsWith('/en/') ? 'en' : 'ar';
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    return fs.createReadStream(path.join(DIST, lang, '404.html')).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(r.file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(r.file).pipe(res);
}).listen(PORT, () => {
  console.log(`Plum Catering prototype → http://localhost:${PORT}/ar/  (English: /en/)`);
  console.log(`FM phase-2 template preview → http://localhost:${PORT}/__preview/facility-live/ar/`);
});
