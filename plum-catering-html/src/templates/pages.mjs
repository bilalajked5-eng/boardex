// Page templates — one function per Blueprint §4 page. Each returns
// { meta, main, afterMain? } and never hard-codes copy (all copy comes from content.{lang}.json).
import { esc, fmt, icon, join, when, rf, pending, fact, figure, reviewMode } from './helpers.mjs';
import { route, productRoute, familyAnchor } from './routes.mjs';
import { quoteButton, whatsappControl } from './layout.mjs';
import {
  hero, sectionHead, servicesGrid, featureCards, steps, kitchenFacts, kitchenFilm, faq, gallery, lightbox,
  logoWall, ctaBand, productCard, serviceRows, jumpLinks, breadcrumbs, crumbList, serviceCard,
} from './components.mjs';
import { graph, serviceNode, productNode } from './schema.mjs';

const link = (href, label) => `<a href="${href}">${esc(label)}</a>`;
const exploreBtn = (ctx, href) => `<a class="btn btn--outline-light" href="${href}">${esc(ctx.ui.cta.explore)}</a>`;

/* =========================== HOME =========================== */
export function home(ctx) {
  const c = ctx.pages.home;
  const L = ctx.lang;
  const heroLinks = fmt(c.hero.links, { corporates: link(route('corporates', L), ctx.ui.nav.corporates), celebrations: link(route('celebrations', L), ctx.ui.nav.celebrations) });
  const video = ctx.config.media.heroVideo;
  const main = `
${hero(ctx, {
  mediaId: ctx.config.media.heroPoster, eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), video,
  ctas: quoteButton(ctx, { cls: 'btn btn--light' }) + exploreBtn(ctx, '#services'),
  extra: `<p class="hero__links">${heroLinks}</p>`,
})}

<section class="section" aria-labelledby="about-title">
  <div class="container split split--wide-media">
    ${figure(ctx, 'about-hero', { cls: 'media--tall reveal', sizes: '(min-width:768px) 50vw, 100vw' })}
    <div class="reveal">
      <p class="eyebrow">${esc(ctx.config.siteName[L])}</p>
      <h2 id="about-title">${esc(c.about.h2)}</h2>
      <p>${esc(c.about.body)}</p>
      <h3>${esc(c.about.approach.h3)}</h3>
      <p class="muted">${esc(c.about.approach.body)}</p>
      <a class="link-arrow" href="${route('about', L)}">${esc(ctx.ui.cta.aboutLink)}${icon('arrow', { dir: true })}</a>
    </div>
  </div>
</section>

<section class="section section--ivory" id="services" aria-labelledby="services-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.services.h2, intro: esc(c.services.intro), id: 'services-title' })}
    ${servicesGrid(ctx, c.services.cards)}
  </div>
</section>

<section class="section section--plum" id="kitchen" aria-labelledby="kitchen-title">
  <div class="container split">
    <div class="reveal">${kitchenFilm(ctx)}</div>
    <div class="reveal">
      <h2 id="kitchen-title">${esc(c.kitchen.h2)}</h2>
      <p class="lead">${esc(c.kitchen.intro)}</p>
      ${join(c.kitchen.items, (it) => `<h3>${esc(it.h3)}</h3><p>${esc(it.body)}</p>`)}
      ${kitchenFacts(ctx, c.kitchen)}
      <p style="margin-block-start:24px"><a class="link-arrow" href="${route('about', L)}#kitchen">${esc(c.kitchen.link)}${icon('arrow', { dir: true })}</a></p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.why.h2, id: 'why-title' })}
    ${featureCards(ctx, c.why.cards, 4)}
  </div>
</section>

<section class="section section--white" aria-labelledby="cuisine-title">
  <div class="container container--narrow" style="text-align:center">
    <h2 id="cuisine-title">${esc(c.cuisine.h2)}</h2>
    <p class="lead">${fmt(c.cuisine.body, { corporates: link(route('corporates', L), ctx.ui.nav.corporates), celebrations: link(route('celebrations', L), ctx.ui.nav.celebrations) })}</p>
    ${pending(ctx, c.cuisine.pendingNote)}
  </div>
</section>

<section class="section" id="our-work" aria-labelledby="work-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.work.h2, intro: esc(c.work.intro), id: 'work-title' })}
    ${gallery(ctx, { page: 'home', limit: 10 })}
  </div>
</section>

${when(ctx.clientLogos.length || reviewMode(ctx), () => `<section class="section section--ivory" aria-labelledby="clients-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.clients.h2, intro: esc(c.clients.intro), id: 'clients-title' })}
    ${logoWall(ctx)}
    <p style="margin-block-start:20px"><a class="link-arrow" href="${route('about', L)}#clients">${esc(ctx.ui.cta.aboutLink)}${icon('arrow', { dir: true })}</a></p>
  </div>
</section>`)}

<section class="section" aria-labelledby="home-faq-title">
  <div class="container">${faq(ctx, { h2: c.faq.h2, items: c.faq.items, idPrefix: 'home' })}</div>
</section>

${ctaBand(ctx, { h2: c.finalCta.h2, body: c.finalCta.body })}`;

  return {
    meta: {
      ...c.meta,
      jsonld: graph(ctx, { type: 'WebPage', ...c.meta, title: c.meta.title }),
    },
    main,
    afterMain: lightbox(ctx),
  };
}

