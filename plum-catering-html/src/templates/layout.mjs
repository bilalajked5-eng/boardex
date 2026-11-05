// Global layout v2 (demo IA): utility bar, dropdown header, drawer with groups,
// footer, stepped QuoteModal, CookieConsent, floating actions.
import { esc, fmt, attrs, icon, join, when, rf, fact, reviewMode } from './helpers.mjs';
import { route, serviceRoute, familyRoute, otherLang } from './routes.mjs';

/* ---------------- WhatsApp ---------------- */
export function whatsappHref(ctx, message) {
  const n = ctx.config.contact.whatsappNumber;
  if (!n) return null;
  return `https://wa.me/${String(n).replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
}
export function whatsappControl(ctx, { variant = 'icon', message, cls } = {}) {
  const msg = message || `${ctx.ui.cta.whatsapp} — ${ctx.config.siteName[ctx.lang]} (${ctx.pageTitleShort || ''})`;
  const href = whatsappHref(ctx, msg);
  if (href) {
    const a = { href, target: '_blank', rel: 'noopener', 'data-track': 'whatsapp_click' };
    if (variant === 'icon') return `<a class="icon-btn"${attrs(a)} aria-label="${esc(ctx.ui.cta.whatsapp)}">${icon('whatsapp')}</a>`;
    if (variant === 'ulink') return `<a class="ulink"${attrs(a)}>${esc(ctx.ui.cta.openWhatsapp)}${icon('arrow')}</a>`;
    return `<a class="${cls || 'btn btn--secondary'}"${attrs(a)}>${icon('whatsapp')}<span>${esc(ctx.ui.cta.whatsapp)}</span></a>`;
  }
  if (!reviewMode(ctx)) return '';
  if (variant === 'icon') return `<span class="icon-btn is-pending" role="img" aria-label="${esc(ctx.ui.whatsappPending)}" title="${esc(ctx.ui.whatsappPending)}">${icon('whatsapp')}</span>`;
  return `<span class="review-flag" title="${esc(ctx.ui.whatsappPending)}">${icon('whatsapp')}<span>${esc(ctx.ui.whatsappPending)}</span></span>`;
}

/* ---------------- Quote trigger ---------------- */
export function quoteButton(ctx, { label, service, detail, product, cls = 'btn btn--primary', iconName = 'arrow', ulink = false } = {}) {
  const a = {
    href: `${route('contact', ctx.lang)}#enquiry`, class: ulink ? 'ulink' : cls, 'data-quote-open': '',
    'data-service': service || ctx.defaultService || null, 'data-detail': detail || ctx.defaultDetail || null,
    'data-product-id': product?.id || null, 'data-product-name': product?.name || null, 'data-product-category': product?.category || null, 'aria-haspopup': 'dialog',
  };
  return `<a${attrs(a)}><span>${esc(label || ctx.ui.cta.quote)}</span>${iconName ? icon(iconName, { dir: !ulink }) : ''}</a>`;
}

/* ---------------- Nav model ---------------- */
export function navModel(ctx) {
  const L = ctx.lang;
  return [
    { key: 'corporates', label: ctx.ui.nav.corporates, head: ctx.ui.nav.groups.corporates, href: route('corporates', L), items: ctx.pages.corporates.services.items.map((s) => ({ label: s.title || s.h3, href: serviceRoute('corporates', s.slug, L) })) },
    { key: 'celebrations', label: ctx.ui.nav.celebrations, head: ctx.ui.nav.groups.celebrations, href: route('celebrations', L), items: ctx.pages.celebrations.services.items.map((s) => ({ label: s.title || s.h3, href: serviceRoute('celebrations', s.slug, L) })) },
    { key: 'b2b', label: ctx.ui.nav.b2b, head: ctx.ui.nav.groups.b2b, href: route('b2b', L), items: ctx.categories.map((c) => ({ label: c.name[L], href: familyRoute(c.slug, L) })) },
    { key: 'about', label: ctx.ui.nav.about, href: route('about', L) },
    { key: 'gallery', label: ctx.ui.nav.gallery, href: route('gallery', L) },
    { key: 'facility', label: ctx.ui.nav.facility, href: route('facility', L), badge: ctx.config.facilityManagement.launchMode !== 'live' ? ctx.ui.nav.comingSoon : null },
    { key: 'contact', label: ctx.ui.nav.contact, href: route('contact', L) },
  ];
}
const isCurrent = (ctx, href) => ctx.path === href;

