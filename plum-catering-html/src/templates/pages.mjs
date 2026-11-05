// Page templates v2 — demo information architecture, blueprint SEO headings, plum theme.
import { esc, fmt, icon, join, when, rf, pending, fact, figure, reviewMode } from './helpers.mjs';
import { route, productRoute, familyRoute, serviceRoute, familyAnchor } from './routes.mjs';
import { quoteButton, whatsappControl, whatsappHref } from './layout.mjs';
import {
  splitHero, hero, sectionHead, statsStrip, homeStats, ncard, ncardGrid, serviceCards, familyCards, familyTiles, listPanel, checkList,
  audienceGrid, chipCloud, featureCards, steps, kitchenFacts, kitchenFilm, faq, gallery, lightbox, logoWall, ctaBand, productCard, finder, breadcrumbs, crumbList, ulink,
} from './components.mjs';
import { graph, serviceNode, productNode } from './schema.mjs';

const link = (href, label) => `<a href="${href}">${esc(label)}</a>`;
const secondary = (ctx, href, label) => `<a class="btn btn--secondary" href="${href}">${esc(label)}</a>`;
const pad = (n) => String(n).padStart(2, '0');

/* =========================== HOME =========================== */
export function home(ctx) {
  const c = ctx.pages.home;
  const L = ctx.lang;
  const hub = ctx.pages.serviceHub;
  const main = `
${splitHero(ctx, {
  eyebrow: c.hero.eyebrow, h1: c.hero.h1, accent: c.hero.accent, lead: esc(c.hero.lead), mediaId: ctx.config.media.heroPoster, video: ctx.config.media.heroVideo,
  panelLabel: c.hero.panelLabel, panelText: c.hero.panelText, panelNote: c.hero.panelNote, meta: c.hero.meta,
  ctas: quoteButton(ctx, { label: ctx.ui.cta.planEvent }) + secondary(ctx, route('b2b', L), ctx.ui.cta.exploreB2B),
})}
<div class="container section--stats">${homeStats(ctx)}</div>

<section class="section" id="services" aria-labelledby="start-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: c.start.eyebrow, h2: c.start.h2, intro: esc(c.start.intro), id: 'start-title' })}
    ${ncardGrid(c.start.cards.map((k) => ncard(ctx, { num: k.num, label: k.label, h3: k.h3, body: k.body, href: route(k.key, L), cta: k.cta, cls: 'ncard--big' })), 'hub-grid')}
  </div>
</section>

<section class="section section--ivory" aria-labelledby="about-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(c.about.eyebrow)}</p>
      <h2 id="about-title">${esc(c.about.h2)}</h2>
      <p class="lead">${esc(c.about.body)}</p>
      <p>${esc(c.about.body2)}</p>
      ${ulink(route('about', L), ctx.ui.cta.meetPlum)}
    </div>
    <div class="reveal">${listPanel(c.about.approachLabel, c.about.approachSteps, { white: true })}</div>
  </div>
</section>

<section class="section" aria-labelledby="explore-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: c.explore.eyebrow, h2: c.explore.h2, intro: esc(c.explore.intro), id: 'explore-title' })}
    ${join(['corporates', 'celebrations'], (k) => `<div class="section-head section-head--split" style="margin-block:8px 20px"><div><h3 style="margin:0">${esc(ctx.ui.nav[k])}</h3></div>${ulink(route(k, L), fmt(c.explore.seeAll, { name: esc(ctx.ui.nav[k]) }))}</div>${ncardGrid(serviceCards(ctx, k))}<div style="block-size:32px"></div>`)}
  </div>
</section>

<section class="section section--ivory" aria-labelledby="b2b-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(c.b2bBlock.eyebrow)}</p>
      <h2 id="b2b-title">${esc(c.b2bBlock.h2)}</h2>
      <p class="lead">${esc(c.b2bBlock.lead)}</p>
      <p class="small muted">${esc(c.b2bBlock.meta)}</p>
      <div class="btn-row" style="margin-block-start:20px"><a class="btn btn--primary" href="${route('b2b', L)}">${esc(ctx.ui.cta.browseAll)}</a>${ctx.config.catalogue.pdf[L] ? `<a class="btn btn--secondary" href="${esc(ctx.config.catalogue.pdf[L])}" download data-track="catalogue_download">${esc(ctx.ui.cta.downloadCatalogue)}</a>` : ''}</div>
    </div>
    <div class="reveal">${familyTiles(ctx)}</div>
  </div>
</section>

<section class="section" aria-labelledby="how-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.how.eyebrow, h2: c.how.h2, id: 'how-title' })}${steps(ctx, c.how.steps)}</div>
</section>

<section class="section section--plum" id="kitchen" aria-labelledby="kitchen-title">
  <div class="container split">
    <div class="reveal">${kitchenFilm(ctx)}</div>
    <div class="reveal">
      <h2 id="kitchen-title">${esc(c.kitchen.h2)}</h2>
      <p class="lead">${esc(c.kitchen.intro)}</p>
      ${join(c.kitchen.items, (it) => `<h3>${esc(it.h3)}</h3><p>${esc(it.body)}</p>`)}
      <p style="margin-block-start:20px"><a class="ulink" href="${route('about', L)}#kitchen">${esc(c.kitchen.link)}${icon('arrow')}</a></p>
    </div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="cuisine-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: c.cuisine.eyebrow, h2: c.cuisine.h2, intro: esc(c.cuisine.body), id: 'cuisine-title' })}
    ${chipCloud(c.cuisine.chips)}
    ${reviewMode(ctx) ? `<div style="margin-block-start:16px">${pending(ctx, c.cuisine.pendingNote)}</div>` : ''}
  </div>
</section>

<section class="section" aria-labelledby="why-title">
  <div class="container">${sectionHead(ctx, { h2: c.why.h2, id: 'why-title' })}${featureCards(ctx, c.why.cards, 4)}</div>
</section>

<section class="section section--white" aria-labelledby="aud-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.audiences.eyebrow, h2: c.audiences.h2, id: 'aud-title' })}${audienceGrid(c.audiences.items)}</div>
</section>

${when(ctx.clientLogos.length || reviewMode(ctx), () => `<section class="section section--ivory" aria-labelledby="clients-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.clients.eyebrow, h2: c.clients.h2, intro: esc(c.clients.intro), id: 'clients-title' })}${logoWall(ctx)}</div>
</section>`)}

${when(ctx.config.facilityManagement.launchMode !== 'live', () => `<section class="section" aria-labelledby="future-title">
  <div class="container two-col two-col--even">
    <div>
      <p class="eyebrow">${esc(c.future.eyebrow)}</p>
      <h2 id="future-title">${esc(c.future.h2)}</h2>
      <p class="lead">${esc(c.future.body1)}</p><p>${esc(c.future.body2)}</p>
      ${ulink(route('facility', L), ctx.ui.cta.viewFuture)}
    </div>
    ${ncard(ctx, { num: c.future.num, label: c.future.label, h3: c.future.status, body: c.future.statusBody, cls: 'ncard--soon' })}
  </div>
</section>`)}

<section class="section section--ivory" id="our-work" aria-labelledby="work-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: c.work.eyebrow, h2: c.work.h2, intro: esc(c.work.intro), id: 'work-title', aside: ulink(route('gallery', L), ctx.ui.cta.exploreGallery) })}
    ${gallery(ctx, { page: 'home', limit: 8 })}
  </div>
</section>

<section class="section" aria-labelledby="home-faq-title"><div class="container">${faq(ctx, { eyebrow: c.faq.eyebrow, h2: c.faq.h2, items: c.faq.items, idPrefix: 'home' })}</div></section>
${ctaBand(ctx, { eyebrow: c.finalCta.eyebrow, h2: c.finalCta.h2, body: c.finalCta.body })}`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { type: 'WebPage', title: c.meta.title, description: c.meta.description }) }, main, afterMain: lightbox(ctx) };
}

