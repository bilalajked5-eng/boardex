// Canonical route plan — Blueprint §2. Legacy service paths are preserved exactly.
export const PAGE_ROUTES = {
  home: { ar: '/ar/', en: '/en/' },
  about: { ar: '/ar/about-us/', en: '/en/about-us/' },
  corporates: { ar: '/ar/services/sharikat/', en: '/en/services/corporates/' },
  celebrations: { ar: '/ar/services/munasabat/', en: '/en/services/celebrations/' },
  b2b: { ar: '/ar/services/qitaa-al-aamal/', en: '/en/services/b2b/' },
  facility: { ar: '/ar/services/idarat-al-marafiq/', en: '/en/services/facility-management/' },
  privacy: { ar: '/ar/privacy/', en: '/en/privacy/' },
};

export const route = (key, lang) => {
  const r = PAGE_ROUTES[key];
  if (!r) throw new Error(`Unknown route key ${key}`);
  return r[lang];
};

export const productRoute = (product, lang) => `/${lang}/products/${product.slug[lang]}/`;
export const familyAnchor = (lang, familyId) => `${route('b2b', lang)}#family-${familyId}`;
export const otherLang = (lang) => (lang === 'ar' ? 'en' : 'ar');