function langSwitch(ctx, extraCls = '') {
  const other = otherLang(ctx.lang);
  const href = ctx.alternates?.[other] || route('home', other);
  return `<a class="lang-switch ${extraCls}" href="${esc(href)}" hreflang="${other}" lang="${other}" data-lang-switch aria-label="${esc(ctx.ui.lang.switchLabel)}">${icon('globe')}<span lang="${other}">${esc(ctx.ui.lang.switchTo)}</span></a>`;
}

export function header(ctx) {
  const logo = ctx.config.brand.logo;
  const c = ctx.config.contact;
  const nav = navModel(ctx);
  const items = join(nav, (n, i) => {
    const current = ctx.pageKey === n.key || ctx.navParent === n.key;
    if (!n.items) return `<li><a class="nav-link" href="${n.href}"${isCurrent(ctx, n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}${n.badge ? ` <span class="nav-badge">${esc(n.badge)}</span>` : ''}</a></li>`;
    const id = `mega-${n.key}`;
    return `<li class="nav-item" data-nav-item data-current="${current}">
      <button class="nav-item__btn" type="button" aria-expanded="false" aria-controls="${id}" data-nav-toggle>${esc(n.label)}${icon('chevron', { cls: 'nav-chevron' })}</button>
      <div class="mega" id="${id}" hidden>
        <div class="mega__head">${esc(n.head)}</div>
        <a class="mega__overview" href="${n.href}"${isCurrent(ctx, n.href) ? ' aria-current="page"' : ''}>${esc(ctx.ui.nav.overview)}${icon('arrow', { dir: true })}</a>
        ${join(n.items, (it) => `<a href="${it.href}"${isCurrent(ctx, it.href) ? ' aria-current="page"' : ''}>${esc(it.label)}${icon('arrow', { dir: true })}</a>`)}
      </div>
    </li>`;
  });
  return `<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="site-logo" href="${route('home', ctx.lang)}" aria-label="${esc(ctx.config.siteName[ctx.lang])} — ${esc(ctx.ui.nav.home)}"><img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="${esc(ctx.config.siteName[ctx.lang])}" fetchpriority="high"></a>
    <nav class="primary-nav" aria-label="${esc(ctx.ui.nav.label)}"><ul class="nav-list">${items}</ul></nav>
    <div class="header-actions">
      ${langSwitch(ctx)}
      ${quoteButton(ctx, { label: ctx.ui.cta.quoteShort, cls: 'btn btn--primary btn--sm btn--quote-desktop', iconName: null })}
      <button class="icon-btn menu-toggle" type="button" data-drawer-open aria-controls="site-drawer" aria-expanded="false" aria-label="${esc(ctx.ui.nav.menu)}">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

export function drawer(ctx) {
  const logo = ctx.config.brand.logo;
  const L = ctx.lang;
  const nav = navModel(ctx);
  const link = (href, label, cls = '') => `<a class="${cls}" href="${href}"${isCurrent(ctx, href) ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  const groups = join(nav, (n) => {
    if (!n.items) return '';
    return `<details${ctx.pageKey === n.key || ctx.navParent === n.key ? ' open' : ''}><summary>${esc(n.label)}${icon('chevron')}</summary>${link(n.href, ctx.ui.nav.overview, 'is-overview')}${join(n.items, (it) => link(it.href, it.label))}</details>`;
  });
  const fmSoon = ctx.config.facilityManagement.launchMode !== 'live';
  return `<dialog class="drawer" id="site-drawer" aria-label="${esc(ctx.ui.nav.label)}">
  <div class="drawer__panel">
    <div class="drawer__head">
      <img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="${esc(ctx.config.siteName[L])}" loading="lazy">
      <button class="icon-btn" type="button" data-drawer-close aria-label="${esc(ctx.ui.nav.close)}">${icon('close')}</button>
    </div>
    <nav aria-label="${esc(ctx.ui.nav.label)}"><ul class="nav-list">
      <li><a class="nav-link" href="${route('home', L)}"${isCurrent(ctx, route('home', L)) ? ' aria-current="page"' : ''}>${esc(ctx.ui.nav.home)}</a></li>
      <li><a class="nav-link" href="${route('about', L)}"${isCurrent(ctx, route('about', L)) ? ' aria-current="page"' : ''}>${esc(ctx.ui.nav.about)}</a></li>
      <li>${groups}</li>
      <li><a class="nav-link" href="${route('gallery', L)}">${esc(ctx.ui.nav.gallery)}</a></li>
      <li><a class="nav-link" href="${route('facility', L)}">${esc(ctx.ui.nav.facility)}${fmSoon ? ` <span class="nav-badge">${esc(ctx.ui.nav.comingSoon)}</span>` : ''}</a></li>
      <li><a class="nav-link" href="${route('contact', L)}">${esc(ctx.ui.nav.contact)}</a></li>
      <li><a class="nav-link" href="${route('privacy', L)}">${esc(ctx.ui.nav.privacy)}</a></li>
    </ul></nav>
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
  const L = ctx.lang;
  const logo = ctx.config.brand.logo;
  const c = ctx.config.contact;
  const parent = fact(ctx, 'parent');
  const brandLine = parent ? `${fmt(u.brandLine, { parent: esc(parent.value) })}${parent.flag}` : esc(u.brandLineNoParent);
  const fmLive = ctx.config.facilityManagement.launchMode === 'live';
  const wa = whatsappHref(ctx, `${ctx.ui.cta.whatsapp} — ${ctx.config.siteName[L]}`);
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${route('home', L)}" aria-label="${esc(ctx.config.siteName[L])} — ${esc(ctx.ui.nav.home)}"><img src="${logo.src}" width="${logo.width}" height="${logo.height}" alt="${esc(ctx.config.siteName[L])}" loading="lazy"></a>
        <p>${esc(u.summary)}</p>
        <p class="small muted">${brandLine}</p>
      </div>
      <div class="footer-col">
        <h2>${esc(u.explore)}</h2>
        <ul>
          <li><a href="${route('corporates', L)}">${esc(ctx.ui.nav.corporates)}</a></li>
          <li><a href="${route('celebrations', L)}">${esc(ctx.ui.nav.celebrations)}</a></li>
          <li><a href="${route('b2b', L)}">${esc(ctx.ui.nav.b2b)}</a></li>
          <li><a href="${route('facility', L)}">${esc(ctx.ui.nav.facility)}${fmLive ? '' : ` <span class="nav-badge">${esc(ctx.ui.nav.comingSoon)}</span>`}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>${esc(u.discover)}</h2>
        <ul>
          <li><a href="${route('about', L)}">${esc(ctx.ui.nav.about)}</a></li>
          <li><a href="${route('about', L)}#kitchen">${esc(u.kitchen)}</a></li>
          <li><a href="${route('gallery', L)}">${esc(ctx.ui.nav.gallery)}</a></li>
          <li><a href="${route('contact', L)}">${esc(ctx.ui.nav.contact)}</a></li>
        </ul>
      </div>
      <div class="footer-col" id="site-contact">
        <h2>${esc(u.contact)}</h2>
        <ul>
          ${c.phone ? `<li><a href="tel:${esc(c.phone.replace(/\s/g, ''))}" dir="ltr">${esc(c.phone)}</a></li>` : ''}
          ${c.email ? `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : ''}
          ${wa ? `<li><a href="${esc(wa)}" target="_blank" rel="noopener" data-track="whatsapp_click">${esc(ctx.ui.cta.whatsapp)}</a></li>` : reviewMode(ctx) ? `<li>${whatsappControl(ctx, { variant: 'button' })}</li>` : ''}
          ${c.address?.[L] ? `<li>${esc(c.address[L])}</li>` : ''}
          <li>${quoteButton(ctx, { label: ctx.ui.cta.requestQuotation, ulink: true })}</li>
          <li><button class="footer-link-btn" type="button" data-cookie-settings>${esc(u.cookieSettings)}</button></li>
        </ul>
        ${!c.phone && !c.email && reviewMode(ctx) ? `<p class="small muted">${esc(u.contactPending)}</p>` : ''}
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${ctx.config.copyrightYear} ${esc(ctx.config.siteName[L])}. ${esc(u.rights)}</span>
      <span><a href="${route('privacy', L)}">${esc(ctx.ui.nav.privacy)}</a> · <button class="footer-link-btn" type="button" data-cookie-settings>${esc(u.cookieSettings)}</button></span>
    </div>
  </div>
</footer>`;
}

/* ---------------- QuoteModal (3 steps) ---------------- */
export function quoteModal(ctx) {
  const q = ctx.ui.quote;
  const L = ctx.lang;
  const fmLive = ctx.config.facilityManagement.launchMode === 'live';
  const services = ['corporate', 'celebration', 'b2b', ...(fmLive ? ['facility'] : [])];
  const req = `<span class="req" aria-hidden="true">*</span><span class="visually-hidden"> (${esc(q.required)})</span>`;
  const opt = `<span class="opt">(${esc(q.optional)})</span>`;
  const field = (id, label, input, { full = false, hint = '', required = false } = {}) =>
    `<div class="field${full ? ' field--full' : ''}">
      <label class="field__label" for="q-${id}">${esc(label)} ${required ? req : opt}</label>
      ${input}
      ${hint ? `<span class="field__hint" id="q-${id}-hint">${esc(hint)}</span>` : ''}
      <span class="field__error" id="q-${id}-error" aria-live="polite"></span>
    </div>`;
  const desc = (id, hint) => `aria-describedby="${hint ? `q-${id}-hint ` : ''}q-${id}-error"`;
  const privacyLink = `<a href="${route('privacy', L)}" target="_blank" rel="noopener">${esc(q.privacyLink)}</a>`;
  const detailOptions = [
    `<optgroup label="${esc(ctx.ui.nav.groups.corporates)}">${ctx.pages.corporates.services.items.map((s) => `<option value="${s.slug}" data-type="corporate">${esc(s.title || s.h3)}</option>`).join('')}</optgroup>`,
    `<optgroup label="${esc(ctx.ui.nav.groups.celebrations)}">${ctx.pages.celebrations.services.items.map((s) => `<option value="${s.slug}" data-type="celebration">${esc(s.title || s.h3)}</option>`).join('')}</optgroup>`,
    `<optgroup label="${esc(ctx.ui.nav.groups.b2b)}">${ctx.categories.map((c) => `<option value="${c.slug}" data-type="b2b">${esc(c.name[L])}</option>`).join('')}</optgroup>`,
  ].join('');
  const formats = Object.entries(q.formats).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  return `<dialog class="modal quote-modal" id="quote-modal" aria-labelledby="quote-title" aria-describedby="quote-intro">
  <div class="modal__head">
    <div><p class="eyebrow" style="margin-block-end:6px">${esc(q.eyebrow)}</p><h2 id="quote-title">${esc(q.title)}</h2><p id="quote-intro">${esc(q.intro)}</p><span class="step-count" data-step-count aria-live="polite"></span></div>
    <button class="icon-btn" type="button" data-modal-close aria-label="${esc(q.close)}">${icon('close')}</button>
  </div>
  <div class="modal__body">
    <div class="stepper" aria-hidden="true" data-stepper><span class="is-on"></span><span></span><span></span></div>
    <form class="form-grid" id="quote-form" novalidate data-quote-form data-steps="${JSON.stringify(q.steps).replace(/"/g, '&quot;')}">
      <div class="form-status field--full" id="quote-status" role="status" aria-live="polite" tabindex="-1"></div>
      <div class="attached-product field--full" data-attached hidden>${icon('bread')}<span><strong>${esc(q.attached)}:</strong> <span data-attached-name></span></span></div>

      <fieldset class="form-step" data-step="1"><legend class="visually-hidden">${esc(q.steps[0])}</legend>
      ${field('service', q.category, `<select class="input" id="q-service" name="service_type" required ${desc('service')}><option value="">${esc(q.servicePlaceholder)}</option>${services.map((s) => `<option value="${s}">${esc(q.services[s])}</option>`).join('')}</select>`, { required: true })}
      ${field('detail', q.detail, `<select class="input" id="q-detail" name="service_detail" ${desc('detail')}><option value="">${esc(q.detailPlaceholder)}</option>${detailOptions}</select>`)}
      ${field('interest', q.interest, `<input class="input" id="q-interest" name="interest" type="text" maxlength="200" ${desc('interest', true)}>`, { full: true, hint: q.interestHint })}
      ${field('quantity', q.quantity, `<input class="input" id="q-quantity" name="quantity" type="text" maxlength="120" ${desc('quantity', true)}>`, { hint: q.quantityHint })}
      ${field('city', q.city, `<input class="input" id="q-city" name="city" type="text" maxlength="120" autocomplete="address-level2" ${desc('city')}>`)}
      </fieldset>

      <fieldset class="form-step" data-step="2" hidden><legend class="visually-hidden">${esc(q.steps[1])}</legend>
      ${field('date', q.preferredDate, `<input class="input" id="q-date" name="preferred_date" type="text" maxlength="80" ${desc('date', true)}>`, { hint: q.preferredDateHint })}
      ${field('format', q.format, `<select class="input" id="q-format" name="format" ${desc('format')}><option value="">${esc(q.formatNotDecided)}</option>${formats}</select>`)}
      ${field('message', q.message, `<textarea class="input" id="q-message" name="message" rows="4" maxlength="3000" ${desc('message', true)}></textarea>`, { full: true, hint: q.messageHint })}
      </fieldset>

      <fieldset class="form-step" data-step="3" hidden><legend class="visually-hidden">${esc(q.steps[2])}</legend>
      ${field('name', q.name, `<input class="input" id="q-name" name="name" type="text" autocomplete="name" required maxlength="120" ${desc('name')}>`, { required: true })}
      ${field('company', q.company, `<input class="input" id="q-company" name="company" type="text" autocomplete="organization" maxlength="160" ${desc('company')}>`)}
      ${field('phone', q.phone, `<input class="input" id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="24" ${desc('phone', true)}>`, { required: true, hint: q.phoneHint })}
      ${field('email', q.email, `<input class="input" id="q-email" name="email" type="email" autocomplete="email" required maxlength="160" ${desc('email')}>`, { required: true })}
      <div class="field field--full">
        <label class="checkbox"><input type="checkbox" name="privacy_ack" id="q-privacy" required aria-describedby="q-privacy-error"><span>${fmt(q.privacy, { link: privacyLink })} ${req}</span></label>
        <span class="field__error" id="q-privacy-error" aria-live="polite"></span>
      </div>
      <div class="field field--full"><label class="checkbox"><input type="checkbox" name="marketing_consent" id="q-marketing"><span>${esc(q.marketing)}</span></label></div>
      </fieldset>

      <div class="visually-hidden" aria-hidden="true"><label for="q-website">Website</label><input id="q-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <input type="hidden" name="product_id"><input type="hidden" name="product_category"><input type="hidden" name="product_name"><input type="hidden" name="source_path"><input type="hidden" name="lang" value="${L}">
      <div class="form-actions field--full">
        <button class="btn btn--secondary" type="button" data-step-back>${icon('arrow', { dir: true, cls: 'icon-back' })}<span>${esc(q.back)}</span></button>
        <div class="btn-row">
          <button class="btn btn--primary" type="button" data-step-next><span>${esc(q.next)}</span>${icon('arrow', { dir: true })}</button>
          <button class="btn btn--primary" type="submit" data-submit hidden><span data-submit-label>${esc(q.submit)}</span>${icon('arrow', { dir: true })}</button>
        </div>
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
    ${row('necessary', true)}${row('analytics')}${row('marketing')}
    <div class="btn-row" style="margin-block-start:20px">
      <button class="btn btn--primary" type="submit">${esc(c.save)}</button>
      <button class="btn btn--secondary" type="button" data-consent="accept">${esc(c.acceptAll)}</button>
      <button class="btn btn--secondary" type="button" data-consent="reject">${esc(c.reject)}</button>
    </div>
  </form>
