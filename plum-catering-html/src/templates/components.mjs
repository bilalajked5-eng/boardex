// Reusable page components — v2 (demo IA) + retained v1 pieces.
import { esc, fmt, icon, join, when, rf, pending, fact, figure, img, imgSrc, placeholderTag, reviewMode, mediaEntry } from './helpers.mjs';
import { route, productRoute, familyRoute, serviceRoute, familyAnchor } from './routes.mjs';
import { quoteButton, whatsappControl } from './layout.mjs';

/* ---------------- Breadcrumbs ---------------- */
export function breadcrumbs(ctx, items) {
  const all = [{ label: ctx.ui.breadcrumb.home, href: route('home', ctx.lang) }, ...items];
  return `<nav class="breadcrumbs" aria-label="${esc(ctx.ui.breadcrumb.label)}"><ol>${join(all, (it, i) =>
    i === all.length - 1 || !it.href ? `<li><span aria-current="page">${esc(it.label)}</span></li>` : `<li><a href="${esc(it.href)}">${esc(it.label)}</a></li>`
  )}</ol></nav>`;
}
export const crumbList = (ctx, items) => [{ label: ctx.ui.breadcrumb.home, href: route('home', ctx.lang) }, ...items];

/* ---------------- Underlined link ---------------- */
export const ulink = (href, label, extra = '') => `<a class="ulink" href="${esc(href)}"${extra}>${esc(label)}${icon('arrow')}</a>`;

/* ---------------- Split (editorial) hero ---------------- */
export function splitHero(ctx, { num, eyebrow, h1, accent, lead, ctas = '', meta = [], mediaId, panelLabel, panelBig, panelText, panelNote, crumbs = '', video = null }) {
  let h1Html = esc(h1);
  if (accent && h1.includes(accent)) h1Html = esc(h1.slice(0, h1.indexOf(accent))) + `<em>${esc(accent)}</em>` + esc(h1.slice(h1.indexOf(accent) + accent.length));
  const m = mediaEntry(ctx, mediaId);
  const videoHtml = video ? `<video muted loop playsinline preload="none" poster="${esc(imgSrc(m))}" data-hero-video aria-hidden="true">${video.sources.map((s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`).join('')}</video>` : '';
  return `${crumbs ? `<div class="container">${crumbs}</div>` : ''}
<section class="hero-split" aria-labelledby="page-title">
  <div class="container hero-split__grid">
    <div>
      ${num ? `<span class="hero-split__num">${esc(num)}</span>` : ''}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1 id="page-title">${h1Html}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${ctas ? `<div class="btn-row">${ctas}</div>` : ''}
      ${meta.length ? `<ul class="hero-split__meta" role="list">${join(meta, (x) => `<li>${esc(x)}</li>`)}</ul>` : ''}
    </div>
    <div class="visual-panel reveal">
      ${img(ctx, mediaId, { eager: true, alt: '', sizes: '(min-width:768px) 45vw, 100vw' })}${videoHtml}
      <div class="visual-panel__overlay">
        <div class="visual-panel__top"><span>${esc(ctx.config.siteName[ctx.lang])}</span><span>${esc(ctx.pages.serviceHub.panelCountry)}</span></div>
        ${panelBig ? `<span class="visual-panel__big">${esc(panelBig)}</span>` : panelText ? `<span class="visual-panel__text">${esc(panelText)}</span>` : ''}
        <span class="visual-panel__caption">${esc(panelLabel || '')}${panelNote ? ` · ${esc(panelNote)}` : ''}</span>
      </div>
      ${placeholderTag(ctx, mediaId)}
      ${video ? `<button class="video-toggle" type="button" data-video-toggle aria-pressed="false">${icon('pause')}<span>${esc(ctx.ui.video.pause)}</span></button>` : ''}
    </div>
  </div>
