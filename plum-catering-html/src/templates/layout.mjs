// Global layout: <head>, SiteHeader, drawer, SiteFooter, QuoteModal, CookieConsent, mobile bar.
import { esc, fmt, attrs, icon, join, when, rf, fact, reviewMode } from './helpers.mjs';
import { route, otherLang } from './routes.mjs';

const NAV = ['home', 'about', 'corporates', 'celebrations', 'b2b', 'facility'];

/* ---------------- WhatsApp ---------------- */
export function whatsappHref(ctx, message) {
  const n = ctx.config.contact.whatsappNumber;
  if (!n) return null;
  const digits = String(n).replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
export function whatsappControl(ctx, { variant = 'icon', message } = {}) {
  const msg = message || `${ctx.ui.cta.whatsapp} — ${ctx.config.siteName[ctx.lang]} (${ctx.pageTitleShort || ''})`;
  const href = whatsappHref(ctx, msg);
  if (href) {
    const a = { href, target: '_blank', rel: 'noopener', 'data-track': 'whatsapp_click', 'data-wa': '' };
    return variant === 'icon'
      ? `<a class="icon-btn"${attrs(a)} aria-label="${esc(ctx.ui.cta.whatsapp)}">${icon('whatsapp')}</a>`
      : `<a class="btn btn--secondary"${attrs(a)}>${icon('whatsapp')}<span>${esc(ctx.ui.cta.whatsapp)}</span></a>`;
  }
  // Number not supplied: never invent one. Non-interactive pending indicator (review builds only).
  if (!reviewMode(ctx)) return '';
  return variant === 'icon'
    ? `<span class="icon-btn is-pending" role="img" aria-label="${esc(ctx.ui.whatsappPending)}" title="${esc(ctx.ui.whatsappPending)}">${icon('whatsapp')}</span>`
    : `<span class="review-flag" title="${esc(ctx.ui.whatsappPending)}">${icon('whatsapp')}<span>${esc(ctx.ui.whatsappPending)}</span></span>`;
}

/* ---------------- Quote trigger (progressive: anchor → modal) ---------------- */
export function quoteButton(ctx, { label, service, product, cls = 'btn btn--primary', iconName = 'arrow' } = {}) {
  const a = {
    href: '#site-contact',
    class: cls,
    'data-quote-open': '',
    'data-service': service || ctx.defaultService || null,
    'data-product-id': product?.id || null,
    'data-product-name': product?.name || null,
    'data-product-category': product?.category || null,
    'aria-haspopup': 'dialog',
  };
  return `<a${attrs(a)}><span>${esc(label || ctx.ui.cta.quote)}</span>${iconName ? icon(iconName, { dir: true }) : ''}</a>`;
}

/* ---------------- Language switcher ---------------- */
function langSwitch(ctx, extraCls = '') {
  const other = otherLang(ctx.lang);
  const href = ctx.alternates?.[other] || route('home', other);
  return `<a class="lang-switch ${extraCls}" href="${esc(href)}" hreflang="${other}" lang="${other}" data-lang-switch aria-label="${esc(ctx.ui.lang.switchLabel)}">${icon('globe')}<span lang="${other}">${esc(ctx.ui.lang.switchTo)}</span></a>`;
}

function navItems(ctx, { inDrawer = false } = {}) {
  return join(NAV, (key) => {
    const href = route(key, ctx.lang);
    const current = ctx.pageKey === key;
    const ancestor = ctx.navParent === key;
    const badge = key === 'facility' && ctx.config.facilityManagement.launchMode !== 'live' ? ` <span class="nav-badge">${esc(ctx.ui.nav.comingSoon)}</span>` : '';
    return `<li><a class="nav-link" href="${href}"${current ? ' aria-current="page"' : ancestor ? ' data-ancestor="true"' : ''}>${esc(ctx.ui.nav[key])}${badge}${inDrawer ? icon('chevron', { dir: true }) : ''}</a></li>`;
  });
}

export function header(ctx) {
  const logo = ctx.config.brand.logo;
  return `<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="site-logo" href="${route('home', ctx.lang)}" aria-label="${esc(ctx.config.siteName[ctx.lang])} — ${esc(ctx.ui.nav.home)}"><img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="${esc(ctx.config.siteName[ctx.lang])}" fetchpriority="high"></a>
    <nav class="primary-nav" aria-label="${esc(ctx.ui.nav.label)}"><ul class="nav-list">${navItems(ctx)}</ul></nav>
    <div class="header-actions">
      ${langSwitch(ctx)}
      ${whatsappControl(ctx)}
      ${quoteButton(ctx, { cls: 'btn btn--primary btn--sm btn--quote-desktop', iconName: null })}
      <button class="icon-btn menu-toggle" type="button" data-drawer-open aria-controls="site-drawer" aria-expanded="false" aria-label="${esc(ctx.ui.nav.menu)}">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

export function drawer(ctx) {
  const logo = ctx.config.brand.logo;
  return `<dialog class="drawer" id="site-drawer" aria-label="${esc(ctx.ui.nav.label)}">
  <div class="drawer__panel">
    <div class="drawer__head">
      <img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="${esc(ctx.config.siteName[ctx.lang])}" loading="lazy">
      <button class="icon-btn" type="button" data-drawer-close aria-label="${esc(ctx.ui.nav.close)}">${icon('close')}</button>
    </div>
    <nav aria-label="${esc(ctx.ui.nav.label)}"><ul class="nav-list">${navItems(ctx, { inDrawer: true })}</ul></nav>
    <div class="drawer__actions">
      ${quoteButton(ctx)}
      ${whatsappControl(ctx, { variant: 'button' })}
      ${langSwitch(ctx)}
    </div>
  </div>
</dialog>`;
}

export function footer(ctx) {
  const u = ctx.ui.footer;
  const logo = ctx.config.brand.logo;
  const certs = fact(ctx, 'certifications');
  const c = ctx.config.contact;
  const contactItems = [
    c.phone && `<li><a href="tel:${esc(c.phone.replace(/\s/g, ''))}" dir="ltr">${esc(c.phone)}</a></li>`,
    c.email && `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`,
    c.address?.[ctx.lang] && `<li>${esc(c.address[ctx.lang])}</li>`,
  ].filter(Boolean);
  const fmLive = ctx.config.facilityManagement.launchMode === 'live';
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${route('home', ctx.lang)}" aria-label="${esc(ctx.config.siteName[ctx.lang])} — ${esc(ctx.ui.nav.home)}"><img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="${esc(ctx.config.siteName[ctx.lang])}" loading="lazy"></a>
        <p>${esc(u.summary)}</p>
        ${when(certs, () => `<div class="footer-cert">${certs.value.map((x) => `<span class="cert-pill" dir="ltr">${esc(x)}</span>`).join('')}${certs.flag}</div>`)}
      </div>
      <div class="footer-col">
        <h2>${esc(u.services)}</h2>
        <ul>
          <li><a href="${route('corporates', ctx.lang)}">${esc(ctx.ui.nav.corporates)}</a></li>
          <li><a href="${route('celebrations', ctx.lang)}">${esc(ctx.ui.nav.celebrations)}</a></li>
          <li><a href="${route('b2b', ctx.lang)}">${esc(ctx.ui.nav.b2b)}</a></li>
          <li><a href="${route('facility', ctx.lang)}">${esc(ctx.ui.nav.facility)}${fmLive ? '' : ` <span class="nav-badge">${esc(ctx.ui.nav.comingSoon)}</span>`}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>${esc(u.company)}</h2>
        <ul>
          <li><a href="${route('home', ctx.lang)}">${esc(ctx.ui.nav.home)}</a></li>
          <li><a href="${route('about', ctx.lang)}">${esc(ctx.ui.nav.about)}</a></li>
          <li><a href="${route('privacy', ctx.lang)}">${esc(ctx.ui.nav.privacy)}</a></li>
          <li><button class="footer-link-btn" type="button" data-cookie-settings>${esc(u.cookieSettings)}</button></li>
        </ul>
      </div>
      <div class="footer-col" id="site-contact">
        <h2>${esc(u.contact)}</h2>
        ${contactItems.length ? `<ul>${contactItems.join('')}</ul>` : reviewMode(ctx) ? `<p class="small muted">${esc(u.contactPending)}</p>` : ''}
        <p class="small muted">${esc(u.quotePrompt)}</p>
        <div class="btn-row">${quoteButton(ctx, { cls: 'btn btn--primary btn--sm', iconName: null })}${whatsappControl(ctx)}</div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${ctx.config.copyrightYear} ${esc(ctx.config.siteName[ctx.lang])}. ${esc(u.rights)}</span>
      <span><a href="${route('privacy', ctx.lang)}">${esc(ctx.ui.nav.privacy)}</a></span>
    </div>
  </div>
</footer>`;
}

/* ---------------- QuoteModal ---------------- */
export function quoteModal(ctx) {
  const q = ctx.ui.quote;
  const fmLive = ctx.config.facilityManagement.launchMode === 'live';
  const services = ['corporate', 'celebration', 'b2b', ...(fmLive ? ['facility'] : [])];
  const req = `<span class="req" aria-hidden="true">*</span><span class="visually-hidden"> (${esc(q.required)})</span>`;
  const opt = `<span class="opt">(${esc(q.optional)})</span>`;
  const field = (id, label, input, { full = false, hint = '', cond = null, required = false } = {}) =>
    `<div class="field${full ? ' field--full' : ''}"${cond ? ` data-cond="${cond}"` : ''}>
      <label class="field__label" for="q-${id}">${esc(label)} ${required ? req : opt}</label>
      ${input}
      ${hint ? `<span class="field__hint" id="q-${id}-hint">${esc(hint)}</span>` : ''}
      <span class="field__error" id="q-${id}-error" aria-live="polite"></span>
    </div>`;
  const desc = (id, hint) => `aria-describedby="${hint ? `q-${id}-hint ` : ''}q-${id}-error"`;
  const privacyLink = `<a href="${route('privacy', ctx.lang)}" target="_blank" rel="noopener">${esc(q.privacyLink)}</a>`;
  return `<dialog class="modal quote-modal" id="quote-modal" aria-labelledby="quote-title" aria-describedby="quote-intro">
  <div class="modal__head">
    <div><h2 id="quote-title">${esc(q.title)}</h2><p id="quote-intro">${esc(q.intro)}</p></div>
    <button class="icon-btn" type="button" data-modal-close aria-label="${esc(q.close)}">${icon('close')}</button>
  </div>
  <div class="modal__body">
    <form class="form-grid" id="quote-form" novalidate data-quote-form>
      <div class="form-status field--full" id="quote-status" role="status" aria-live="polite" tabindex="-1"></div>
      <div class="attached-product field--full" data-attached hidden>${icon('bread')}<span><strong>${esc(q.attached)}:</strong> <span data-attached-name></span></span></div>
      ${field('name', q.name, `<input class="input" id="q-name" name="name" type="text" autocomplete="name" required maxlength="120" ${desc('name')}>`, { required: true })}
      ${field('email', q.email, `<input class="input" id="q-email" name="email" type="email" autocomplete="email" required maxlength="160" ${desc('email')}>`, { required: true })}
      ${field('phone', q.phone, `<input class="input" id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="24" ${desc('phone', true)}>`, { required: true, hint: q.phoneHint })}
      ${field('company', q.company, `<input class="input" id="q-company" name="company" type="text" autocomplete="organization" maxlength="160" ${desc('company')}>`)}
      ${field('service', q.service, `<select class="input" id="q-service" name="service_type" required ${desc('service')}><option value="">${esc(q.servicePlaceholder)}</option>${services.map((s) => `<option value="${s}">${esc(q.services[s])}</option>`).join('')}</select>`, { required: true, full: true })}
      ${field('date', q.eventDate, `<input class="input" id="q-date" name="event_date" type="date" ${desc('date')}>`, { cond: 'corporate celebration' })}
      ${field('guests', q.guests, `<input class="input" id="q-guests" name="guest_count" type="number" min="1" max="100000" inputmode="numeric" ${desc('guests')}>`, { cond: 'corporate celebration' })}
      ${field('product', q.product, `<input class="input" id="q-product" name="product_name" type="text" maxlength="200" ${desc('product')}>`, { cond: 'b2b' })}
      ${field('volume', q.volume, `<input class="input" id="q-volume" name="supply_volume" type="text" maxlength="200" ${desc('volume', true)}>`, { cond: 'b2b', hint: q.volumeHint })}
      ${field('message', q.message, `<textarea class="input" id="q-message" name="message" rows="4" maxlength="3000" ${desc('message', true)}></textarea>`, { full: true, hint: q.messageHint })}
      <div class="field field--full">
        <label class="checkbox"><input type="checkbox" name="privacy_ack" id="q-privacy" required aria-describedby="q-privacy-error"><span>${fmt(q.privacy, { link: privacyLink })} ${req}</span></label>
        <span class="field__error" id="q-privacy-error" aria-live="polite"></span>
      </div>
      <div class="field field--full">
        <label class="checkbox"><input type="checkbox" name="marketing_consent" id="q-marketing"><span>${esc(q.marketing)}</span></label>
      </div>
      <div class="visually-hidden" aria-hidden="true"><label for="q-website">Website</label><input id="q-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <input type="hidden" name="product_id"><input type="hidden" name="product_category"><input type="hidden" name="source_path"><input type="hidden" name="lang" value="${ctx.lang}">
      <div class="form-actions field--full">
        <button class="btn btn--primary" type="submit" data-submit><span data-submit-label>${esc(q.submit)}</span>${icon('arrow', { dir: true })}</button>
        <button class="btn btn--secondary" type="button" data-modal-close>${esc(q.close)}</button>
      </div>
    </form>
  </div>
</dialog>`;
}

/* ---------------- CookieConsent ---------------- */
export function cookieUI(ctx) {
  const c = ctx.ui.cookie;
  const row = (key, locked = false) => `<div class="consent-row">
      <div><h3 id="cc-${key}-label">${esc(c[key].title)}</h3><p id="cc-${key}-desc">${esc(c[key].desc)}</p></div>
      <span class="switch"><input type="checkbox" role="switch" name="${key}" aria-labelledby="cc-${key}-label" aria-describedby="cc-${key}-desc"${locked ? ' checked disabled' : ''}><span class="switch__track"></span></span>
    </div>`;
  return `<section class="cookie-banner" id="cookie-banner" aria-labelledby="cookie-title" hidden data-cookie-banner>
  <h2 id="cookie-title">${esc(c.title)}</h2>
  <p>${esc(c.body)} <a href="${route('privacy', ctx.lang)}#cookies">${esc(c.policyLink)}</a></p>
  <div class="btn-row">
    <button class="btn btn--primary btn--sm" type="button" data-consent="accept">${esc(c.acceptAll)}</button>
    <button class="btn btn--secondary btn--sm" type="button" data-consent="reject">${esc(c.reject)}</button>
    <button class="btn btn--secondary btn--sm" type="button" data-cookie-settings>${esc(c.customize)}</button>
  </div>
</section>
<dialog class="modal cookie-prefs" id="cookie-prefs" aria-labelledby="cookie-prefs-title">
  <div class="modal__head">
    <div><h2 id="cookie-prefs-title">${esc(c.prefsTitle)}</h2><p>${esc(c.body)}</p></div>
    <button class="icon-btn" type="button" data-modal-close aria-label="${esc(ctx.ui.quote.close)}">${icon('close')}</button>
  </div>
  <form class="modal__body" data-cookie-form>
    ${row('necessary', true)}
    ${row('analytics')}
    ${row('marketing')}
    <div class="btn-row" style="margin-block-start:20px">
      <button class="btn btn--primary" type="submit">${esc(c.save)}</button>
      <button class="btn btn--secondary" type="button" data-consent="accept">${esc(c.acceptAll)}</button>
      <button class="btn btn--secondary" type="button" data-consent="reject">${esc(c.reject)}</button>
    </div>
  </form>
</dialog>`;
}

export function mobileBar(ctx) {
  return `<div class="mobile-bar" data-mobile-bar role="region" aria-label="${esc(ctx.ui.mobileBar.label)}">
  ${quoteButton(ctx)}
  ${whatsappControl(ctx)}
</div>`;
}

/* ---------------- Head ---------------- */
function consentDefaults() {
  // Consent Mode v2 defaults MUST run before any Google tag. Only the consent
  // preference (no PII) is read from localStorage.
  return `<script>
document.documentElement.classList.replace('no-js','js');
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var c=JSON.parse(localStorage.getItem('plum_consent_v1')||'null');if(c&&c.v===1){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});}}catch(e){}
</script>`;
}

export function head(ctx, meta) {
  const base = ctx.config.productionBaseUrl;
  const L = ctx.config.languages;
  const other = otherLang(ctx.lang);
  const alt = meta.indexable && ctx.alternates;
  const hreflang = alt
    ? ['ar', 'en'].filter((l) => ctx.alternates[l]).map((l) => `<link rel="alternate" hreflang="${L[l].hreflang}" href="${base}${ctx.alternates[l]}">`).join('\n') +
      (ctx.alternates[ctx.config.xDefaultLanguage] && ctx.alternates.ar && ctx.alternates.en ? `\n<link rel="alternate" hreflang="x-default" href="${base}${ctx.alternates[ctx.config.xDefaultLanguage]}">` : '')
    : '';
  const gsc = ctx.config.integrations.searchConsoleVerification;
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="robots" content="${meta.indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow'}">
${meta.indexable ? `<link rel="canonical" href="${base}${ctx.path}">` : ''}
${hreflang}
<meta property="og:type" content="${meta.ogType || 'website'}">
<meta property="og:site_name" content="${esc(ctx.config.siteName[ctx.lang])}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${base}${ctx.path}">
<meta property="og:locale" content="${L[ctx.lang].locale}">
${ctx.alternates?.[other] ? `<meta property="og:locale:alternate" content="${L[other].locale}">` : ''}
${meta.ogImage ? `<meta property="og:image" content="${base}${meta.ogImage}">` : ''}
<meta name="twitter:card" content="${meta.ogImage ? 'summary_large_image' : 'summary'}">
<meta name="theme-color" content="#452349">
${gsc ? `<meta name="google-site-verification" content="${esc(gsc)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${ctx.lang === 'ar' ? 'family=Tajawal:wght@400;500;700&' : 'family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&'}display=swap">
<link rel="stylesheet" href="/assets/styles/site.css?v=${ctx.buildId}">
${meta.preload || ''}
${consentDefaults()}
${meta.jsonld ? `<script type="application/ld+json">${JSON.stringify(meta.jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>`;
}

export function pageData(ctx) {
  const c = ctx.config;
  const data = {
    lang: ctx.lang,
    siteName: c.siteName[ctx.lang],
    path: ctx.path,
    pageKey: ctx.pageKey,
    quoteEndpoint: c.integrations.quoteEndpoint,
    whatsappNumber: c.contact.whatsappNumber,
    gtmContainerId: c.integrations.gtmContainerId,
    consentModeType: c.integrations.consentModeType || 'basic',
    adsConversion: c.integrations.googleAdsConversion,
    i18n: { quote: ctx.ui.quote, cookie: ctx.ui.cookie, gallery: ctx.ui.gallery, filters: ctx.ui.filters, nav: ctx.ui.nav, video: ctx.ui.video },
  };
  return `<script type="application/json" id="plum-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function document(ctx, meta, mainHtml, { beforeMain = '', afterMain = '' } = {}) {
  const L = ctx.config.languages[ctx.lang];
  return `<!doctype html>
<html lang="${ctx.lang}" dir="${L.dir}" class="no-js">
${head(ctx, meta)}
<body class="page-${ctx.pageKey} has-mobile-bar">
<a class="skip-link" href="#main">${esc(ctx.ui.skip)}</a>
${header(ctx)}
${beforeMain}
<main id="main" tabindex="-1">
${mainHtml}
</main>
${afterMain}
${footer(ctx)}
${mobileBar(ctx)}
${drawer(ctx)}
${quoteModal(ctx)}
${cookieUI(ctx)}
${pageData(ctx)}
<script type="module" src="/assets/scripts/main.js?v=${ctx.buildId}"></script>
</body>
</html>
`;
}