</dialog>`;
}

export function floating(ctx) {
  return `<div class="floating" data-floating role="region" aria-label="${esc(ctx.ui.floating.label)}">
  ${quoteButton(ctx, { label: ctx.ui.cta.enquire })}
  ${whatsappControl(ctx)}
</div>`;
}

/* ---------------- Head ---------------- */
function consentDefaults() {
  return `<script>
document.documentElement.classList.replace('no-js','js');
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var c=JSON.parse((window.PLUM_REVIEW_BUNDLE?sessionStorage:localStorage).getItem('plum_consent_v1')||'null');if(c&&c.v===1){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});}}catch(e){}
</script>`;
}

export function head(ctx, meta) {
  const base = ctx.config.productionBaseUrl;
  const Ls = ctx.config.languages;
  const other = otherLang(ctx.lang);
  const alt = meta.indexable && ctx.alternates;
  const hreflang = alt
    ? ['ar', 'en'].filter((l) => ctx.alternates[l]).map((l) => `<link rel="alternate" hreflang="${Ls[l].hreflang}" href="${base}${ctx.alternates[l]}">`).join('\n') +
      (ctx.alternates.ar && ctx.alternates.en ? `\n<link rel="alternate" hreflang="x-default" href="${base}${ctx.alternates[ctx.config.xDefaultLanguage]}">` : '')
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
<meta property="og:locale" content="${Ls[ctx.lang].locale}">
${ctx.alternates?.[other] ? `<meta property="og:locale:alternate" content="${Ls[other].locale}">` : ''}
${meta.ogImage ? `<meta property="og:image" content="${base}${meta.ogImage}">` : ''}
<meta name="twitter:card" content="${meta.ogImage ? 'summary_large_image' : 'summary'}">
<meta name="theme-color" content="#452349">
${gsc ? `<meta name="google-site-verification" content="${esc(gsc)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${ctx.lang === 'ar' ? 'family=Tajawal:wght@400;500;700&family=Playfair+Display:wght@500;600&' : 'family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&'}display=swap">
<link rel="stylesheet" href="/assets/styles/site.css?v=${ctx.buildId}">
${meta.preload || ''}
${consentDefaults()}
${meta.jsonld ? `<script type="application/ld+json">${JSON.stringify(meta.jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>`;
}