</section>`;
}

/* Retained: full-bleed hero (used by the FM live template) */
export function hero(ctx, { mediaId, eyebrow, h1, lead, ctas = '', extra = '', sub = false, crumbs = null }) {
  return `<section class="hero${sub ? ' hero--sub' : ''}" aria-labelledby="page-title">
  <div class="hero__media">${img(ctx, mediaId, { eager: true, alt: '' })}</div>
  <div class="hero__overlay" aria-hidden="true"></div>
  ${when(crumbs, () => `<div class="hero__breadcrumbs"><div class="container">${crumbs}</div></div>`)}
  <div class="container hero__inner"><div class="hero__content">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1 id="page-title">${esc(h1)}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${ctas ? `<div class="btn-row">${ctas}</div>` : ''}${extra}
  </div></div>
  ${placeholderTag(ctx, mediaId)}
</section>`;
}

/* ---------------- Section head ---------------- */
export function sectionHead(ctx, { eyebrow, h2, intro, id, center = false, aside = '', sub = '' }) {
  const inner = `${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2${id ? ` id="${id}"` : ''}>${esc(h2)}</h2>${sub ? `<p class="h2-sub">${esc(sub)}</p>` : ''}${intro ? `<p class="lead">${intro}</p>` : ''}`;
  if (aside) return `<div class="section-head section-head--split"><div>${inner}</div>${aside}</div>`;
  return `<div class="section-head${center ? ' section-head--center' : ''}">${inner}</div>`;
}

/* ---------------- Stats strip ---------------- */
export function statsStrip(ctx, items) {
  const list = items.filter(Boolean);
  if (!list.length) return '';
  return `<ul class="stats" role="list" aria-label="${esc(ctx.ui.stats.label)}">${join(list, (s) => `<li><span class="stats__value"${s.ltr ? ' dir="ltr"' : ''}>${esc(s.value)}${s.flag || ''}</span><span class="stats__label">${esc(s.label)}</span></li>`)}</ul>`;
}
export function homeStats(ctx) {
  const s = ctx.pages.home.stats;
  const area = fact(ctx, 'kitchenArea');
  const certs = fact(ctx, 'certifications');
  return statsStrip(ctx, [
    area && { value: area.value, label: s.kitchenLabel, flag: area.flag },
    certs && { value: certs.value[0], label: s.certLabel, flag: certs.flag, ltr: true },
    certs && certs.value[1] && { value: certs.value[1], label: s.certLabel, flag: certs.flag, ltr: true },
    { value: String(ctx.products.length), label: s.productsLabel },
  ]);
}

/* ---------------- Numbered outlined cards ---------------- */
export function ncard(ctx, { num, label, h3, body, href, cta, cls = '', ctaEl }) {
  return `<article class="ncard ${cls} reveal">
    ${num ? `<span class="ncard__num">${esc(num)}</span>` : ''}
    ${label ? `<span class="ncard__label">${esc(label)}</span>` : ''}
    <h3>${href ? `<a href="${esc(href)}">${esc(h3)}</a>` : esc(h3)}</h3>
    ${body ? `<p>${esc(body)}</p>` : ''}
    ${ctaEl || (href && cta ? `<span class="ulink" aria-hidden="true">${esc(cta)}${icon('arrow')}</span>` : '')}
  </article>`;
}
export const ncardGrid = (cards, cls = 'hub-grid') => `<div class="${cls}">${cards.join('')}</div>`;

export function serviceCards(ctx, hubKey, { exclude = null, limit = null } = {}) {
  const items = ctx.pages[hubKey].services.items;
  const total = items.length;
  let list = items.map((s, i) => ({ s, i })).filter(({ s }) => s.slug !== exclude);
  if (limit) list = list.slice(0, limit);
  return list.map(({ s, i }) => ncard(ctx, { num: `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, h3: s.title || s.h3, body: s.short || s.body, href: serviceRoute(hubKey, s.slug, ctx.lang), cta: ctx.ui.cta.exploreService }));
}

