// Reusable page components (Blueprint §3 global component list).
import { esc, fmt, icon, join, when, rf, pending, fact, img, figure, imgSrc, placeholderTag, reviewMode, mediaEntry } from './helpers.mjs';
import { route, productRoute } from './routes.mjs';
import { quoteButton, whatsappControl } from './layout.mjs';

/* ---------------- Breadcrumbs ---------------- */
export function breadcrumbs(ctx, items) {
  // items: [{label, href}] — last item is current page (no href)
  const all = [{ label: ctx.ui.breadcrumb.home, href: route('home', ctx.lang) }, ...items];
  return `<nav class="breadcrumbs" aria-label="${esc(ctx.ui.breadcrumb.label)}"><ol>${join(all, (it, i) =>
    i === all.length - 1 || !it.href ? `<li><span aria-current="page">${esc(it.label)}</span></li>` : `<li><a href="${esc(it.href)}">${esc(it.label)}</a></li>`
  )}</ol></nav>`;
}
export const crumbList = (ctx, items) => [{ label: ctx.ui.breadcrumb.home, href: route('home', ctx.lang) }, ...items];

/* ---------------- HeroMedia ---------------- */
export function hero(ctx, { mediaId, eyebrow, h1, lead, ctas = '', extra = '', sub = false, crumbs = null, video = null }) {
  const m = mediaEntry(ctx, mediaId);
  const videoHtml = video
    ? `<video class="hero__video" muted loop playsinline preload="none" poster="${esc(imgSrc(m))}" data-hero-video aria-hidden="true">${video.sources
        .map((s) => `<source src="${esc(s.src)}" type="${esc(s.type)}"${s.media ? ` media="${esc(s.media)}"` : ''}>`)
        .join('')}</video>`
    : '';
  return `<section class="hero${sub ? ' hero--sub' : ''}" aria-labelledby="page-title">
  <div class="hero__media">${img(ctx, mediaId, { eager: true, alt: '' })}${videoHtml}</div>
  <div class="hero__overlay" aria-hidden="true"></div>
  ${when(crumbs, () => `<div class="hero__breadcrumbs"><div class="container">${crumbs}</div></div>`)}
  <div class="container hero__inner">
    <div class="hero__content">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1 id="page-title">${esc(h1)}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${ctas ? `<div class="btn-row">${ctas}</div>` : ''}
      ${extra}
    </div>
  </div>
  ${placeholderTag(ctx, mediaId)}
  ${video ? `<button class="video-toggle" type="button" data-video-toggle aria-pressed="false">${icon('pause')}<span>${esc(ctx.ui.video.pause)}</span></button>` : ''}
</section>`;
}

/* ---------------- Section head ---------------- */
export function sectionHead(ctx, { eyebrow, h2, intro, id, center = false, aside = '' }) {
  const inner = `${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2${id ? ` id="${id}"` : ''}>${esc(h2)}</h2>${intro ? `<p class="lead">${intro}</p>` : ''}`;
  if (aside) return `<div class="section-head section-head--split"><div>${inner}</div>${aside}</div>`;
  return `<div class="section-head${center ? ' section-head--center' : ''}">${inner}</div>`;
}

/* ---------------- ServiceCard ---------------- */
export function serviceCard(ctx, { key, h3, body, href, mediaId, index, soon = false }) {
  return `<article class="service-card${soon ? ' service-card--soon' : ''} reveal">
  ${figure(ctx, mediaId, { sizes: '(min-width:1100px) 25vw, (min-width:768px) 50vw, 100vw' })}
  <div class="service-card__body">
    ${soon ? `<span class="soon-badge">${esc(ctx.ui.nav.comingSoon)}</span>` : `<span class="service-card__num">${String(index).padStart(2, '0')}</span>`}
    <h3><a href="${href}">${esc(h3)}</a></h3>
    <p>${esc(body)}</p>
    <span class="link-arrow" aria-hidden="true">${esc(ctx.ui.cta.learnMore)}${icon('arrow', { dir: true })}</span>
  </div>
</article>`;
}