/* =========================== ABOUT =========================== */
export function about(ctx) {
  const c = ctx.pages.about;
  const L = ctx.lang;
  const parent = fact(ctx, 'parent');
  const certs = fact(ctx, 'certifications');
  const area = fact(ctx, 'kitchenArea');
  const whoBody = parent ? fmt(c.who.body, { parent: `${esc(parent.value)}${parent.flag}` }) : esc(c.who.bodyNoParent);
  const main = `
${splitHero(ctx, { eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), mediaId: 'about-hero', panelLabel: c.hero.panelLabel, panelBig: c.hero.panelLabel, crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav.about }]),
  ctas: quoteButton(ctx) + secondary(ctx, route('contact', L), ctx.ui.cta.talk) })}

<section class="section" aria-labelledby="who-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(c.business.eyebrow)}</p>
      <h2 id="who-title">${esc(c.who.h2)}</h2>
      <p class="lead">${whoBody}</p>
      <p>${esc(c.business.body2)}</p>
      ${pending(ctx, c.who.pendingNote)}
    </div>
    <div class="reveal">${listPanel(c.business.listLabel, c.business.list)}</div>
  </div>
</section>

${when(reviewMode(ctx), () => `<section class="section section--white" aria-labelledby="story-title">
  <div class="container two-col">
    <div><h2 id="story-title">${esc(c.story.h2)}</h2>${pending(ctx, c.story.pendingNote)}</div>
    <div><h2 style="font-size:var(--fs-h3)">${esc(c.mvv.h2)}</h2><div class="grid grid--3">${join(['mission', 'vision', 'values'], (k) => `<article class="feature-card"><h3>${esc(c.mvv[k].h3)}</h3>${pending(ctx, c.mvv.pendingNote)}</article>`)}</div></div>
  </div>
</section>`)}

<section class="section section--ivory" id="kitchen" aria-labelledby="kitchen-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(c.kitchenV2.eyebrow)}</p>
      <h2 id="kitchen-title">${esc(c.kitchen.h2)}</h2>
      <h3>${esc(c.kitchenV2.h3)}</h3>
      <p>${esc(c.kitchen.body)}</p>
      ${checkList(c.kitchenV2.list)}
    </div>
    <div class="reveal">${statsStrip(ctx, [area && { value: area.value, label: c.kitchenV2.areaLabel, flag: area.flag }, ...(certs ? certs.value.map((v) => ({ value: v, label: c.kitchenV2.certLabel, flag: certs.flag, ltr: true })) : [])])}
      ${pending(ctx, c.quality.pendingNote)}</div>
  </div>
</section>

<section class="section" aria-labelledby="film-title">
  <div class="container split">
    <div class="reveal">${kitchenFilm(ctx, c.kitchen.filmCaption)}</div>
    <div class="reveal"><p class="eyebrow">${esc(c.film.eyebrow)}</p><h2 id="film-title">${esc(c.film.h2)}</h2><h3>${esc(c.film.h3)}</h3><p>${esc(c.film.body)}</p><h3>${esc(c.kitchen.logisticsH3)}</h3><p>${esc(c.kitchen.logisticsBody)}</p></div>
  </div>
</section>

<section class="section section--white" id="quality" aria-labelledby="quality-title">
  <div class="container container--narrow">
    <h2 id="quality-title">${esc(c.quality.h2)}</h2>
    <h3>${esc(c.quality.certH3)}</h3>
    ${certs ? `<p>${esc(c.quality.certBody)}</p><ul class="tag-list" style="margin-block:16px">${certs.value.map((x) => `<li dir="ltr">${esc(x)}</li>`).join('')}</ul>${certs.flag}` : pending(ctx, c.quality.pendingNote)}
  </div>
</section>

<section class="section section--ivory" aria-labelledby="process-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.process.eyebrow, h2: c.process.h2, id: 'process-title' })}${steps(ctx, c.process.steps)}</div>
</section>

${when(reviewMode(ctx), () => `<section class="section" aria-labelledby="team-title">
  <div class="container split">${figure(ctx, 'team', { sizes: '(min-width:768px) 50vw, 100vw' })}<div><h2 id="team-title">${esc(c.team.h2)}</h2><p>${esc(c.team.body)}</p>${pending(ctx, c.team.pendingNote)}</div></div>
</section>`)}

<section class="section section--white" aria-labelledby="aud-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.audiences.eyebrow, h2: c.audiences.h2, id: 'aud-title' })}${audienceGrid(c.audiences.items)}</div>
</section>

${when(ctx.clientLogos.length || reviewMode(ctx), () => `<section class="section section--ivory" id="clients" aria-labelledby="clients-title">
  <div class="container">${sectionHead(ctx, { h2: c.clients.h2, intro: esc(c.clients.intro), id: 'clients-title' })}${logoWall(ctx)}</div>
</section>`)}

${ctaBand(ctx, { eyebrow: c.finalCta.eyebrow, h2: c.finalCta.h2, body: c.finalCta.body })}`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { type: 'AboutPage', title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.about, href: ctx.path }]) }) }, main };
}

