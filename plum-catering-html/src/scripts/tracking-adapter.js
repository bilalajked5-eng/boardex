// Tracking adapter — GTM / Google Ads via dataLayer. Nothing loads without a real
// container ID (site-config.json → integrations.gtmContainerId) AND, in "basic"
// consent mode, without the visitor granting analytics or advertising consent.
// A lead conversion is ONLY pushed after a server-confirmed quote success.
let cfg = {};
let gtmLoaded = false;

export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, page_language: cfg.lang, page_path: location.pathname, ...params });
}

function loadGTM() {
  const id = cfg.gtmContainerId;
  if (!id || gtmLoaded || !/^GTM-[A-Z0-9]+$/.test(id)) return;
  gtmLoaded = true;
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Call ONLY with a server-confirmed reference. */
export function trackLead({ reference, serviceType, productId }) {
  if (!reference) return;
  track('generate_lead', { lead_reference: reference, service_type: serviceType || '', product_id: productId || '' });
  // Prefer configuring the Google Ads conversion tag inside GTM on the
  // "generate_lead" event. This direct call is a fallback for gtag.js setups.
  const ads = cfg.adsConversion;
  if (ads?.id && ads?.label && typeof window.gtag === 'function' && window.__plumConsent?.marketing) {
    window.gtag('event', 'conversion', { send_to: `${ads.id}/${ads.label}`, transaction_id: reference });
  }
}

export function initTracking(data) {
  cfg = data;
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('plum:consent', (e) => {
    const c = e.detail || {};
    window.__plumConsent = c;
    if (cfg.consentModeType === 'advanced' || c.analytics || c.marketing) loadGTM();
  });
  if (cfg.consentModeType === 'advanced') loadGTM();
  // Click intent events (not conversions).
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { link_url: el.getAttribute('href') || '' });
  });
}
