// JSON-LD builders. Only substantiated fields are emitted — no offers, prices,
// ratings, reviews or availability. LocalBusiness is deliberately omitted until a
// verified address/phone exists (see docs/content-gaps.md).
import { route } from './routes.mjs';

const abs = (ctx, p) => `${ctx.config.productionBaseUrl}${p}`;

export function orgNode(ctx) {
  const base = ctx.config.productionBaseUrl;
  const node = {
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: ctx.config.siteName.en,
    alternateName: ctx.config.siteName.ar,
    url: `${base}/`,
    logo: { '@type': 'ImageObject', url: abs(ctx, ctx.config.brand.logo.src) },
  };
  const c = ctx.config.contact;
  if (c.phone) node.telephone = c.phone;
  if (c.email) node.email = c.email;
  if (c.social?.length) node.sameAs = c.social.map((s) => s.url);
  const parent = ctx.config.brand.parentCompany;
  if (parent?.status === 'verified') node.parentOrganization = { '@type': 'Organization', name: parent.value.en };
  return node;
}

export function breadcrumbNode(ctx, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(ctx, ctx.path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(ctx, c.href || ctx.path) })),
  };
}

export function graph(ctx, { type = 'WebPage', title, description, crumbs, extra = [] }) {
  const base = ctx.config.productionBaseUrl;
  const lang = ctx.config.languages[ctx.lang].hreflang;
  const nodes = [orgNode(ctx)];
  if (ctx.pageKey === 'home') {
    nodes.push({ '@type': 'WebSite', '@id': `${base}/#website`, url: abs(ctx, route('home', ctx.lang)), name: ctx.config.siteName[ctx.lang], inLanguage: lang, publisher: { '@id': `${base}/#organization` } });
  }
  const page = {
    '@type': type,
    '@id': `${abs(ctx, ctx.path)}#webpage`,
    url: abs(ctx, ctx.path),
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { '@id': `${base}/#website` },
    publisher: { '@id': `${base}/#organization` },
  };
  if (crumbs) {
    const bc = breadcrumbNode(ctx, crumbs);
    page.breadcrumb = { '@id': bc['@id'] };
    nodes.push(bc);
  }
  nodes.push(page, ...extra);
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function serviceNode(ctx, { name, description, serviceType }) {
  return {
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: { '@id': `${ctx.config.productionBaseUrl}/#organization` },
    areaServed: { '@type': 'City', name: ctx.lang === 'ar' ? 'الرياض' : 'Riyadh' },
    url: abs(ctx, ctx.path),
  };
}

export function productNode(ctx, p, category) {
  const node = {
    '@type': 'Product',
    '@id': `${abs(ctx, ctx.path)}#product`,
    name: p.name[ctx.lang],
    category: category.name[ctx.lang],
    brand: { '@type': 'Brand', name: ctx.config.siteName[ctx.lang] },
    url: abs(ctx, ctx.path),
  };
  const desc = p.longDescription?.[ctx.lang] || p.shortDescription?.[ctx.lang];
  if (desc) node.description = desc;
  if (p.productCode) node.sku = p.productCode;
  const realImg = p.heroImage && ctx.media.byId[p.heroImage]?.src;
  if (realImg) node.image = abs(ctx, realImg);
  const v = p.variants?.[0];
  if (v?.weight) node.weight = { '@type': 'QuantitativeValue', value: v.weight.value, unitCode: v.weight.unit === 'g' ? 'GRM' : v.weight.unit };
  return node;
}