/* =========================== ABOUT =========================== */
export function about(ctx) {
  const c = ctx.pages.about;
  const L = ctx.lang;
  const crumbs = [{ label: ctx.ui.nav.about }];
  const parent = fact(ctx, 'parent');
  const certs = fact(ctx, 'certifications');
  const showPendingOnly = reviewMode(ctx);
  const whoBody = parent ? fmt(c.who.body, { parent: `${esc(parent.value)}${parent.flag}` }) : esc(c.who.bodyNoParent);
  const main = `
${hero(ctx, { mediaId: 'about-hero', eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), sub: true, crumbs: breadcrumbs(ctx, crumbs) })}

<section class="section" aria-labelledby="who-title">
  <div class="container split">
    <div class="reveal">
      <h2 id="who-title">${esc(c.who.h2)}</h2>
      <p class="lead">${whoBody}</p>
      ${pending(ctx, c.who.pendingNote)}
      <div class="btn-row" style="margin-block-start:24px"><a class="btn btn--secondary" href="${route('home', L)}#services">${esc(ctx.ui.cta.explore)}</a></div>
    </div>
    ${figure(ctx, 'kitchen-facility', { cls: 'reveal', sizes: '(min-width:768px) 50vw, 100vw' })}
  </div>
</section>

${when(showPendingOnly, () => `<section class="section section--white" aria-labelledby="story-title">
  <div class="container container--narrow">
    <h2 id="story-title">${esc(c.story.h2)}</h2>
    ${pending(ctx, c.story.pendingNote)}
  </div>
</section>

<section class="section" aria-labelledby="mvv-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.mvv.h2, id: 'mvv-title' })}
    <div class="grid grid--3">${join(['mission', 'vision', 'values'], (k) => `<article class="feature-card"><h3>${esc(c.mvv[k].h3)}</h3>${pending(ctx, c.mvv.pendingNote)}</article>`)}</div>
  </div>
</section>`)}

<section class="section section--ivory" aria-labelledby="what-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.whatWeDo.h2, intro: esc(c.whatWeDo.intro), id: 'what-title' })}
    ${servicesGrid(ctx, ctx.pages.home.services.cards)}
  </div>
</section>

<section class="section section--plum" id="kitchen" aria-labelledby="kitchen-title">
  <div class="container split">
    <div class="reveal">${kitchenFilm(ctx, c.kitchen.filmCaption)}</div>
    <div class="reveal">
      <h2 id="kitchen-title">${esc(c.kitchen.h2)}</h2>
      <p class="lead">${esc(c.kitchen.body)}</p>
      <h3>${esc(c.kitchen.logisticsH3)}</h3>
      <p>${esc(c.kitchen.logisticsBody)}</p>
      ${kitchenFacts(ctx, ctx.pages.home.kitchen)}
    </div>
  </div>
</section>

<section class="section" id="quality" aria-labelledby="quality-title">
  <div class="container container--narrow">
    <h2 id="quality-title">${esc(c.quality.h2)}</h2>
    <h3>${esc(c.quality.certH3)}</h3>
    ${certs ? `<p>${esc(c.quality.certBody)}</p><ul class="tag-list" style="margin-block:16px">${certs.value.map((x) => `<li dir="ltr">${esc(x)}</li>`).join('')}</ul>${certs.flag}` : ''}
    ${pending(ctx, c.quality.pendingNote)}
  </div>
</section>

${when(showPendingOnly, () => `<section class="section section--white" aria-labelledby="team-title">
  <div class="container split">
    ${figure(ctx, 'team', { sizes: '(min-width:768px) 50vw, 100vw' })}
    <div><h2 id="team-title">${esc(c.team.h2)}</h2><p>${esc(c.team.body)}</p>${pending(ctx, c.team.pendingNote)}</div>
  </div>
</section>`)}

${when(ctx.clientLogos.length || reviewMode(ctx), () => `<section class="section section--ivory" id="clients" aria-labelledby="clients-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.clients.h2, intro: esc(c.clients.intro), id: 'clients-title' })}
    ${logoWall(ctx)}
  </div>
</section>`)}

<section class="section" aria-labelledby="process-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.process.h2, id: 'process-title' })}
    ${steps(ctx, c.process.steps)}
  </div>
</section>

${ctaBand(ctx, {
  h2: c.finalCta.h2, body: c.finalCta.body,
  extra: `<p class="btn-row" style="margin-block-start:16px">${link(route('corporates', L), ctx.ui.nav.corporates)} · ${link(route('celebrations', L), ctx.ui.nav.celebrations)} · ${link(route('b2b', L), ctx.ui.nav.b2b)}</p>`,
})}`;
  return {
    meta: { ...c.meta, jsonld: graph(ctx, { type: 'AboutPage', title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.about, href: ctx.path }]) }) },
    main,
  };
}

