// Shared build-time helpers: escaping, i18n formatting, icons, images,
// review flags and placeholder art. No runtime dependencies.

export const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Escape a template string, then substitute {key} with *pre-built HTML*. */
export const fmt = (str, vars = {}) =>
  esc(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

export const attrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');

export const when = (cond, html) => (cond ? (typeof html === 'function' ? html() : html) : '');
export const join = (arr, fn) => (arr || []).map(fn).join('');

/* ---------------- Icons (24px line set, currentColor) ---------------- */
const P = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chef: '<path d="M7 14.5V20h10v-5.5"/><path d="M7 14.5a4 4 0 0 1-1.2-7.6A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 6.2 2.9A4 4 0 0 1 17 14.5z"/><path d="M7 17h10"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  truck: '<path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  sliders: '<path d="M5 6h9M18 6h1M5 12h3M12 12h7M5 18h11M20 18h-1"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.4-4.6"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path d="M8 5.5v13M16 5.5v13"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  cloche: '<path d="M3 17.5h18M5 17.5a7 7 0 0 1 14 0"/><path d="M12 8.5V7M10.5 7h3"/>',
  tray: '<path d="M3 15h18M4.5 15a7.5 6 0 0 1 15 0M2.5 18.5h19"/>',
  glass: '<path d="M8 3.5h8l-.6 6a3.4 3.4 0 0 1-6.8 0z"/><path d="M12 13v7M8.5 20.5h7"/>',
  bread: '<path d="M4 11a4 4 0 0 1 2-7h12a4 4 0 0 1 2 7v8.5H4z"/><path d="M9 8.5l-1.5 2M13 8.5l-1.5 2M17 8.5l-1.5 2"/>',
  building: '<path d="M4 20.5h16M6 20.5V5h8v15.5M14 9.5h4v11"/><path d="M8.5 8h3M8.5 11.5h3M8.5 15h3"/>',
  crown: '<path d="M4 17.5L3 7.5l5 4 4-6 4 6 5-4-1 10z"/><path d="M4.5 20.5h15"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  box: '<path d="M3.5 8L12 3.5 20.5 8v8.5L12 21l-8.5-4.5z"/><path d="M3.5 8L12 12.5 20.5 8M12 12.5V21"/>',
  crescent: '<path d="M15.5 3.5a8.5 8.5 0 1 0 5 12.5 7 7 0 0 1-5-12.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.5"/>',
};
const WA =
  '<path fill="currentColor" stroke="none" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/>';

export const icon = (name, { dir = false, cls = '' } = {}) =>
  `<svg class="${['icon', dir ? 'icon-dir' : '', cls].filter(Boolean).join(' ')}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${
    name === 'whatsapp' ? WA : P[name] || P.info
  }</svg>`;

export const iconPaths = P;

/* ---------------- Placeholder art (generated SVG files) ---------------- */
const TONES = {
  plum: { a: '#3E1F40', b: '#271128', line: 'rgba(234,231,220,0.10)', icon: 'rgba(234,231,220,0.32)', ring: 'rgba(184,138,74,0.30)' },
  ivory: { a: '#EEEBE2', b: '#E1DBCD', line: 'rgba(69,35,73,0.07)', icon: 'rgba(69,35,73,0.30)', ring: 'rgba(184,138,74,0.35)' },
  sand: { a: '#DDD2C6', b: '#CBBCAC', line: 'rgba(69,35,73,0.09)', icon: 'rgba(52,24,53,0.32)', ring: 'rgba(69,35,73,0.18)' },
};
export function placeholderSVG(entry) {
  const { width: w, height: h } = entry;
  const t = TONES[entry.placeholder?.tone] || TONES.ivory;
  const hero = w >= 1600;
  const cx = hero ? w * 0.74 : w / 2;
  const cy = hero ? h * 0.42 : h / 2;
  const r = Math.min(w, h) * (hero ? 0.26 : 0.24);
  const iconSize = r * 0.9;
  const arcs = Array.from({ length: 7 }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${r * (1.35 + i * 0.42)}" fill="none" stroke="${t.line}" stroke-width="${Math.max(1, w / 900)}"/>`).join('');
  const path = P[entry.placeholder?.icon] || P.cloche;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/></linearGradient>
<radialGradient id="v" cx="${cx / w}" cy="${cy / h}" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity="0.10"/><stop offset="1" stop-color="#000" stop-opacity="0.10"/></radialGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#v)"/>${arcs}
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t.ring}" stroke-width="${Math.max(1.2, w / 700)}"/>
<g transform="translate(${cx - iconSize / 2} ${cy - iconSize / 2}) scale(${iconSize / 24})" fill="none" stroke="${t.icon}" stroke-width="${(1.1 * 24) / iconSize * (w / 600)}" stroke-linecap="round" stroke-linejoin="round">${path}</g>
</svg>`;
}

/* ---------------- Context helpers ---------------- */
export const reviewMode = (ctx) => !!ctx.config.prototype.showReviewFlags;

export const rf = (ctx) =>
  reviewMode(ctx)
    ? `<span class="review-flag" title="${esc(ctx.ui.review.flagTitle)}">${icon('info')}<span>${esc(ctx.ui.review.flag)}</span></span>`
    : '';

/** Visible "pending content" block — rendered in review builds only. */
export const pending = (ctx, note, extraClass = '') =>
  reviewMode(ctx) && note
    ? `<div class="pending-block ${extraClass}" role="note"><strong>${esc(ctx.ui.review.pendingTitle)}</strong>${esc(note)}</div>`
    : '';

/**
 * Provisional business facts are shown (with a flag) only in review builds.
 * In clean builds, anything not status:"verified" is omitted entirely.
 */
export function fact(ctx, key) {
  const f = ctx.config.facts[key] ?? (key === 'parent' ? ctx.config.brand.parentCompany : null);
  if (!f || f.value == null) return null;
  if (f.status !== 'verified' && !reviewMode(ctx)) return null;
  const v = typeof f.value === 'object' && !Array.isArray(f.value) ? f.value[ctx.lang] : f.value;
  return { value: v, flag: f.status !== 'verified' ? rf(ctx) : '' };
}

/* ---------------- Images ---------------- */
export function mediaEntry(ctx, id) {
  const m = ctx.media.byId[id];
  if (!m) throw new Error(`Unknown media id: ${id}`);
  return m;
}
export function imgSrc(m) {
  return m.src || `/assets/images/placeholders/${m.id}.svg`;
}
export function img(ctx, id, { eager = false, cls = '', sizes = '100vw', alt } = {}) {
  const m = mediaEntry(ctx, id);
  const srcset = (m.srcset || []).map((s) => `${s.src} ${s.w}w`).join(', ');
  return `<img${attrs({
    class: cls || null,
    src: imgSrc(m),
    srcset: srcset || null,
    sizes: srcset ? sizes : null,
    width: m.width,
    height: m.height,
    alt: alt ?? m.alt[ctx.lang],
    loading: eager ? 'eager' : 'lazy',
    decoding: eager ? 'sync' : 'async',
    fetchpriority: eager ? 'high' : null,
  })}>`;
}
export function placeholderTag(ctx, id) {
  const m = mediaEntry(ctx, id);
  return m.src || !reviewMode(ctx) ? '' : `<span class="placeholder-tag">${esc(ctx.ui.review.placeholder)}</span>`;
}
export function figure(ctx, id, { cls = '', caption = '', eager = false, sizes } = {}) {
  return `<figure class="media ${cls}">${placeholderTag(ctx, id)}${img(ctx, id, { eager, sizes })}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}