/* =========================== SERVICE HUBS =========================== */
function hubPage(ctx, key, { service, heroMedia }) {
  const c = ctx.pages[key];
  const hub = ctx.pages.serviceHub;
  const L = ctx.lang;
  const main = `
${splitHero(ctx, { num: c.hero.num, eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), mediaId: heroMedia, panelLabel: c.hero.panelLabel, panelBig: c.hero.num, crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav[key] }]),
  ctas: quoteButton(ctx, { label: c.hero.cta, service }) + secondary(ctx, route('contact', L), ctx.ui.cta.talk) })}

<section class="section" aria-labelledby="overview-title">
  <div class="container container--narrow"><h2 id="overview-title">${esc(c.overview.h2)}</h2><p class="lead">${esc(c.overview.body)}</p>${c.related ? `<p class="muted">${fmt(c.related.b2b, { link: link(route('b2b', L), ctx.ui.nav.b2b) })}</p>` : ''}</div>
</section>

<section class="section section--ivory" id="services" aria-labelledby="services-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: hub.findEyebrow, h2: c.services.h2, sub: hub.findH2, intro: esc(hub.findIntro), id: 'services-title' })}
    ${ncardGrid(serviceCards(ctx, key))}
  </div>
</section>

<section class="section" aria-labelledby="brief-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(hub.briefEyebrow)}</p>
      <h2 id="brief-title">${esc(c.process.h2)}</h2>
      <h3>${esc(hub.briefH3)}</h3>
      <p>${esc(hub.briefBody)}</p>
      ${checkList(hub.briefItems)}
    </div>
    <div class="reveal">${listPanel(hub.processLabel, hub.process)}</div>
  </div>
</section>

${when(c.kitchen, () => `<section class="section section--ivory" aria-labelledby="kitchen-title">
  <div class="container split">
    <div class="reveal"><h2 id="kitchen-title">${esc(c.kitchen.h2)}</h2><p class="lead">${esc(c.kitchen.body)}</p>${ulink(route('about', L) + '#kitchen', ctx.pages.home.kitchen.link)}</div>
    <div class="reveal">${figure(ctx, 'kitchen-facility', { sizes: '(min-width:768px) 50vw, 100vw' })}</div>
  </div>
</section>`)}
${when(c.menus, () => `<section class="section section--ivory" aria-labelledby="menus-title">
  <div class="container container--narrow"><h2 id="menus-title">${esc(c.menus.h2)}</h2><p class="lead">${esc(c.menus.body)}</p>${pending(ctx, c.menus.pendingNote)}</div>
</section>`)}
${when(c.why, () => `<section class="section" aria-labelledby="why-title">
  <div class="container">${sectionHead(ctx, { h2: c.why.h2, id: 'why-title', aside: ulink(route('about', L), ctx.ui.cta.aboutLink) })}${featureCards(ctx, c.why.points, 3)}</div>
</section>`)}

<section class="section" aria-labelledby="gallery-title">
  <div class="container">${sectionHead(ctx, { h2: c.gallery.h2, id: 'gallery-title', aside: ulink(route('gallery', L), ctx.ui.cta.exploreGallery) })}${gallery(ctx, { page: key, limit: 8 })}</div>
</section>

<section class="section section--white" aria-labelledby="${key}-faq-title"><div class="container">${faq(ctx, { eyebrow: hub.faqEyebrow, h2: c.faq.h2, items: c.faq.items, idPrefix: key })}</div></section>
${ctaBand(ctx, { eyebrow: hub.ctaEyebrow, h2: c.finalCta.h2, body: c.finalCta.body, service, label: c.hero.cta })}`;
  return {
    meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav[key], href: ctx.path }]),
      extra: [serviceNode(ctx, { name: c.hero.h1, description: c.meta.description, serviceType: key === 'corporates' ? (L === 'ar' ? 'تموين الشركات' : 'Corporate catering') : (L === 'ar' ? 'تموين المناسبات' : 'Event catering') })] }) },
    main, afterMain: lightbox(ctx),
  };
}
export const corporates = (ctx) => hubPage(ctx, 'corporates', { service: 'corporate', heroMedia: 'corp-hero' });
export const celebrations = (ctx) => hubPage(ctx, 'celebrations', { service: 'celebration', heroMedia: 'cel-hero' });