export function servicesGrid(ctx, cards) {
  const items = [
    { key: 'corporates', mediaId: 'svc-corporates' },
    { key: 'celebrations', mediaId: 'svc-celebrations' },
    { key: 'b2b', mediaId: 'svc-b2b' },
    { key: 'facility', mediaId: 'svc-facility', soon: ctx.config.facilityManagement.launchMode !== 'live' },
  ];
  return `<div class="grid grid--4 services-grid--4">${join(items, (it, i) =>
    serviceCard(ctx, { ...it, ...cards[it.key], href: route(it.key, ctx.lang), index: i + 1 })
  )}</div>`;
}

/* ---------------- Feature cards & steps ---------------- */
export const featureCards = (ctx, cards, cols = 4) =>
  `<div class="grid grid--${cols}">${join(cards, (c) => `<article class="feature-card reveal">${c.icon ? `<span class="feature-card__icon">${icon(c.icon)}</span>` : ''}<h3>${esc(c.h3)}</h3><p>${esc(c.body)}</p></article>`)}</div>`;

export const steps = (ctx, list) =>
  `<ol class="steps">${join(list, (s) => `<li class="step reveal"><h3>${esc(s.h3)}</h3><p>${esc(s.body)}</p></li>`)}</ol>`;

/* ---------------- KitchenTrustStrip / facts ---------------- */
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

/* ---------------- Kitchen film ---------------- */
export function kitchenFilm(ctx, caption) {
  const film = ctx.config.media.kitchenFilm;
  const posterId = ctx.config.media.kitchenPoster;
  if (film) {
    const m = mediaEntry(ctx, posterId);
    return `<figure class="media media--film"><video controls preload="none" playsinline poster="${esc(imgSrc(m))}" width="${m.width}" height="${m.height}">${film.sources
      .map((s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`)
      .join('')}${film.captions?.[ctx.lang] ? `<track kind="captions" src="${esc(film.captions[ctx.lang])}" srclang="${ctx.lang}" label="${esc(ctx.config.languages[ctx.lang].label)}" default>` : ''}</video>${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
  }
  return figure(ctx, posterId, { cls: 'media--film', caption: reviewMode(ctx) ? esc(ctx.ui.video.filmPending) : '' });
}

/* ---------------- FAQAccordion ---------------- */
export function faq(ctx, { h2, items, idPrefix }) {
  return `<div class="faq-layout">
  ${sectionHead(ctx, { h2, id: `${idPrefix}-faq-title` })}
  <div class="faq" data-faq>${join(items, (it, i) => {
    const id = `${idPrefix}-faq-${i + 1}`;
    return `<div class="faq-item">
      <h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="${id}" id="${id}-q"><span>${esc(it.q)}${it.review ? rf(ctx) : ''}</span><span class="faq-icon" aria-hidden="true"></span></button></h3>
      <div class="faq-a" id="${id}" role="region" aria-labelledby="${id}-q"><p>${esc(it.a)}</p></div>
    </div>`;
  })}</div>
</div>`;
}

