// Canonical route plan — Blueprint §2 legacy paths preserved; v2 IA adds service
// sub-pages, product-family pages, Gallery and Contact.
export const PAGE_ROUTES = {
  home: { ar: '/ar/', en: '/en/' },
  about: { ar: '/ar/about-us/', en: '/en/about-us/' },
  corporates: { ar: '/ar/services/sharikat/', en: '/en/services/corporates/' },
  celebrations: { ar: '/ar/services/munasabat/', en: '/en/services/celebrations/' },
  b2b: { ar: '/ar/services/qitaa-al-aamal/', en: '/en/services/b2b/' },
  facility: { ar: '/ar/services/idarat-al-marafiq/', en: '/en/services/facility-management/' },
  gallery: { ar: '/ar/gallery/', en: '/en/gallery/' },
  contact: { ar: '/ar/contact/', en: '/en/contact/' },
  privacy: { ar: '/ar/privacy/', en: '/en/privacy/' },
};

export const route = (key, lang) => {
  const r = PAGE_ROUTES[key];
  if (!r) throw new Error(`Unknown route key ${key}`);
  return r[lang];
};

export const serviceRoute = (hubKey, slug, lang) => `${route(hubKey, lang)}${slug}/`;
export const familyRoute = (familySlug, lang) => `/${lang}/products/${familySlug}/`;
export const productRoute = (product, lang) => `/${lang}/products/${product.slug[lang]}/`;
export const familyAnchor = (lang, familyId, categories) => {
  const c = categories?.find((x) => x.id === familyId);
  return c ? familyRoute(c.slug, lang) : `${route('b2b', lang)}#family-${familyId}`;
};
export const otherLang = (lang) => (lang === 'ar' ? 'en' : 'ar');