/* =========================== SERVICE SUB-PAGE =========================== */
export function servicePage(ctx, hubKey, item) {
  const sp = ctx.pages.servicePage;
  const hub = ctx.pages[hubKey];
  const L = ctx.lang;
  const service = hubKey === 'corporates' ? 'corporate' : 'celebration';
  const title = item.title || item.h3;
  const related = hub.services.items.filter((s) => s.slug !== item.slug).slice(0, 3);
  const totalRel = related.length;
  const metaTitle = L === 'ar' ? `${title} في الرياض | بلام للتموين` : `${title} in Riyadh | Plum Catering`;
  const metaDesc = `${item.short || item.body} ${L === 'ar' ? `${item.who} اطلب عرض سعر مخصصًا من بلام للتموين في الرياض.` : `${item.who} Request a tailored quote from Plum Catering in Riyadh.`}`;
  const main = `
${splitHero(ctx, { eyebrow: `${ctx.ui.nav[hubKey]} · ${sp.eyebrowSuffix}`, h1: title, lead: esc(item.body), mediaId: item.img, panelLabel: title, panelBig: pad(hub.services.items.indexOf(item) + 1),
  crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav[hubKey], href: route(hubKey, L) }, { label: title }]),
  ctas: quoteButton(ctx, { label: ctx.ui.cta.tailoredQuote, service, detail: item.slug }) + secondary(ctx, route(hubKey, L) + '#services', ctx.ui.cta.backToServices) })}

<section class="section" aria-labelledby="built-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(sp.builtEyebrow)}</p>
      <h2 id="built-title">${esc(sp.builtH2)}</h2>
      <p class="lead">${esc(item.short || item.body)}</p>
      <h3>${esc(sp.whoH3)}</h3>
      <p>${esc(item.who)}</p>
    </div>
    <div class="reveal">${listPanel(sp.enquiryEyebrow, sp.enquiryItems)}</div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="options-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: sp.optionsEyebrow, h2: sp.optionsH2, id: 'options-title' })}
    ${ncardGrid(item.options.map((o, i) => ncard(ctx, { num: pad(i + 1), h3: o, body: sp.optionBody, cls: 'ncard--muted' })), 'grid grid--4')}
  </div>
</section>

<section class="section" aria-labelledby="plan-title">
  <div class="container">${sectionHead(ctx, { eyebrow: sp.planEyebrow, h2: sp.planH2, id: 'plan-title' })}${steps(ctx, item.plan.map((p) => ({ h3: p })))}</div>
</section>

<section class="section section--white" aria-labelledby="svc-faq-title"><div class="container">${faq(ctx, { eyebrow: sp.faqEyebrow, h2: sp.faqH2, items: item.faq, idPrefix: 'svc' })}</div></section>

<section class="section section--ivory" aria-labelledby="related-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: sp.relatedEyebrow, h2: sp.relatedH2, id: 'related-title', aside: ulink(route(hubKey, L) + '#services', ctx.ui.cta.backToServices) })}
    ${ncardGrid(related.map((s, i) => ncard(ctx, { num: `${pad(i + 1)} / ${pad(totalRel)}`, h3: s.title || s.h3, body: s.short || s.body, href: serviceRoute(hubKey, s.slug, L), cta: ctx.ui.cta.exploreService })))}
  </div>
</section>
${ctaBand(ctx, { eyebrow: ctx.pages.serviceHub.ctaEyebrow, h2: sp.ctaH2, body: sp.ctaBody, service, detail: item.slug, label: ctx.ui.cta.tailoredQuote })}`;
  return { meta: { title: metaTitle, description: metaDesc, jsonld: graph(ctx, { title: metaTitle, description: metaDesc, crumbs: crumbList(ctx, [{ label: ctx.ui.nav[hubKey], href: route(hubKey, L) }, { label: title, href: ctx.path }]), extra: [serviceNode(ctx, { name: title, description: item.short || item.body, serviceType: title })] }) }, main };
}

