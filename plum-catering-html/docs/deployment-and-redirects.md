# Deployment, redirects & Search Console

The prototype is static (`dist/`). Production will be the WordPress theme on the **client-owned server** behind **Cloudflare** (proxy/CDN in front of the origin, not Cloudflare Pages). HTML meta tags **cannot** create 301 redirects; they need server or Cloudflare rules.

## 1. Root and language entry
`/` → `/ar/` (Arabic default). Use **302** if Accept-Language negotiation might be added later, otherwise **301**. `x-default` hreflang points to the Arabic URL of each pair.

**Apache (.htaccess)**
```apache
RewriteEngine On
RewriteRule ^$ /ar/ [R=301,L]
# Enforce trailing slash for directory routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*[^/])$ /$1/ [R=301,L]
ErrorDocument 404 /ar/404.html
```

**Nginx**
```nginx
location = / { return 301 /ar/; }
location /en/ { try_files $uri $uri/ /en/404.html; }
location /ar/ { try_files $uri $uri/ /ar/404.html; }
error_page 404 /ar/404.html;
```

**Cloudflare:** use *Rules → Redirect Rules* (single redirects) for one-to-one mappings, or *Bulk Redirects* for long lists from `redirects-mapping.csv`. Preserve query strings only where needed. Avoid chains, which means mapping old URLs directly to their final destination.

## 2. Legacy URL mapping
All seven page pairs keep their current paths (see `redirects-mapping.csv`). Before launch:
1. Export indexed URLs from Google Search Console (Pages report) and crawl the live site.
2. Map every other indexed or linked URL **one-to-one** to its most relevant new URL. Never redirect everything to Home.
3. After launch, re-crawl and fix any 404s or chains.

## 3. Cloudflare settings (recommended)
- SSL/TLS **Full (strict)** with a valid origin certificate. Always Use HTTPS. HSTS only after HTTPS is confirmed stable.
- Cache: static assets cached for a long time (`/assets/*`, `/wp-content/*`). HTML is bypassed or cached with care. **Bypass `/wp-admin/*`, `/wp-login.php`, `/wp-json/plum/v1/quote`, preview URLs and logged-in cookies.**
- Do not enable Rocket Loader (it can break module scripts and consent ordering). Keep Auto Minify off when the build already minifies.
- Optional WAF rate-limit rule on `POST /wp-json/plum/v1/quote`, and Turnstile if spam appears.
- Staging behind Cloudflare Access or HTTP auth, plus `Disallow: /` robots.

## 4. Robots & sitemap
- `dist/robots.txt` is the **production** version. Staging must use `Disallow: /` **and** authentication.
- `sitemap.xml` is an index of `sitemap-pages.xml` (+ `sitemap-products.xml` once products are approved). It contains only indexable canonical URLs with reciprocal `xhtml:link` alternates. In WordPress, the SEO plugin generates these; check that noindex products and FM (Coming Soon) are excluded.

## 5. Search Console (not done; needs client access)
1. Add a **Domain property** for `plumcatering.com.sa` and verify with a **DNS TXT** record in Cloudflare DNS (preferred). The HTML-tag fallback is `integrations.searchConsoleVerification` (empty, so no fake token is inserted).
2. Submit `https://plumcatering.com.sa/sitemap.xml`.
3. Use URL Inspection on `/ar/`, `/en/`, one service page and one approved product.
4. Monitor hreflang and indexing, and the Pages report for "Excluded by noindex" (expected for FM, drafts and privacy until approved).

## 6. Launch checklist
Pre-launch backup (files + DB), rollback plan (DNS TTL lowered, previous origin snapshot), redirects tested with `curl -I`, Consent Mode tested in Tag Assistant, form delivery tested to the M365 inbox, PDF downloads, 404s, Core Web Vitals measured on the live origin (PageSpeed Insights / CrUX after 28 days).

## 7. Local preview (prototype only)
`npm run preview` starts `src/build/serve.mjs` on `http://localhost:4173`. That server maps directories to `index.html` and serves the localised 404. **It is not a model of production redirect behaviour.** `/__preview/facility-live/{ar|en}/` serves the unpublished FM phase-2 template, which is never part of `dist/`.