export function familyCards(ctx, { exclude = null } = {}) {
  const b = ctx.pages.b2b.families;
  return ctx.categories.filter((c) => c.id !== exclude).map((c) => {
    const n = ctx.products.filter((p) => p.category === c.id).length;
    return ncard(ctx, { label: fmt(b.options, { n }), h3: c.name[ctx.lang], body: ctx.pages.familyBlurbs[c.id], href: familyRoute(c.slug, ctx.lang), cta: ctx.ui.cta.browseRange });
  });
}
export function familyTiles(ctx) {
  return `<ul class="tiles" role="list">${join(ctx.categories, (c) => `<li><a href="${familyRoute(c.slug, ctx.lang)}"><span class="tiles__n">${String(ctx.products.filter((p) => p.category === c.id).length).padStart(2, '0')}</span><span class="tiles__l">${esc(c.name[ctx.lang])}</span></a></li>`)}</ul>`;
}

/* ---------------- Lists ---------------- */
export const listPanel = (label, items, { white = false } = {}) => `<div class="list-panel${white ? ' list-panel--white' : ''}"><span class="list-panel__label">${esc(label)}</span><ol>${join(items, (x) => `<li>${esc(x)}</li>`)}</ol></div>`;
export const checkList = (items) => `<ul class="check-list" role="list">${join(items, (x) => `<li>${esc(x)}</li>`)}</ul>`;
export const audienceGrid = (items) => `<ul class="audience-grid" role="list">${join(items, (x, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(x)}</li>`)}</ul>`;
export const chipCloud = (items) => `<ul class="chip-cloud" role="list">${join(items, (x) => `<li>${esc(x)}</li>`)}</ul>`;

/* ---------------- Steps / feature cards ---------------- */
export const featureCards = (ctx, cards, cols = 4) =>
  `<div class="grid grid--${cols}">${join(cards, (c) => `<article class="feature-card reveal">${c.icon ? `<span class="feature-card__icon">${icon(c.icon)}</span>` : ''}<h3>${esc(c.h3)}</h3><p>${esc(c.body)}</p></article>`)}</div>`;
export const steps = (ctx, list) =>
  `<ol class="steps">${join(list, (s) => `<li class="step reveal"><h3>${esc(s.h3 || s)}</h3>${s.body ? `<p>${esc(s.body)}</p>` : ''}</li>`)}</ol>`;

/* ---------------- Kitchen facts / film ---------------- */
export function kitchenFacts(ctx, labels) {
  const area = fact(ctx, 'kitchenArea');
  const certs = fact(ctx, 'certifications');
  const items = [
    area && { label: labels.areaLabel, value: `${esc(area.value)}${area.flag}` },
    certs && { label: labels.certLabel, value: `<span dir="ltr">${esc(certs.value.join(' · '))}</span>${certs.flag}` },
  ].filter(Boolean);
  if (!items.length) return '';
  return `<dl class="facts" aria-label="${esc(labels.factsLabel || '')}">${join(items, (f) => `<div class="fact"><dt class="fact__label">${esc(f.label)}</dt><dd class="fact__value" style="margin:0">${f.value}</dd></div>`)}</dl>`;
}
export function kitchenFilm(ctx, caption) {
  const film = ctx.config.media.kitchenFilm;
  const posterId = ctx.config.media.kitchenPoster;
  if (film) {
    const m = mediaEntry(ctx, posterId);
    return `<figure class="media media--film"><video controls preload="none" playsinline poster="${esc(imgSrc(m))}" width="${m.width}" height="${m.height}">${film.sources.map((s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`).join('')}${film.captions?.[ctx.lang] ? `<track kind="captions" src="${esc(film.captions[ctx.lang])}" srclang="${ctx.lang}" label="${esc(ctx.config.languages[ctx.lang].label)}" default>` : ''}</video>${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
  }
  return figure(ctx, posterId, { cls: 'media--film', caption: reviewMode(ctx) ? esc(ctx.ui.video.filmPending) : '' });
}

/* ---------------- FAQ ---------------- */
export function faq(ctx, { h2, items, idPrefix, eyebrow }) {
  return `<div class="faq-layout">
  ${sectionHead(ctx, { h2, eyebrow, id: `${idPrefix}-faq-title` })}
  <div class="faq" data-faq>${join(items, (it, i) => {
    const id = `${idPrefix}-faq-${i + 1}`;
    return `<div class="faq-item">
      <h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="${id}" id="${id}-q"><span>${esc(it.q)}${it.review ? rf(ctx) : ''}</span><span class="faq-icon" aria-hidden="true"></span></button></h3>
      <div class="faq-a" id="${id}" role="region" aria-labelledby="${id}-q"><p>${esc(it.a)}</p></div>
    </div>`;
  })}</div>
</div>`;
}

/* ---------------- Gallery ---------------- */
export function gallery(ctx, { page, limit = 12 }) {
  const all = ctx.media.gallery.filter((g) => !page || g.pages.includes(page));
  const items = all.slice(0, limit);
  const cats = ctx.media.galleryCategories.filter((c) => items.some((i) => i.category === c.id));
  const real = ctx.media.gallery.filter((g) => !g.demo && g.src).length;
  const labels = ctx.ui.gallery.collections;
  return `<div class="gallery" data-gallery>
  ${cats.length > 1 ? `<div class="gallery-filters" role="group" aria-label="${esc(ctx.ui.gallery.filterLabel)}" data-gallery-filters hidden>
    <button class="chip" type="button" data-filter="all" aria-pressed="true">${esc(labels.all)}</button>
    ${join(cats, (c) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="false">${esc(labels[c.id] || c.label[ctx.lang])}</button>`)}
  </div>` : ''}
  <ul class="gallery-grid" role="list">${join(items, (g, i) => {
    const src = g.src || `/assets/images/placeholders/${g.id}.svg`;
    return `<li class="gallery-item" data-category="${g.category}"><a href="${esc(src)}" data-lightbox data-caption="${String(i + 1).padStart(2, '0')} · ${esc(g.label[ctx.lang])}" aria-label="${esc(ctx.ui.gallery.open)}: ${esc(g.label[ctx.lang])}">${g.src ? '' : reviewMode(ctx) ? `<span class="placeholder-tag">${esc(ctx.ui.review.demo)}</span>` : ''}<img src="${esc(src)}" width="${g.width}" height="${g.height}" alt="${esc(g.alt[ctx.lang])}" loading="lazy" decoding="async"></a></li>`;
  })}</ul>
  ${reviewMode(ctx) ? `<p class="gallery-status small muted">${fmt(ctx.ui.gallery.status, { n: real, target: ctx.media.galleryTarget })}</p>` : ''}
</div>`;
}
export function lightbox(ctx) {
  return `<dialog class="lightbox" id="lightbox" aria-label="${esc(ctx.ui.gallery.open)}">
  <div class="lightbox__inner">
    <figure><img src="data:," alt="" data-lightbox-img><figcaption data-lightbox-caption aria-live="polite"></figcaption></figure>
    <button class="lightbox__btn lightbox__close" type="button" data-lightbox-close aria-label="${esc(ctx.ui.gallery.close)}">${icon('close')}</button>
    <button class="lightbox__btn lightbox__prev" type="button" data-lightbox-prev aria-label="${esc(ctx.ui.gallery.prev)}">${icon('chevron', { cls: 'icon-flip' })}</button>
    <button class="lightbox__btn lightbox__next" type="button" data-lightbox-next aria-label="${esc(ctx.ui.gallery.next)}">${icon('chevron')}</button>
  </div>
</dialog>`;
}

/* ---------------- LogoWall ---------------- */
export function logoWall(ctx) {
  const logos = ctx.clientLogos.filter((l) => l.approved && l.src);
  if (logos.length) return `<ul class="logo-wall" role="list">${join(logos, (l) => `<li class="logo-slot"><img src="${esc(l.src)}" width="${l.width}" height="${l.height}" alt="${esc(l.name[ctx.lang])}" loading="lazy"></li>`)}</ul>`;
  if (!reviewMode(ctx)) return '';
  return `<div><ul class="logo-wall" role="list" aria-hidden="true">${Array.from({ length: 8 }, (_, i) => `<li class="logo-slot logo-slot--pending">${esc(ctx.ui.logos.slot)} ${String(i + 1).padStart(2, '0')}</li>`).join('')}</ul>
  <p class="logo-wall__note">${pending(ctx, ctx.ui.logos.pending)}</p></div>`;
}

/* ---------------- CTA band ---------------- */
export function ctaBand(ctx, { eyebrow, h2, body, service, detail, label, extra = '', id = 'request-quote', product }) {
  return `<section class="section cta-band" aria-labelledby="${id}-title" id="${id}">
  <div class="container cta-band__inner">
    <div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2 id="${id}-title">${esc(h2)}</h2><p>${esc(body)}</p>${extra}</div>
    <div class="btn-row">${quoteButton(ctx, { label: label || ctx.ui.cta.requestQuotation, service, detail, product, cls: 'btn btn--light' })}<a class="ulink" href="${route('contact', ctx.lang)}">${esc(ctx.ui.cta.contactDetails)}${icon('arrow')}</a></div>
  </div>
</section>`;
}

/* ---------------- Product cards & finder ---------------- */
export function productSpecLine(ctx, p) {
  const v = p.variants?.[0];
  if (!v) return '';
  const parts = [];
  if (v.weight) parts.push(`${v.weight.value.toLocaleString('en-US')} ${ctx.lang === 'ar' ? (v.weight.unit === 'g' ? 'غ' : v.weight.unit) : v.weight.unit}`);
  if (p.variants.length > 1) parts.push(`+${p.variants.length - 1}`);
  return parts.join(' · ');
}
export function productCard(ctx, p, { headingLevel = 3, index = null } = {}) {
  const cat = ctx.categoriesById[p.category];
  const href = productRoute(p, ctx.lang);
  const spec = productSpecLine(ctx, p);
  const draft = p.status !== 'approved' && reviewMode(ctx) ? `<span class="status-pill">${esc(p.status === 'draft' ? ctx.ui.catalogue.draft : ctx.ui.review.flag)}</span>` : '';
  return `<article class="product-card" data-product-card>
    ${draft}
    ${figure(ctx, p.heroImage || 'product-placeholder', { sizes: '(min-width:1360px) 22vw, (min-width:1100px) 30vw, (min-width:768px) 45vw, 100vw' })}
    <div class="product-card__body">
      <span class="product-card__cat">${index != null ? `${String(index).padStart(2, '0')} · ` : ''}${esc(cat.name[ctx.lang])}</span>
      <h${headingLevel}>${esc(p.name[ctx.lang])}</h${headingLevel}>
      ${spec ? `<p class="product-card__spec"${ctx.lang === 'ar' ? '' : ' dir="ltr"'}>${esc(spec)}</p>` : ''}
      <a class="link-arrow" href="${href}"><span>${esc(ctx.ui.cta.viewProduct)}<span class="visually-hidden">: ${esc(p.name[ctx.lang])}</span></span>${icon('arrow', { dir: true })}</a>
    </div>
  </article>`;
}
export function finder(ctx) {
  const f = ctx.pages.b2b.finder;
  const L = ctx.lang;
  const total = ctx.products.length;
  return `<div class="finder" data-finder>
    <div>
      <label class="field__label" for="product-search">${esc(f.label)}</label>
      <div class="search-field" style="margin-block-start:8px">${icon('search')}<input class="input" id="product-search" type="search" placeholder="${esc(f.placeholder)}" autocomplete="off" data-product-search></div>
      <p class="finder__status" role="status" aria-live="polite" data-finder-status style="margin-block-start:10px">${fmt(f.all, { total })}</p>
      <button class="ulink" type="button" data-finder-all hidden style="margin-block-start:8px">${esc(ctx.ui.cta.showAll)}${icon('arrow')}</button>
    </div>
    <ul class="finder__results" role="list" data-finder-results>${join(ctx.products, (p, i) => {
      const cat = ctx.categoriesById[p.category];
      return `<li${i >= 8 ? ' class="is-extra"' : ''} data-product data-name="${esc(`${p.name.ar} ${p.name.en} ${cat.name.ar} ${cat.name.en}`.toLowerCase())}"><span class="finder__fam">${esc(cat.name[L])}</span><a href="${productRoute(p, L)}">${esc(p.name[L])}</a>${quoteButton(ctx, { label: ctx.ui.cta.askProduct, service: 'b2b', detail: cat.slug, product: { id: p.id, name: p.name[L], category: cat.name[L] }, ulink: true })}</li>`;
    })}</ul>
  </div>`;
}