/* ---------------- GalleryGrid ---------------- */
export function gallery(ctx, { page, limit = 12, idPrefix = 'gallery' }) {
  const all = ctx.media.gallery.filter((g) => !page || g.pages.includes(page));
  const items = all.slice(0, limit);
  const cats = ctx.media.galleryCategories.filter((c) => items.some((i) => i.category === c.id));
  const real = ctx.media.gallery.filter((g) => !g.demo && g.src).length;
  return `<div class="gallery" data-gallery>
  ${cats.length > 1 ? `<div class="gallery-filters" role="group" aria-label="${esc(ctx.ui.gallery.filterLabel)}" data-gallery-filters hidden>
    <button class="chip" type="button" data-filter="all" aria-pressed="true">${esc(ctx.ui.gallery.all)}</button>
    ${join(cats, (c) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="false">${esc(c.label[ctx.lang])}</button>`)}
  </div>` : ''}
  <ul class="gallery-grid" role="list">${join(items, (g) => {
    const src = g.src || `/assets/images/placeholders/${g.id}.svg`;
    return `<li class="gallery-item" data-category="${g.category}"><a href="${esc(src)}" data-lightbox data-caption="${esc(g.label[ctx.lang])}" aria-label="${esc(ctx.ui.gallery.open)}: ${esc(g.label[ctx.lang])}">${g.src ? '' : reviewMode(ctx) ? `<span class="placeholder-tag">${esc(ctx.ui.review.demo)}</span>` : ''}<img src="${esc(src)}" width="${g.width}" height="${g.height}" alt="${esc(g.alt[ctx.lang])}" loading="lazy" decoding="async"></a></li>`;
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
  if (logos.length) {
    return `<ul class="logo-wall" role="list">${join(logos, (l) => `<li class="logo-slot"><img src="${esc(l.src)}" width="${l.width}" height="${l.height}" alt="${esc(l.name[ctx.lang])}" loading="lazy"></li>`)}</ul>`;
  }
  if (!reviewMode(ctx)) return '';
  return `<div><ul class="logo-wall" role="list" aria-hidden="true">${Array.from({ length: 8 }, () => `<li class="logo-slot logo-slot--pending">${esc(ctx.ui.logos.slot)}</li>`).join('')}</ul>
  <p class="logo-wall__note">${pending(ctx, ctx.ui.logos.pending)}</p></div>`;
}

/* ---------------- CTASection ---------------- */
export function ctaBand(ctx, { h2, body, service, label, extra = '', id = 'request-quote', product }) {
  return `<section class="section cta-band" aria-labelledby="${id}-title" id="${id}">
  <div class="container cta-band__inner">
    <div><h2 id="${id}-title">${esc(h2)}</h2><p>${esc(body)}</p>${extra}</div>
    <div class="btn-row">${quoteButton(ctx, { label, service, product, cls: 'btn btn--light' })}${whatsappControl(ctx, { variant: 'icon' })}</div>
  </div>
</section>`;
}

/* ---------------- ProductCard ---------------- */
export function productSpecLine(ctx, p) {
  const v = p.variants?.[0];
  if (!v) return '';
  const parts = [];
  if (v.weight) parts.push(`${v.weight.value.toLocaleString('en-US')} ${ctx.lang === 'ar' ? (v.weight.unit === 'g' ? 'غ' : v.weight.unit) : v.weight.unit}`);
  if (p.variants.length > 1) parts.push(`+${p.variants.length - 1}`);
  return parts.join(' · ');
}
export function productCard(ctx, p, { headingLevel = 4 } = {}) {
  const cat = ctx.categoriesById[p.category];
  const href = productRoute(p, ctx.lang);
  const imgId = p.heroImage || 'product-placeholder';
  const spec = productSpecLine(ctx, p);
  const draft = p.status !== 'approved' && reviewMode(ctx) ? `<span class="status-pill">${esc(p.status === 'draft' ? ctx.ui.catalogue.draft : ctx.ui.review.flag)}</span>` : '';
  return `<article class="product-card" data-product-card>
    ${draft}
    ${figure(ctx, imgId, { sizes: '(min-width:1360px) 22vw, (min-width:1100px) 30vw, (min-width:768px) 45vw, 100vw' })}
    <div class="product-card__body">
      <span class="product-card__cat">${esc(cat.name[ctx.lang])}</span>
      <h${headingLevel}>${esc(p.name[ctx.lang])}</h${headingLevel}>
      ${spec ? `<p class="product-card__spec"${ctx.lang === 'ar' ? '' : ' dir="ltr"'}>${esc(spec)}</p>` : ''}
      <a class="link-arrow" href="${href}"><span>${esc(ctx.ui.cta.viewProduct)}<span class="visually-hidden">: ${esc(p.name[ctx.lang])}</span></span>${icon('arrow', { dir: true })}</a>
    </div>
  </article>`;
}

/* ---------------- Service rows (H3 sections with media) ---------------- */
export function serviceRows(ctx, items, service) {
  return `<div class="service-rows">${join(items, (s, i) => `<article class="service-row reveal" id="${s.id}" aria-labelledby="${s.id}-title">
    <div class="service-row__media">${figure(ctx, s.img, { sizes: '(min-width:768px) 50vw, 100vw' })}</div>
    <div>
      <span class="service-row__index">${String(i + 1).padStart(2, '0')}</span>
      <h3 id="${s.id}-title">${esc(s.h3)}</h3>
      <p>${esc(s.body)}</p>
      ${quoteButton(ctx, { label: ctx.ui.cta.quote, service, cls: 'link-arrow' })}
    </div>
  </article>`)}</div>`;
}

export function jumpLinks(ctx, label, items) {
  return `<nav class="jump-links" aria-label="${esc(label)}"><div class="container jump-links__inner">${join(items, (s) => `<a class="chip" href="#${s.id}" data-jump>${esc(s.h3)}</a>`)}</div></nav>`;
}