/* =========================== B2B HUB =========================== */
export function b2b(ctx) {
  const c = ctx.pages.b2b;
  const L = ctx.lang;
  const ui = ctx.ui;
  const pdf = ctx.config.catalogue.pdf[L] || ctx.config.catalogue.pdf.en || ctx.config.catalogue.pdf.ar;
  const shelfRows = ctx.categories.filter((cat) => cat.shelfLife && (cat.shelfLife.status === 'verified' || reviewMode(ctx)));
  const main = `
${splitHero(ctx, { num: c.hero.num, eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), mediaId: 'b2b-hero', panelLabel: c.hero.panelLabel, panelBig: c.hero.num, crumbs: breadcrumbs(ctx, [{ label: ui.nav.b2b }]),
  ctas: quoteButton(ctx, { label: ui.cta.b2bQuote, service: 'b2b' }) + secondary(ctx, route('contact', L), ui.cta.talk) })}
<div class="container section--stats">${statsStrip(ctx, [
  { value: String(ctx.products.length), label: c.stats.products }, { value: pad(ctx.categories.length), label: c.stats.families }, { value: c.stats.trade, label: c.stats.tradeLabel }, { value: c.stats.pdf, label: c.stats.pdfLabel },
])}</div>

<section class="section" id="range" aria-labelledby="range-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: c.families.eyebrow, h2: c.families.h2, intro: esc(c.families.intro), id: 'range-title' })}
    ${ncardGrid(familyCards(ctx))}
  </div>
</section>

<section class="section section--ivory" id="finder" aria-labelledby="finder-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.finder.eyebrow, h2: c.finder.h2, id: 'finder-title' })}${finder(ctx)}</div>
</section>

<section class="section" aria-labelledby="trade-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(c.trade.eyebrow)}</p>
      <h2 id="trade-title">${esc(c.trade.h2)}</h2>
      <p class="lead">${esc(c.overview.body)}</p>
      <h3>${esc(c.trade.h3)}</h3>
      <p>${esc(c.trade.body)}</p>
      ${checkList(c.trade.list)}
      ${pending(ctx, c.who.pendingNote)}
    </div>
    <div class="reveal">
      <article class="ncard" id="catalogue-download">
        <span class="ncard__label">${esc(c.catalogueCard.eyebrow)}</span>
        <h3>${esc(c.download.h2)}</h3>
        <p>${esc(c.catalogueCard.body)}</p>
        ${pdf ? `<a class="btn btn--primary" href="${esc(pdf)}" download data-track="catalogue_download">${icon('download')}<span>${esc(ui.cta.openPdf)}</span></a>${ctx.config.catalogue.pdf.version ? `<p class="small muted">v${esc(ctx.config.catalogue.pdf.version)}</p>` : ''}` : pending(ctx, ui.catalogue.pdfPending)}
      </article>
    </div>
  </div>
</section>

${when(shelfRows.length, () => `<section class="section section--ivory" aria-labelledby="options-title">
  <div class="container container--narrow">
    <h2 id="options-title">${esc(c.options.h2)}</h2><p>${esc(c.options.body)}</p>
    <div class="table-wrap"><table class="shelf-table"><thead><tr><th scope="col">${esc(ctx.pages.product.spec.category)}</th><th scope="col">${esc(c.options.fresh)}</th><th scope="col">${esc(c.options.frozen)}</th></tr></thead>
      <tbody>${join(shelfRows, (cat) => `<tr><th scope="row"><a href="${familyRoute(cat.slug, L)}">${esc(cat.name[L])}</a></th><td>${esc(cat.shelfLife.fresh?.[L] || '—')}${cat.shelfLife.status !== 'verified' ? rf(ctx) : ''}</td><td>${esc(cat.shelfLife.bakedFrozen?.[L] || ctx.pages.family.notOffered)}</td></tr>`)}</tbody></table></div>
  </div>
</section>`)}

<section class="section section--plum" aria-labelledby="quality-title">
  <div class="container split">
    <div><h2 id="quality-title">${esc(c.quality.h2)}</h2><p class="lead">${esc(c.quality.body)}</p><a class="ulink" href="${route('about', L)}#quality">${esc(ui.cta.aboutLink)}${icon('arrow')}</a></div>
    <div>${kitchenFacts(ctx, ctx.pages.home.kitchen)}</div>
  </div>
</section>

<section class="section" aria-labelledby="b2bp-title"><div class="container">${sectionHead(ctx, { eyebrow: c.processB2B.eyebrow, h2: c.processB2B.h2, id: 'b2bp-title' })}${steps(ctx, c.processB2B.steps)}</div></section>
<section class="section section--white" aria-labelledby="b2b-faq-title"><div class="container">${faq(ctx, { eyebrow: c.faq.eyebrow, h2: c.faq.h2, items: c.faq.items, idPrefix: 'b2b' })}</div></section>
${ctaBand(ctx, { eyebrow: c.finalCta.eyebrow, h2: c.finalCta.h2, body: c.finalCta.body, service: 'b2b', label: ui.cta.b2bQuote, id: 'b2b-partnership' })}`;
  const itemList = { '@type': 'ItemList', name: c.families.h2, itemListElement: ctx.categories.map((cat, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ctx.config.productionBaseUrl}${familyRoute(cat.slug, L)}`, name: cat.name[L] })) };
  return { meta: { ...c.meta, jsonld: graph(ctx, { type: 'CollectionPage', title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ui.nav.b2b, href: ctx.path }]), extra: [serviceNode(ctx, { name: c.hero.h1, description: c.meta.description, serviceType: L === 'ar' ? 'توريد المخبوزات بالجملة' : 'Wholesale bakery supply' }), itemList] }) }, main };
}

/* =========================== PRODUCT FAMILY =========================== */
export function family(ctx, cat) {
  const f = ctx.pages.family;
  const c = ctx.pages.b2b;
  const L = ctx.lang;
  const name = cat.name[L];
  const items = ctx.products.filter((p) => p.category === cat.id);
  const blurb = ctx.pages.familyBlurbs[cat.id];
  const shelf = cat.shelfLife && (cat.shelfLife.status === 'verified' || reviewMode(ctx)) ? cat.shelfLife : null;
  const heroImg = items.find((p) => p.heroImage)?.heroImage || 'b2b-hero';
  const h1 = fmt(f.h1, { family: esc(name) });
  const title = fmt(f.metaTitle, { family: esc(name) });
  const desc = fmt(f.metaDesc, { family: esc(name), blurb: esc(blurb), n: items.length });
  const main = `
${splitHero(ctx, { eyebrow: f.eyebrow, h1: h1.replace(/&amp;/g, '&'), lead: fmt(f.lead, { blurb: esc(blurb) }), mediaId: heroImg, panelLabel: name, panelBig: pad(items.length),
  crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav.b2b, href: route('b2b', L) }, { label: name }]),
  ctas: quoteButton(ctx, { label: ctx.ui.cta.enquireRange, service: 'b2b', detail: cat.slug }) + secondary(ctx, route('b2b', L) + '#range', ctx.ui.cta.allFamilies) })}
<div class="container section--stats">${statsStrip(ctx, [
  { value: pad(items.length), label: f.statsProducts }, { value: name, label: f.statsRange },
  shelf && { value: shelf.fresh?.[L] || '—', label: f.statsFresh, flag: shelf.status !== 'verified' ? rf(ctx) : '' }, shelf && { value: shelf.bakedFrozen?.[L] || f.notOffered, label: f.statsFrozen, flag: shelf.status !== 'verified' ? rf(ctx) : '' },
])}</div>

<section class="section" id="family-${cat.id}" aria-labelledby="collection-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: f.collectionEyebrow, h2: fmt(f.collectionH2, { family: esc(name) }), intro: fmt(f.collectionIntro, { n: items.length }), id: 'collection-title' })}
    <ul class="product-grid" role="list">${join(items, (p, i) => `<li data-product>${productCard(ctx, p, { index: i + 1 })}</li>`)}</ul>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="b2bp-title"><div class="container">${sectionHead(ctx, { eyebrow: c.processB2B.eyebrow, h2: c.processB2B.h2, id: 'b2bp-title' })}${steps(ctx, c.processB2B.steps)}</div></section>

<section class="section" aria-labelledby="others-title">
  <div class="container">${sectionHead(ctx, { eyebrow: f.othersEyebrow, h2: f.othersH2, id: 'others-title', aside: ulink(route('b2b', L), ctx.ui.nav.b2b) })}${ncardGrid(familyCards(ctx, { exclude: cat.id }))}</div>