export function pageData(ctx) {
  const c = ctx.config;
  const data = {
    lang: ctx.lang, siteName: c.siteName[ctx.lang], path: ctx.path, pageKey: ctx.pageKey,
    quoteEndpoint: c.integrations.quoteEndpoint, whatsappNumber: c.contact.whatsappNumber, gtmContainerId: c.integrations.gtmContainerId,
    consentModeType: c.integrations.consentModeType || 'basic', adsConversion: c.integrations.googleAdsConversion,
    i18n: { quote: ctx.ui.quote, cookie: ctx.ui.cookie, gallery: ctx.ui.gallery, filters: ctx.ui.filters, nav: ctx.ui.nav, video: ctx.ui.video, finder: ctx.pages.b2b.finder },
  };
  return `<script type="application/json" id="plum-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function document(ctx, meta, mainHtml, { beforeMain = '', afterMain = '' } = {}) {
  const Ls = ctx.config.languages[ctx.lang];
  return `<!doctype html>
<html lang="${ctx.lang}" dir="${Ls.dir}" class="no-js">
${head(ctx, meta)}
<body class="page-${ctx.pageKey}">
<a class="skip-link" href="#main">${esc(ctx.ui.skip)}</a>
${header(ctx)}
${beforeMain}
<main id="main" tabindex="-1">
${mainHtml}
</main>
${afterMain}
${footer(ctx)}
${floating(ctx)}
${drawer(ctx)}
${quoteModal(ctx)}
${cookieUI(ctx)}
${pageData(ctx)}
<script type="module" src="/assets/scripts/main.js?v=${ctx.buildId}"></script>
</body>
</html>
`;
}