/* =================== SERVICE PAGES (shared skeleton) =================== */
function servicePage(ctx, key, { service, heroMedia, extraSections = '', afterServices = '' }) {
  const c = ctx.pages[key];
  const L = ctx.lang;
  const crumbs = [{ label: ctx.ui.nav[key] }];
  const main = `
${hero(ctx, {
  mediaId: heroMedia, eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), sub: true, crumbs: breadcrumbs(ctx, crumbs),
  ctas: quoteButton(ctx, { label: c.hero.cta, service, cls: 'btn btn--light' }) + whatsappControl(ctx),
})}

<section class="section" aria-labelledby="overview-title">
  <div class="container container--narrow">
    <h2 id="overview-title">${esc(c.overview.h2)}</h2>
    <p class="lead">${esc(c.overview.body)}</p>
    ${c.related ? `<p class="muted">${fmt(c.related.b2b, { link: link(route('b2b', L), ctx.ui.nav.b2b) })}</p>` : ''}
  </div>
</section>

<section aria-labelledby="services-title">
  <div class="container"><h2 id="services-title" style="margin-block-end:24px">${esc(c.services.h2)}</h2></div>
  ${jumpLinks(ctx, c.services.jumpLabel, c.services.items)}
  <div class="section"><div class="container">${serviceRows(ctx, c.services.items, service)}</div></div>
</section>
${afterServices}
${extraSections}
`;
  return { c, main };
}

export function corporates(ctx) {
  const L = ctx.lang;
  const c = ctx.pages.corporates;
  const kitchen = `
<section class="section section--ivory" aria-labelledby="kitchen-title">
  <div class="container split">
    <div class="reveal">
      <h2 id="kitchen-title">${esc(c.kitchen.h2)}</h2>
      <p class="lead">${esc(c.kitchen.body)}</p>
      <a class="link-arrow" href="${route('about', L)}#kitchen">${esc(ctx.pages.home.kitchen.link)}${icon('arrow', { dir: true })}</a>
    </div>
    <div class="reveal">${figure(ctx, 'kitchen-facility', { sizes: '(min-width:768px) 50vw, 100vw' })}</div>
  </div>
</section>
<section class="section section--plum" aria-labelledby="process-title">
  <div class="container">${sectionHead(ctx, { h2: c.process.h2, id: 'process-title' })}${steps(ctx, c.process.steps)}</div>
</section>
<section class="section" aria-labelledby="gallery-title">
  <div class="container">${sectionHead(ctx, { h2: c.gallery.h2, id: 'gallery-title' })}${gallery(ctx, { page: 'corporates', limit: 8 })}</div>
</section>
<section class="section section--white" aria-labelledby="corp-faq-title">
  <div class="container">${faq(ctx, { h2: c.faq.h2, items: c.faq.items, idPrefix: 'corp' })}</div>
</section>
${ctaBand(ctx, { h2: c.finalCta.h2, body: c.finalCta.body, service: 'corporate', label: c.hero.cta,
  extra: `<p class="small" style="margin-block-start:12px">${link(route('about', L), ctx.ui.nav.about)} · ${link(route('celebrations', L), ctx.ui.nav.celebrations)} · ${link(route('home', L), ctx.ui.nav.home)}</p>` })}`;
  const { main } = servicePage(ctx, 'corporates', { service: 'corporate', heroMedia: 'corp-hero', extraSections: kitchen });
  return {
    meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.corporates, href: ctx.path }]),
      extra: [serviceNode(ctx, { name: c.hero.h1, description: c.meta.description, serviceType: L === 'ar' ? 'تموين الشركات' : 'Corporate catering' })] }) },
    main, afterMain: lightbox(ctx),
  };
}

export function celebrations(ctx) {
  const L = ctx.lang;
  const c = ctx.pages.celebrations;
  const extra = `
<section class="section section--ivory" aria-labelledby="menus-title">
  <div class="container container--narrow">
    <h2 id="menus-title">${esc(c.menus.h2)}</h2>
    <p class="lead">${esc(c.menus.body)}</p>
    ${pending(ctx, c.menus.pendingNote)}
  </div>
</section>
<section class="section" aria-labelledby="gallery-title">
  <div class="container">${sectionHead(ctx, { h2: c.gallery.h2, id: 'gallery-title' })}${gallery(ctx, { page: 'celebrations', limit: 16 })}</div>
</section>
<section class="section section--plum" aria-labelledby="process-title">
  <div class="container">${sectionHead(ctx, { h2: c.process.h2, id: 'process-title' })}${steps(ctx, c.process.steps)}</div>
</section>
<section class="section" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.why.h2, id: 'why-title', aside: `<a class="link-arrow" href="${route('about', L)}">${esc(ctx.ui.cta.aboutLink)}${icon('arrow', { dir: true })}</a>` })}
    ${featureCards(ctx, c.why.points, 3)}
  </div>
</section>
<section class="section section--white" aria-labelledby="cel-faq-title">
  <div class="container">${faq(ctx, { h2: c.faq.h2, items: c.faq.items, idPrefix: 'cel' })}</div>
</section>
${ctaBand(ctx, { h2: c.finalCta.h2, body: c.finalCta.body, service: 'celebration', label: c.hero.cta,
  extra: `<p class="small" style="margin-block-start:12px">${link(route('corporates', L), ctx.ui.nav.corporates)} · ${link(route('about', L), ctx.ui.nav.about)} · ${link(route('home', L), ctx.ui.nav.home)}</p>` })}`;
  const { main } = servicePage(ctx, 'celebrations', { service: 'celebration', heroMedia: 'cel-hero', extraSections: extra });
  return {
    meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.celebrations, href: ctx.path }]),
      extra: [serviceNode(ctx, { name: c.hero.h1, description: c.meta.description, serviceType: L === 'ar' ? 'تموين المناسبات' : 'Event catering' })] }) },
    main, afterMain: lightbox(ctx),
  };
}