</section>
${ctaBand(ctx, { eyebrow: c.finalCta.eyebrow, h2: fmt(f.ctaH2, { family: esc(name) }).replace(/&amp;/g, '&'), body: f.ctaBody, service: 'b2b', detail: cat.slug, label: ctx.ui.cta.b2bQuote })}`;
  const itemList = { '@type': 'ItemList', name, itemListElement: items.filter((p) => ctx.isIndexableProduct(p)).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ctx.config.productionBaseUrl}${productRoute(p, L)}`, name: p.name[L] })) };
  return { meta: { title: title.replace(/&amp;/g, '&'), description: desc.replace(/&amp;/g, '&'), jsonld: graph(ctx, { type: 'CollectionPage', title, description: desc, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.b2b, href: route('b2b', L) }, { label: name, href: ctx.path }]), extra: itemList.itemListElement.length ? [itemList] : [] }) }, main };
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
  const famHref = familyRoute(cat.slug, L);
  const chips = [
    v0?.weight && { k: t.spec.weight, v: `${num(v0.weight.value)} ${unit(v0.weight.unit)}` },
    v0?.energy && { k: t.spec.energy, v: `${num(v0.energy.value)} ${unit(v0.energy.unit)}` },
    showShelf && shelf.fresh && { k: t.spec.fresh, v: shelf.fresh[L] },
    showShelf && shelf.bakedFrozen && { k: t.spec.frozen, v: shelf.bakedFrozen[L] },
  ].filter(Boolean);
  const specRows = [
    { k: t.spec.category, v: `<a href="${famHref}">${esc(cat.name[L])}</a>` },
    p.productCode && { k: t.spec.code, v: `<span dir="ltr">${esc(p.productCode)}</span>` },
    ...(p.variants.length === 1 ? [
      v0.weight && { k: t.spec.weight, v: `${esc(num(v0.weight.value))} ${esc(unit(v0.weight.unit))}${flagIfProvisional}` },
      v0.energy && { k: t.spec.energy, v: `${esc(num(v0.energy.value))} ${esc(unit(v0.energy.unit))}${v0.energy.basis ? ` (${esc(v0.energy.basis[L])})` : reviewMode(ctx) ? ` <span class="small muted">(${esc(t.energyBasisPending)})</span>` : ''}${flagIfProvisional}` },
    ] : []),
    p.packaging?.[L] && { k: t.spec.packaging, v: esc(p.packaging[L]) },
    showShelf && shelf.fresh && { k: t.spec.fresh, v: `${esc(shelf.fresh[L])}${shelf.status !== 'verified' ? rf(ctx) : ''}` },
    showShelf && shelf.bakedFrozen && { k: t.spec.frozen, v: `${esc(shelf.bakedFrozen[L])}${shelf.status !== 'verified' ? rf(ctx) : ''}` },
  ].filter(Boolean);
  const related = (p.relatedProducts || []).map((id) => ctx.productsById[id]).filter((r) => r && r.id !== p.id).slice(0, 4);
  const section = (id, h2, body) => (body ? `<section class="product-section" aria-labelledby="${id}-title"><h2 id="${id}-title">${esc(h2)}</h2>${body}</section>` : '');
  const textOrPending = (val, note) => (val?.[L] ? `<p>${esc(val[L])}</p>` : pending(ctx, note));
  const crumbs = [{ label: ui.nav.b2b, href: route('b2b', L) }, { label: cat.name[L], href: famHref }, { label: name }];
  const main = `
${!approved && reviewMode(ctx) ? `<div class="draft-banner" role="note">${esc(t.draftBanner)}</div>` : ''}
<div class="container">${breadcrumbs(ctx, crumbs)}</div>
<section class="product-hero" aria-labelledby="page-title">
  <div class="container product-hero__grid">
    <div class="product-gallery"><div class="product-gallery__main">${figure(ctx, p.heroImage || 'product-placeholder', { eager: true, sizes: '(min-width:1100px) 50vw, 100vw', caption: !p.heroImage && reviewMode(ctx) ? esc(t.pending.image) : '' })}</div></div>
    <div class="product-info">
      <p class="eyebrow">${esc(cat.name[L])} · ${esc(t.eyebrow)}</p>
      <h1 id="page-title">${esc(p.h1?.[L] || name)}</h1>
      ${p.shortDescription?.[L] ? `<p class="lead">${esc(p.shortDescription[L])}</p>` : pending(ctx, t.pending.intro)}
      ${chips.length ? `<ul class="spec-chips" aria-label="${esc(t.highlights)}">${join(chips, (ch) => `<li><span>${esc(ch.k)}</span><strong>${esc(ch.v)}</strong></li>`)}</ul>` : ''}
      <div class="btn-row">${quoteButton(ctx, { label: ui.cta.productQuote, service: 'b2b', detail: cat.slug, product: prodRef })}${whatsappControl(ctx, { variant: 'button', message: `${t.inquiry}: ${name} (${p.id})` })}</div>
      <p style="margin-block-start:20px"><a class="ulink" href="${famHref}">${fmt(t.familyLink, { family: esc(cat.name[L]) })}${icon('arrow')}</a></p>
    </div>
  </div>
</section>
<div class="container container--narrow" style="padding-block-end:var(--section-y)">
  ${section('overview', t.overviewH2, textOrPending(p.longDescription, t.pending.overview))}
  ${section('specs', t.specsH2, `<div class="table-wrap"><table class="spec-table"><tbody>${join(specRows, (r) => `<tr><th scope="row">${esc(r.k)}</th><td>${r.v}</td></tr>`)}</tbody></table></div>
    ${p.variants.length > 1 ? `<h3 style="margin-block-start:28px">${esc(t.sizesH3)}</h3><div class="table-wrap"><table class="spec-table"><thead><tr><th scope="col">${esc(t.spec.variant)}</th><th scope="col">${esc(t.spec.weight)}</th><th scope="col">${esc(t.spec.energy)}</th></tr></thead><tbody>${join(p.variants, (v, i) => `<tr><th scope="row">${i + 1}</th><td>${v.weight ? `${esc(num(v.weight.value))} ${esc(unit(v.weight.unit))}` : '—'}</td><td>${v.energy ? `${esc(num(v.energy.value))} ${esc(unit(v.energy.unit))}` : '—'}</td></tr>`)}</tbody></table></div>${flagIfProvisional}` : ''}
    ${!v0 ? pending(ctx, t.pending.specs) : ''}`)}
  ${section('ingredients', t.ingredientsH2, p.ingredients?.[L] || p.allergens?.[L] ? `${p.ingredients?.[L] ? `<p>${esc(p.ingredients[L])}</p>` : ''}${p.allergens?.[L] ? `<p><strong>${esc(p.allergens[L])}</strong></p>` : ''}` : pending(ctx, t.pending.ingredients))}
  ${section('storage', t.storageH2, textOrPending(p.storage, t.pending.storage))}
  ${section('applications', t.applicationsH2, textOrPending(p.foodserviceUse, t.pending.applications))}
  ${section('related', t.relatedH2, related.length ? `<ul class="product-grid" role="list">${join(related, (r) => `<li>${productCard(ctx, r, { headingLevel: 3 })}</li>`)}</ul>` : '')}
</div>
${ctaBand(ctx, { h2: t.pricingH2, body: t.pricingBody, service: 'b2b', detail: cat.slug, label: ui.cta.productQuote, product: prodRef, id: 'product-pricing' })}`;
  const desc = p.seo?.description?.[L] || p.shortDescription?.[L] || (L === 'ar' ? `${name} من فئة ${cat.name[L]} — توريد بالجملة من بلام للتموين في الرياض.` : `${name} from the ${cat.name[L]} range — wholesale supply from Plum Catering in Riyadh.`);
  const title = p.seo?.title?.[L] || (L === 'ar' ? `${name} | ${cat.name[L]} بالجملة | بلام للتموين` : `${name} | Wholesale ${cat.name[L]} | Plum Catering`);
  return { meta: { title, description: desc, ogType: 'product', jsonld: graph(ctx, { title, description: desc, crumbs: crumbList(ctx, [{ label: ui.nav.b2b, href: route('b2b', L) }, { label: cat.name[L], href: famHref }, { label: name, href: ctx.path }]), extra: [productNode(ctx, p, cat)] }) }, main };
}

