// Bilingual cookie consent + Google Consent Mode v2 updates.
// Stores ONLY the consent choice (no personal data) under "plum_consent_v1".
import { openDialog, wireDialog } from './dialog.js';

const KEY = 'plum_consent_v1';
// Review bundle (single offline file) keeps the choice per session so the banner reappears on each open.
const store = () => (window.PLUM_REVIEW_BUNDLE ? sessionStorage : localStorage);
const read = () => { try { const c = JSON.parse(store().getItem(KEY) || 'null'); return c && c.v === 1 ? c : null; } catch { return null; } };

function apply(choice) {
  const g = (b) => (b ? 'granted' : 'denied');
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: g(choice.analytics),
      ad_storage: g(choice.marketing),
      ad_user_data: g(choice.marketing),
      ad_personalization: g(choice.marketing),
    });
  }
  document.dispatchEvent(new CustomEvent('plum:consent', { detail: choice }));
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

export function initCookieConsent(data) {
  const banner = document.querySelector('[data-cookie-banner]');
  const prefs = document.getElementById('cookie-prefs');
  const form = prefs?.querySelector('[data-cookie-form]');
  wireDialog(prefs);

  const save = (choice, announce = true) => {
    const c = { v: 1, analytics: !!choice.analytics, marketing: !!choice.marketing, ts: new Date().toISOString() };
    try { store().setItem(KEY, JSON.stringify(c)); } catch { /* storage blocked: apply for this page only */ }
    apply(c);
    if (banner) banner.hidden = true;
    document.body.classList.remove('has-cookie-banner');
    if (prefs?.open) prefs.close();
    if (announce) toast(data.i18n.cookie.saved);
  };

  const existing = read();
  if (existing) apply(existing);
  else if (banner) { banner.hidden = false; document.body.classList.add('has-cookie-banner'); }

  document.addEventListener('click', (e) => {
    const consentBtn = e.target.closest('[data-consent]');
    if (consentBtn) {
      const all = consentBtn.dataset.consent === 'accept';
      save({ analytics: all, marketing: all });
      return;
    }
    const settings = e.target.closest('[data-cookie-settings]');
    if (settings && prefs) {
      const c = read() || { analytics: false, marketing: false };
      form.elements.analytics.checked = c.analytics;
      form.elements.marketing.checked = c.marketing;
      openDialog(prefs, settings);
    }
  });
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    save({ analytics: form.elements.analytics.checked, marketing: form.elements.marketing.checked });
  });
}
