// Plum Catering — client entry. Progressive enhancement only: every page is
// fully readable and navigable without JavaScript.
import { initTracking } from './tracking-adapter.js';
import { initCookieConsent } from './cookie-consent.js';
import { initNavigation } from './navigation.js';
import { initQuoteModal } from './quote-modal.js';
import { initProductFilters } from './product-filters.js';
import { initGallery } from './gallery.js';

let data = {};
try { data = JSON.parse(document.getElementById('plum-data')?.textContent || '{}'); } catch { /* keep defaults */ }

for (const [name, init] of Object.entries({ initTracking, initCookieConsent, initNavigation, initQuoteModal, initProductFilters, initGallery })) {
  try { init(data); } catch (err) { console.error(`[plum] ${name} failed`, err); }
}