/* =========================== GALLERY =========================== */
export function galleryPage(ctx) {
  const c = ctx.pages.gallery;
  const L = ctx.lang;
  const main = `
${splitHero(ctx, { eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), mediaId: 'cel-hero', panelLabel: c.hero.panelLabel, panelBig: c.hero.panelLabel, crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav.gallery }]),
  ctas: quoteButton(ctx) + secondary(ctx, route('contact', L), ctx.ui.cta.talk) })}
<section class="section" aria-labelledby="coll-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.collections.eyebrow, h2: c.collections.h2, id: 'coll-title' })}${gallery(ctx, { page: null, limit: 117 })}${reviewMode(ctx) ? `<p class="small muted" style="margin-block-start:16px">${esc(c.note)}</p>` : ''}</div>
</section>
${ctaBand(ctx, { eyebrow: c.cta.eyebrow, h2: c.cta.h2, body: c.cta.body })}`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { type: 'CollectionPage', title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.gallery, href: ctx.path }]) }) }, main, afterMain: lightbox(ctx) };
}

/* =========================== CONTACT =========================== */
export function contact(ctx) {
  const c = ctx.pages.contact;
  const L = ctx.lang;
  const ph = ctx.config.contact.phone;
  const wa = whatsappHref(ctx, `${ctx.ui.cta.whatsapp} — ${ctx.config.siteName[L]}`);
  const channel = (it) => {
    let ctaEl = '';
    if (it.service) ctaEl = quoteButton(ctx, { label: it.cta, service: it.service, ulink: true });
    else ctaEl = `<div class="stack">${ph ? `<a class="ulink" href="tel:${esc(ph.replace(/\s/g, ''))}">${esc(ctx.ui.cta.call)} <span dir="ltr">${esc(ph)}</span>${icon('arrow')}</a>` : ''}${wa ? `<a class="ulink" href="${esc(wa)}" target="_blank" rel="noopener" data-track="whatsapp_click">${esc(ctx.ui.cta.openWhatsapp)}${icon('arrow')}</a>` : whatsappControl(ctx, { variant: 'button' })}</div>`;
    return ncard(ctx, { num: it.num, label: it.label, h3: it.h3, body: it.body, ctaEl });
  };
  const main = `
${splitHero(ctx, { eyebrow: c.hero.eyebrow, h1: c.hero.h1, lead: esc(c.hero.lead), mediaId: 'svc-corporates', panelLabel: c.hero.panelLabel, panelBig: c.hero.panelLabel, crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav.contact }]),
  ctas: quoteButton(ctx) + (wa ? `<a class="btn btn--secondary" href="${esc(wa)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(ctx.ui.cta.whatsapp)}</span></a>` : '') })}
<section class="section" id="enquiry" aria-labelledby="channels-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.channels.eyebrow, h2: c.channels.h2, id: 'channels-title' })}${ncardGrid(c.channels.items.map(channel))}</div>
</section>
<section class="section section--ivory" aria-labelledby="brief-title">
  <div class="container two-col">
    <div class="reveal">
      <p class="eyebrow">${esc(c.brief.eyebrow)}</p><h2 id="brief-title">${esc(c.brief.h2)}</h2><p class="lead">${esc(c.brief.lead)}</p>
      ${checkList(c.brief.items)}
      <div style="margin-block-start:24px">${quoteButton(ctx, { label: ctx.ui.cta.openForm })}</div>
    </div>
    <div class="reveal"><div class="list-panel list-panel--white"><span class="list-panel__label">${esc(c.base.label)}</span><h3>${esc(c.base.h3)}</h3><p>${esc(c.base.body)}</p><p class="small muted">${esc(c.base.note)}</p>
      ${ph || ctx.config.contact.email ? `<ul class="check-list" role="list">${ph ? `<li><a href="tel:${esc(ph.replace(/\s/g, ''))}" dir="ltr">${esc(ph)}</a></li>` : ''}${ctx.config.contact.email ? `<li><a href="mailto:${esc(ctx.config.contact.email)}">${esc(ctx.config.contact.email)}</a></li>` : ''}</ul>` : ''}</div></div>
  </div>
</section>`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { type: 'ContactPage', title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.contact, href: ctx.path }]) }) }, main };
}

/* =========================== FACILITY =========================== */
export function facility(ctx, { forceLive = false } = {}) {
  const live = forceLive || ctx.config.facilityManagement.launchMode === 'live';
  const L = ctx.lang;
  const F = ctx.pages.facility;
  if (!live) {
    const c = F.comingSoon;
    const cards = ctx.pages.home.services.cards;
    const main = `
${splitHero(ctx, { num: c.num, eyebrow: c.eyebrow, h1: c.h1, lead: esc(c.lead), mediaId: 'fm-hero', panelLabel: c.panelLabel, panelBig: c.num, crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav.facility }]), ctas: secondary(ctx, route('contact', L), ctx.ui.cta.talk) })}
<section class="section" aria-labelledby="planned-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.plannedEyebrow, h2: c.plannedH2, intro: esc(c.plannedNote), id: 'planned-title' })}${ncardGrid(c.planned.map((x) => ncard(ctx, { label: c.badge, h3: x, body: c.plannedBody, cls: 'ncard--soon' })))}</div>
</section>
<section class="section section--ivory" aria-labelledby="info-title">
  <div class="container two-col"><div><p class="eyebrow">${esc(c.info.eyebrow)}</p><h2 id="info-title">${esc(c.info.h2)}</h2><p class="lead">${esc(c.info.body1)}</p><p>${esc(c.info.body2)}</p></div>${ncard(ctx, { label: c.info.statusLabel, h3: c.info.status, body: c.info.statusBody, cls: 'ncard--soon' })}</div>