/* =========================== B2B =========================== */
export function b2b(ctx) {
  const c = ctx.pages.b2b;
  const L = ctx.lang;
  const ui = ctx.ui;
  const visible = ctx.products.filter((p) => p.status !== 'archived');
  const loaded = visible.length;
  const expected = ctx.categories.reduce((s, x) => s + (x.expectedCount || 0), 0);
  const pdf = ctx.config.catalogue.pdf[L] || ctx.config.catalogue.pdf.en || ctx.config.catalogue.pdf.ar;
  const pdfBtn = pdf
    ? `<a class="btn btn--primary" href="${esc(pdf)}" download data-track="catalogue_download">${icon('download')}<span>${esc(ui.cta.downloadCatalogue)}</span></a>`
    : `<span class="btn btn--secondary" aria-disabled="true">${icon('download')}<span>${esc(ui.cta.downloadCatalogue)}</span></span>`;

  const shownCats = ctx.categories.filter((cat) => reviewMode(ctx) || visible.some((p) => p.category === cat.id));
  const families = join(ctx.categories, (cat) => {
    const items = visible.filter((p) => p.category === cat.id);
    const missing = Math.max(0, (cat.expectedCount || 0) - items.length);
    if (!items.length && !reviewMode(ctx)) return '';
    return `<section class="product-family" id="family-${cat.id}" data-family="${cat.id}" aria-labelledby="family-${cat.id}-title">
      <div class="product-family__head">
        <h3 id="family-${cat.id}-title">${esc(cat.name[L])}</h3>
        ${reviewMode(ctx) ? `<span class="product-family__count">${fmt(ui.catalogue.loaded, { n: items.length, expected: cat.expectedCount })}${rf(ctx)}</span>` : ''}
      </div>
      <ul class="product-grid" role="list">
        ${join(items, (p) => `<li data-product data-name="${esc(`${p.name.ar} ${p.name.en}`.toLowerCase())}" data-family="${cat.id}">${productCard(ctx, p)}</li>`)}
        ${missing && reviewMode(ctx) ? `<li data-pending-card><div class="pending-card"><strong>${missing}</strong><span>${fmt(ui.catalogue.pendingCard, { n: missing, family: esc(cat.name[L]) })}</span></div></li>` : ''}
      </ul>
    </section>`;
  });

  const shelfRows = ctx.categories
    .map((cat) => ({ cat, s: cat.shelfLife }))
    .filter(({ s }) => s || reviewMode(ctx))
    .filter(({ s }) => !s || s.status === 'verified' || reviewMode(ctx));

  const main = `
${hero(ctx, {
  mediaId: 'b2b-hero', eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), sub: true, crumbs: breadcrumbs(ctx, [{ label: ui.nav.b2b }]),
  ctas: `<a class="btn btn--light" href="#range">${esc(ui.cta.browseProducts)}</a>` + (pdf ? `<a class="btn btn--outline-light" href="${esc(pdf)}" download>${esc(ui.cta.downloadCatalogue)}</a>` : `<a class="btn btn--outline-light" href="#catalogue-download">${esc(ui.cta.downloadCatalogue)}</a>`) + quoteButton(ctx, { label: ui.cta.b2bQuote, service: 'b2b', cls: 'btn btn--outline-light', iconName: null }),
})}

<section class="section" aria-labelledby="overview-title">
  <div class="container container--narrow">
    <h2 id="overview-title">${esc(c.overview.h2)}</h2>
    <p class="lead">${esc(c.overview.body)}</p>
  </div>
</section>

<section class="section section--white" id="range" aria-labelledby="range-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.range.h2, id: 'range-title', intro: reviewMode(ctx) ? `${fmt(ui.catalogue.loaded, { n: loaded, expected })}${rf(ctx)}` : '' })}
    <nav class="family-index" aria-label="${esc(ui.filters.label)}">${join(shownCats, (cat) => `<a class="chip" href="#family-${cat.id}">${esc(cat.name[L])}</a>`)}</nav>
    <div class="catalogue-tools" data-catalogue-tools hidden>
      <div class="search-field"><label class="visually-hidden" for="product-search">${esc(ui.filters.search)}</label>${icon('search')}<input class="input" id="product-search" type="search" placeholder="${esc(ui.filters.searchPlaceholder)}" autocomplete="off" data-product-search></div>
      <div class="filter-chips" role="group" aria-label="${esc(ui.filters.label)}">
        <button class="chip" type="button" data-family-filter="all" aria-pressed="true">${esc(ui.filters.all)}</button>
        ${join(shownCats, (cat) => `<button class="chip" type="button" data-family-filter="${cat.id}" aria-pressed="false">${esc(cat.name[L])}</button>`)}
      </div>
      <p class="catalogue-status" role="status" aria-live="polite" data-catalogue-status></p>
    </div>
    <div data-catalogue>${families}</div>
    <div class="no-results" data-no-results hidden><p>${esc(ui.filters.noResults)}</p><button class="btn btn--secondary btn--sm" type="button" data-clear-filters>${esc(ui.filters.clear)}</button></div>
  </div>
</section>

${when(shelfRows.length, () => `<section class="section" aria-labelledby="options-title">
  <div class="container container--narrow">
    <h2 id="options-title">${esc(c.options.h2)}</h2>
    <p>${esc(c.options.body)}</p>
    <div class="table-wrap"><table class="shelf-table">
      <thead><tr><th scope="col">${esc(ctx.pages.product.spec.category)}</th><th scope="col">${esc(c.options.fresh)}</th><th scope="col">${esc(c.options.frozen)}</th></tr></thead>
      <tbody>${join(shelfRows, ({ cat, s }) => s
        ? `<tr><th scope="row">${esc(cat.name[L])}</th><td>${esc(s.fresh?.[L] || '—')}${s.status !== 'verified' ? rf(ctx) : ''}</td><td>${esc(s.bakedFrozen?.[L] || '—')}</td></tr>`
        : `<tr><th scope="row">${esc(cat.name[L])}</th><td colspan="2" class="muted small">${esc(c.options.familyPending)}</td></tr>`)}</tbody>
    </table></div>
  </div>
</section>`)}

<section class="section section--plum" aria-labelledby="quality-title">
  <div class="container split">
    <div>
      <h2 id="quality-title">${esc(c.quality.h2)}</h2>
      <p class="lead">${esc(c.quality.body)}</p>
      <a class="link-arrow" href="${route('about', L)}#quality">${esc(ui.cta.aboutLink)}${icon('arrow', { dir: true })}</a>
    </div>
    <div>${kitchenFacts(ctx, ctx.pages.home.kitchen)}</div>
  </div>
</section>

<section class="section" id="catalogue-download" aria-labelledby="download-title">
  <div class="container">
    <div class="download-card">
      <span class="download-card__icon">${icon('file')}</span>
      <div>
        <h2 id="download-title" style="font-size:clamp(1.5rem,2.4vw,2rem)">${esc(c.download.h2)}</h2>
        <p class="muted">${esc(c.download.body)}</p>
        ${!pdf && reviewMode(ctx) ? pending(ctx, ui.catalogue.pdfPending) : !pdf ? `<p class="small muted">${esc(ui.catalogue.pdfPending)}</p>` : ctx.config.catalogue.pdf.version ? `<p class="small muted">v${esc(ctx.config.catalogue.pdf.version)} · ${esc(ctx.config.catalogue.pdf.date || '')}</p>` : ''}
      </div>
      ${pdfBtn}
    </div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="who-title">
  <div class="container">
    <h2 id="who-title">${esc(c.who.h2)}</h2>
    <ul class="tag-list" style="margin-block:20px">${join(c.who.items, (x) => `<li>${esc(x)}</li>`)}</ul>
    ${pending(ctx, c.who.pendingNote)}
  </div>
</section>

${ctaBand(ctx, { h2: c.finalCta.h2, body: c.finalCta.body, service: 'b2b', label: ui.cta.b2bQuote, id: 'b2b-partnership' })}

<section class="section" aria-labelledby="b2b-faq-title">
  <div class="container">${faq(ctx, { h2: c.faq.h2, items: c.faq.items, idPrefix: 'b2b' })}</div>
</section>`;

  const itemList = {
    '@type': 'ItemList',
    name: c.range.h2,
    itemListElement: visible.filter((p) => ctx.isIndexableProduct(p)).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ctx.config.productionBaseUrl}${productRoute(p, L)}`, name: p.name[L] })),
  };
  return {
    meta: { ...c.meta, jsonld: graph(ctx, { type: 'CollectionPage', title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ui.nav.b2b, href: ctx.path }]),
      extra: [serviceNode(ctx, { name: c.hero.h1, description: c.meta.description, serviceType: L === 'ar' ? 'توريد المخبوزات بالجملة' : 'Wholesale bakery supply' }), ...(itemList.itemListElement.length ? [itemList] : [])] }) },
    main,
  };
}

/* =========================== PRODUCT =========================== */
export function product(ctx, p) {
  const t = ctx.pages.product;
  const L = ctx.lang;
  const ui = ctx.ui;
  const cat = ctx.categoriesById[p.category];
  const name = p.name[L];
  const approved = ctx.isIndexableProduct(p);
  const shelf = p.freshOrFrozen === 'inherit-category' ? cat.shelfLife : p.shelfLife;
  const showShelf = shelf && (shelf.status === 'verified' || reviewMode(ctx));
  const num = (n) => Number(n).toLocaleString('en-US');
  const unit = (u) => (L === 'ar' ? { g: 'غ', kg: 'كغ', kcal: 'سعرة حرارية' }[u] || u : u);
  const flagIfProvisional = p.status !== 'approved' ? rf(ctx) : '';
  const v0 = p.variants?.[0];
  const prodRef = { id: p.id, name, category: cat.name[L] };

  const chips = [
    v0?.weight && { k: t.spec.weight, v: `${num(v0.weight.value)} ${unit(v0.weight.unit)}` },
    v0?.energy && { k: t.spec.energy, v: `${num(v0.energy.value)} ${unit(v0.energy.unit)}` },
    showShelf && shelf.fresh && { k: t.spec.fresh, v: shelf.fresh[L] },
    showShelf && shelf.bakedFrozen && { k: t.spec.frozen, v: shelf.bakedFrozen[L] },
  ].filter(Boolean);

  const specRows = [
    { k: t.spec.category, v: `<a href="${familyAnchor(L, cat.id)}">${esc(cat.name[L])}</a>` },
    p.productCode && { k: t.spec.code, v: `<span dir="ltr">${esc(p.productCode)}</span>` },
    ...(p.variants.length === 1
      ? [
          v0.weight && { k: t.spec.weight, v: `${esc(num(v0.weight.value))} ${esc(unit(v0.weight.unit))}${flagIfProvisional}` },
          v0.energy && { k: t.spec.energy, v: `${esc(num(v0.energy.value))} ${esc(unit(v0.energy.unit))}${v0.energy.basis ? ` (${esc(v0.energy.basis[L])})` : reviewMode(ctx) ? ` <span class="small muted">(${esc(t.energyBasisPending)})</span>` : ''}${flagIfProvisional}` },
        ]
      : []),
    p.packaging?.[L] && { k: t.spec.packaging, v: esc(p.packaging[L]) },
    showShelf && shelf.fresh && { k: t.spec.fresh, v: `${esc(shelf.fresh[L])}${shelf.status !== 'verified' ? rf(ctx) : ''}` },
    showShelf && shelf.bakedFrozen && { k: t.spec.frozen, v: `${esc(shelf.bakedFrozen[L])}${shelf.status !== 'verified' ? rf(ctx) : ''}` },
  ].filter(Boolean);

  const related = (p.relatedProducts || []).map((id) => ctx.productsById[id]).filter((r) => r && r.id !== p.id).slice(0, 4);
  const section = (id, h2, body) => (body ? `<section class="product-section" aria-labelledby="${id}-title"><h2 id="${id}-title">${esc(h2)}</h2>${body}</section>` : '');
  const textOrPending = (val, note) => (val?.[L] ? `<p>${esc(val[L])}</p>` : pending(ctx, note));

  const crumbs = [
    { label: ui.nav.b2b, href: route('b2b', L) },
    { label: cat.name[L], href: familyAnchor(L, cat.id) },
    { label: name },
  ];
  const imgId = p.heroImage || 'product-placeholder';

  const main = `
${!approved && reviewMode(ctx) ? `<div class="draft-banner" role="note">${esc(t.draftBanner)}</div>` : ''}
<div class="container">${breadcrumbs(ctx, crumbs)}</div>
<section class="product-hero" aria-labelledby="page-title">
  <div class="container product-hero__grid">
    <div class="product-gallery">
      <div class="product-gallery__main">${figure(ctx, imgId, { eager: true, sizes: '(min-width:1100px) 50vw, 100vw', caption: !p.heroImage && reviewMode(ctx) ? esc(t.pending.image) : '' })}</div>
    </div>
    <div class="product-info">
      <p class="eyebrow">${esc(cat.name[L])} · ${esc(t.eyebrow)}</p>
      <h1 id="page-title">${esc(p.h1?.[L] || name)}</h1>
      ${p.shortDescription?.[L] ? `<p class="lead">${esc(p.shortDescription[L])}</p>` : pending(ctx, t.pending.intro)}
      ${chips.length ? `<ul class="spec-chips" aria-label="${esc(t.highlights)}">${join(chips, (ch) => `<li><span>${esc(ch.k)}</span><strong>${esc(ch.v)}</strong></li>`)}</ul>` : ''}
      <div class="btn-row">
        ${quoteButton(ctx, { label: ui.cta.productQuote, service: 'b2b', product: prodRef })}
        ${whatsappControl(ctx, { variant: 'button', message: `${t.inquiry}: ${name} (${p.id})` })}
      </div>
      <p style="margin-block-start:20px"><a class="link-arrow" href="${route('b2b', L)}#family-${cat.id}">${icon('arrow', { dir: true, cls: 'icon-back' })}${esc(ui.cta.backToCatalogue)}</a></p>
    </div>
  </div>
</section>

<div class="container container--narrow" style="padding-block-end:var(--section-y)">
  ${section('overview', t.overviewH2, textOrPending(p.longDescription, t.pending.overview))}
  ${section('specs', t.specsH2, `<div class="table-wrap"><table class="spec-table"><tbody>${join(specRows, (r) => `<tr><th scope="row">${esc(r.k)}</th><td>${r.v}</td></tr>`)}</tbody></table></div>
    ${p.variants.length > 1 ? `<h3 style="margin-block-start:28px">${esc(t.sizesH3)}</h3><div class="table-wrap"><table class="spec-table"><thead><tr><th scope="col">${esc(t.spec.variant)}</th><th scope="col">${esc(t.spec.weight)}</th><th scope="col">${esc(t.spec.energy)}</th></tr></thead><tbody>${join(p.variants, (v, i) => `<tr><th scope="row">${i + 1}</th><td>${v.weight ? `${esc(num(v.weight.value))} ${esc(unit(v.weight.unit))}` : '—'}</td><td>${v.energy ? `${esc(num(v.energy.value))} ${esc(unit(v.energy.unit))}` : '—'}</td></tr>`)}</tbody></table></div>` : ''}
    ${!v0 ? pending(ctx, t.pending.specs) : ''}`)}
  ${section('ingredients', t.ingredientsH2, p.ingredients?.[L] || p.allergens?.[L] ? `${p.ingredients?.[L] ? `<p>${esc(p.ingredients[L])}</p>` : ''}${p.allergens?.[L] ? `<p><strong>${esc(p.allergens[L])}</strong></p>` : ''}` : pending(ctx, t.pending.ingredients))}
  ${section('storage', t.storageH2, textOrPending(p.storage, t.pending.storage))}
  ${section('applications', t.applicationsH2, textOrPending(p.foodserviceUse, t.pending.applications))}
  ${section('related', t.relatedH2, related.length
    ? `<ul class="product-grid" role="list">${join(related, (r) => `<li>${productCard(ctx, r, { headingLevel: 3 })}</li>`)}</ul>`
    : reviewMode(ctx) ? `${pending(ctx, t.pending.related)}<p style="margin-block-start:16px"><a class="link-arrow" href="${familyAnchor(L, cat.id)}">${esc(cat.name[L])}${icon('arrow', { dir: true })}</a></p>` : '')}
</div>

${ctaBand(ctx, { h2: t.pricingH2, body: t.pricingBody, service: 'b2b', label: ui.cta.productQuote, product: prodRef, id: 'product-pricing' })}`;

  const desc = p.seo?.description?.[L] || p.shortDescription?.[L] ||
    (L === 'ar' ? `${name} من فئة ${cat.name[L]} — توريد بالجملة من بلام للتموين في الرياض. اطلب عرض سعر لهذا المنتج.` : `${name} from the ${cat.name[L]} range — wholesale supply from Plum Catering in Riyadh. Request a quote for this product.`);
  const title = p.seo?.title?.[L] || (L === 'ar' ? `${name} | ${cat.name[L]} بالجملة | بلام للتموين` : `${name} | Wholesale ${cat.name[L]} | Plum Catering`);
  return {
    meta: {
      title, description: desc, ogType: 'product',
      jsonld: graph(ctx, { title, description: desc, crumbs: crumbList(ctx, [{ label: ui.nav.b2b, href: route('b2b', L) }, { label: cat.name[L], href: familyAnchor(L, cat.id) }, { label: name, href: ctx.path }]), extra: [productNode(ctx, p, cat)] }),
    },
    main,
  };
}

/* =========================== FACILITY =========================== */
export function facility(ctx, { forceLive = false } = {}) {
  const live = forceLive || ctx.config.facilityManagement.launchMode === 'live';
  const L = ctx.lang;
  const F = ctx.pages.facility;
  const crumbs = [{ label: ctx.ui.nav.facility }];
  if (!live) {
    const c = F.comingSoon;
    const cards = ctx.pages.home.services.cards;
    const main = `
${hero(ctx, { mediaId: 'fm-hero', eyebrow: c.eyebrow, h1: c.h1, lead: esc(c.lead), sub: true, crumbs: breadcrumbs(ctx, crumbs) })}
<section class="section" aria-labelledby="planned-title">
  <div class="container container--narrow">
    <h2 id="planned-title">${esc(c.plannedH2)}</h2>
    <p class="muted">${esc(c.plannedNote)}</p>
    <ul class="soon-list" style="margin-block-start:20px">${join(c.planned, (x) => `<li>${esc(x)}</li>`)}</ul>
  </div>
</section>
<section class="section section--ivory" aria-labelledby="live-title">
  <div class="container">
    ${sectionHead(ctx, { h2: c.liveH2, intro: esc(c.liveBody), id: 'live-title' })}
    <div class="grid grid--3">${join(['corporates', 'celebrations', 'b2b'], (k, i) => serviceCard(ctx, { key: k, ...cards[k], href: route(k, L), mediaId: `svc-${k}`, index: i + 1 }))}</div>
  </div>
</section>
${ctaBand(ctx, { h2: ctx.pages.home.finalCta.h2, body: ctx.pages.home.finalCta.body })}`;
    return { meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.facility, href: ctx.path }]) }) }, main, live: false };
  }
  // Phase-2 full template — rendered for preview only until content is approved.
  const c = F.live;
  const s = c.sections;
  const block = (key, inner = '') => `<section class="section${['solutions', 'model', 'faq'].includes(key) ? ' section--ivory' : ''}" aria-labelledby="fm-${key}-title"><div class="container">${sectionHead(ctx, { h2: s[key].h2, id: `fm-${key}-title` })}${inner}${pending(ctx, c.pendingNote)}</div></section>`;
  const main = `
${hero(ctx, { mediaId: 'fm-hero', eyebrow: c.eyebrow, h1: c.h1, lead: esc(c.lead), sub: true, crumbs: breadcrumbs(ctx, crumbs), ctas: quoteButton(ctx, { service: 'facility', label: s.cta.h2, cls: 'btn btn--light' }) })}
${block('overview')}
${block('solutions', `<div class="grid grid--3" style="margin-block-end:20px">${join(s.solutions.items, (x) => `<article class="feature-card"><h3>${esc(x)}</h3></article>`)}</div>`)}
${block('industries')}
${block('model', `<ol class="steps" style="margin-block-end:20px">${join(s.model.steps, (x) => `<li class="step"><h3>${esc(x)}</h3></li>`)}</ol>`)}
${block('quality')}
${block('team')}
${block('projects')}
${block('faq')}
${ctaBand(ctx, { h2: s.cta.h2, body: s.cta.body, service: 'facility', label: s.cta.h2 })}`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.facility, href: ctx.path }]), extra: [serviceNode(ctx, { name: c.h1, description: c.meta.description, serviceType: 'Facility management' })] }) }, main, live: true };
}

/* =========================== PRIVACY =========================== */
export function privacy(ctx) {
  const c = ctx.pages.privacy;
  const approved = !!ctx.config.legal?.privacyApproved;
  const main = `
<div class="container">${breadcrumbs(ctx, [{ label: ctx.ui.nav.privacy }])}</div>
<section class="section section--tight" aria-labelledby="page-title">
  <div class="container">
    <h1 id="page-title">${esc(c.h1)}</h1>
    <p class="muted">${esc(c.updated)}</p>
    ${!approved ? `<div class="pending-block draft-notice" role="note" style="margin-block-start:20px">${icon('info')}<div><strong>${esc(ctx.ui.review.pendingTitle)}</strong>${esc(c.draftNotice)}</div></div>` : ''}
  </div>
</section>
<div class="container legal-layout" style="padding-block-end:var(--section-y)">
  <nav class="toc" aria-labelledby="toc-title"><h2 id="toc-title">${esc(c.tocLabel)}</h2><ol>${join(c.sections, (s) => `<li><a href="#${s.id}" data-toc>${esc(s.h2)}</a></li>`)}</ol></nav>
  <div class="legal-body">${join(c.sections, (s) => `<section id="${s.id}" aria-labelledby="${s.id}-title"><h2 id="${s.id}-title">${esc(s.h2)}</h2>${join(s.body, (p) => `<p>${esc(p)}</p>`)}${s.cookieButton ? `<button class="btn btn--secondary" type="button" data-cookie-settings>${esc(ctx.ui.footer.cookieSettings)}</button>` : ''}</section>`)}
    <p style="margin-block-start:32px"><a class="link-arrow" href="${route('home', ctx.lang)}">${esc(ctx.ui.nav.home)}${icon('arrow', { dir: true })}</a></p>
  </div>
</div>`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.privacy, href: ctx.path }]) }) }, main, indexable: approved };
}

/* =========================== 404 =========================== */
export function notFound(ctx) {
  const c = ctx.pages.notFound;
  const L = ctx.lang;
  const main = `<section class="not-found" aria-labelledby="page-title"><div class="container container--narrow">
    <p class="not-found__code" aria-hidden="true">404</p>
    <h1 id="page-title">${esc(c.h1)}</h1>
    <p class="lead">${esc(c.body)}</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${route('home', L)}">${esc(c.home)}</a>
      <a class="btn btn--secondary" href="${route('corporates', L)}">${esc(ctx.ui.nav.corporates)}</a>
      <a class="btn btn--secondary" href="${route('celebrations', L)}">${esc(ctx.ui.nav.celebrations)}</a>
      <a class="btn btn--secondary" href="${route('b2b', L)}">${esc(ctx.ui.nav.b2b)}</a>
    </div>
  </div></section>`;
  return { meta: { ...c.meta }, main };
}