</section>
<section class="section" aria-labelledby="live-title">
  <div class="container">${sectionHead(ctx, { eyebrow: c.liveEyebrow, h2: c.liveH2, intro: esc(c.liveBody), id: 'live-title' })}${ncardGrid(['corporates', 'celebrations', 'b2b'].map((k, i) => ncard(ctx, { num: pad(i + 1), h3: cards[k].h3, body: cards[k].body, href: route(k, L), cta: ctx.ui.cta.learnMore })))}</div>
</section>`;
    return { meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.facility, href: ctx.path }]) }) }, main, live: false };
  }
  const c = F.live;
  const s = c.sections;
  const block = (key, inner = '') => `<section class="section${['solutions', 'model', 'faq'].includes(key) ? ' section--ivory' : ''}" aria-labelledby="fm-${key}-title"><div class="container">${sectionHead(ctx, { h2: s[key].h2, id: `fm-${key}-title` })}${inner}${pending(ctx, c.pendingNote)}</div></section>`;
  const main = `
${splitHero(ctx, { num: '04', eyebrow: c.eyebrow, h1: c.h1, lead: esc(c.lead), mediaId: 'fm-hero', panelLabel: c.eyebrow, panelBig: '04', crumbs: breadcrumbs(ctx, [{ label: ctx.ui.nav.facility }]), ctas: quoteButton(ctx, { service: 'facility', label: s.cta.h2 }) })}
${block('overview')}
${block('solutions', ncardGrid(s.solutions.items.map((x, i) => ncard(ctx, { num: pad(i + 1), h3: x }))))}
${block('industries')}
${block('model', steps(ctx, s.model.steps.map((x) => ({ h3: x }))))}
${block('quality')}${block('team')}${block('projects')}${block('faq')}
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
  <div class="container"><p class="eyebrow">${esc(c.hero.eyebrow)}</p><h1 id="page-title">${esc(c.h1)}</h1><p class="muted">${esc(c.updated)}</p>
    ${!approved ? `<div class="pending-block draft-notice" role="note" style="margin-block-start:20px">${icon('info')}<div><strong>${esc(ctx.ui.review.pendingTitle)}</strong>${esc(c.draftNotice)}</div></div>` : ''}</div>
</section>
<div class="container legal-layout" style="padding-block-end:var(--section-y)">
  <nav class="toc" aria-labelledby="toc-title"><h2 id="toc-title">${esc(c.tocLabel)}</h2><ol>${join(c.sections, (s) => `<li><a href="#${s.id}" data-toc>${esc(s.h2)}</a></li>`)}</ol></nav>
  <div class="legal-body">${join(c.sections, (s) => `<section id="${s.id}" aria-labelledby="${s.id}-title"><h2 id="${s.id}-title">${esc(s.h2)}</h2>${join(s.body, (p) => `<p>${esc(p)}</p>`)}${s.cookieButton ? `<button class="btn btn--secondary" type="button" data-cookie-settings>${esc(ctx.ui.footer.cookieSettings)}</button>` : ''}</section>`)}
    <p style="margin-block-start:32px">${ulink(route('contact', ctx.lang), ctx.ui.nav.contact)} &nbsp; ${ulink(route('home', ctx.lang), ctx.ui.nav.home)}</p>
  </div>
</div>`;
  return { meta: { ...c.meta, jsonld: graph(ctx, { title: c.meta.title, description: c.meta.description, crumbs: crumbList(ctx, [{ label: ctx.ui.nav.privacy, href: ctx.path }]) }) }, main, indexable: approved };
}

/* =========================== 404 =========================== */
export function notFound(ctx) {
  const c = ctx.pages.notFound;
  const L = ctx.lang;
  const main = `<section class="not-found" aria-labelledby="page-title"><div class="container container--narrow">
    <p class="not-found__code" aria-hidden="true">404</p><h1 id="page-title">${esc(c.h1)}</h1><p class="lead">${esc(c.body)}</p>
    <div class="btn-row"><a class="btn btn--primary" href="${route('home', L)}">${esc(c.home)}</a>${secondary(ctx, route('corporates', L), ctx.ui.nav.corporates)}${secondary(ctx, route('celebrations', L), ctx.ui.nav.celebrations)}${secondary(ctx, route('b2b', L), ctx.ui.nav.b2b)}${secondary(ctx, route('contact', L), ctx.ui.nav.contact)}</div>
  </div></section>`;
  return { meta: { ...c.meta }, main };
}
