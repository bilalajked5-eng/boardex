#!/usr/bin/env node
// Browser QA with Playwright (Chromium). Requires `npm run preview` running on :4173.
// Usage: node src/build/browser-qa.mjs [--shots]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const SHOTS = process.argv.includes('--shots');
const SHOT_DIR = path.join(ROOT, 'qa-screenshots');
if (SHOTS) fs.mkdirSync(SHOT_DIR, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`); };

const PAGES = ['/ar/', '/en/', '/ar/about-us/', '/en/about-us/', '/ar/services/sharikat/', '/en/services/corporates/', '/ar/services/munasabat/', '/en/services/celebrations/', '/ar/services/qitaa-al-aamal/', '/en/services/b2b/', '/ar/services/idarat-al-marafiq/', '/en/services/facility-management/', '/ar/privacy/', '/en/privacy/', '/ar/products/brown-sourdough-bread/', '/en/products/brown-sourdough-bread/', '/en/products/honey-cake-whole-cake/', '/en/does-not-exist/'];
const VIEWPORTS = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 390, height: 844 }];

const browser = await chromium.launch();

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
}

/* 1. Every page × viewport: no JS errors, no horizontal overflow, no failed requests */
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/404 \(Not Found\)/.test(m.text())) errors.push(m.text()); });
    page.on('requestfailed', (r) => errors.push(`request failed ${r.url()}`));
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`[${vp.name}] ${p} no errors & no horizontal overflow`, !errors.length && overflow <= 0, errors.join('; ') || (overflow > 0 ? `overflow ${overflow}px` : ''));
    if (SHOTS && ['/ar/', '/en/', '/en/services/b2b/', '/ar/services/qitaa-al-aamal/', '/ar/products/brown-sourdough-bread/', '/en/services/corporates/', '/ar/services/idarat-al-marafiq/', '/en/about-us/', '/ar/privacy/'].includes(p)) {
      await page.screenshot({ path: path.join(SHOT_DIR, `${vp.name}${p.replace(/\//g, '_')}.png`), fullPage: true });
    }
    await page.close();
  }
  await ctx.close();
}

/* 2. Interactions */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let page = await ctx.newPage();
await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });

// Skip link is first focusable
await page.keyboard.press('Tab');
check('skip link is first tab stop', await page.evaluate(() => document.activeElement?.classList.contains('skip-link')));

// Cookie banner & consent mode
check('cookie banner shown on first visit', await page.isVisible('[data-cookie-banner]'));
const defaultConsent = await page.evaluate(() => JSON.stringify(window.dataLayer.find((e) => e[0] === 'consent' && e[1] === 'default')?.[2] || {}));
check('Consent Mode v2 defaults denied', /"ad_storage":"denied"/.test(defaultConsent) && /"analytics_storage":"denied"/.test(defaultConsent) && /"ad_user_data":"denied"/.test(defaultConsent) && /"ad_personalization":"denied"/.test(defaultConsent));
await page.click('[data-cookie-banner] [data-consent="reject"]');
check('reject hides banner and stores choice', !(await page.isVisible('[data-cookie-banner]')) && (await page.evaluate(() => JSON.parse(localStorage.getItem('plum_consent_v1')).analytics === false)));
check('no GTM loaded without container ID', !(await page.evaluate(() => [...document.scripts].some((s) => s.src.includes('googletagmanager')))));
await page.click('footer [data-cookie-settings]');
check('cookie preferences dialog reopens from footer', await page.isVisible('#cookie-prefs'));
await page.check('#cookie-prefs input[name="analytics"]');
await page.click('#cookie-prefs button[type="submit"]');
const upd = await page.evaluate(() => window.dataLayer.filter((e) => e[0] === 'consent' && e[1] === 'update').pop()?.[2]);
check('customised consent updates analytics_storage=granted, ads denied', upd?.analytics_storage === 'granted' && upd?.ad_storage === 'denied');

// Quote modal: open, focus, Escape, focus restore
const trigger = page.locator('header [data-quote-open]').first();
await trigger.click();
check('quote modal opens from header CTA', await page.isVisible('#quote-modal'));
check('focus moves into modal', await page.evaluate(() => !!document.activeElement?.closest('#quote-modal')));
await page.keyboard.press('Escape');
check('Escape closes modal', !(await page.isVisible('#quote-modal')));
check('focus restored to trigger', await page.evaluate(() => document.activeElement?.matches('header [data-quote-open]')));

// Validation + honest pending state (no endpoint configured)
await trigger.click();
await page.click('#quote-form [data-submit]');
check('empty submit shows validation errors', (await page.getAttribute('#q-name', 'aria-invalid')) === 'true' && (await page.textContent('#q-privacy-error')).length > 0);
await page.fill('#q-name', 'QA Tester'); await page.fill('#q-email', 'qa@example.com'); await page.fill('#q-phone', '+966 50 000 0000');
await page.selectOption('#q-service', 'celebration');
check('conditional fields: event date shown for celebration', await page.isVisible('#q-date'));
check('conditional fields: B2B volume hidden for celebration', !(await page.isVisible('#q-volume')));
await page.check('#q-privacy');
await page.click('#quote-form [data-submit]');
await page.waitForSelector('.form-status--pending');
check('no endpoint → "integration pending" message, no success claimed', (await page.isVisible('.form-status--pending')) && !(await page.isVisible('.form-status--success')));
check('no generate_lead event without server success', !(await page.evaluate(() => window.dataLayer.some((e) => e.event === 'generate_lead'))));
await page.keyboard.press('Escape');

// FAQ accordion
const q = page.locator('[data-faq] .faq-q').first();
check('FAQ starts collapsed', (await q.getAttribute('aria-expanded')) === 'false');
await q.click();
check('FAQ expands with aria-expanded=true', (await q.getAttribute('aria-expanded')) === 'true' && (await page.isVisible('#home-faq-1')));

// Gallery lightbox
await page.locator('[data-lightbox]').first().click();
check('gallery lightbox opens', await page.isVisible('#lightbox'));
const cap1 = await page.textContent('[data-lightbox-caption]');
await page.keyboard.press('ArrowRight');
check('lightbox arrow-key navigation', (await page.textContent('[data-lightbox-caption]')) !== cap1);
await page.keyboard.press('Escape');
check('lightbox closes with Escape', !(await page.isVisible('#lightbox')));
await page.close();

// Quote with mocked server: success only on {ok:true, reference}
async function mockedProductPage(response) {
  const p = await ctx.newPage();
  await p.route('**/en/products/brown-sourdough-bread/', async (route) => {
    const r = await route.fetch();
    const body = (await r.text()).replace('"quoteEndpoint":null', '"quoteEndpoint":"/api/quote"');
    route.fulfill({ response: r, body });
  });
  await p.route('**/api/quote', (route) => route.fulfill(response));
  await p.goto(`${BASE}/en/products/brown-sourdough-bread/`, { waitUntil: 'networkidle' });
  await p.locator('.product-info [data-quote-open]').click();
  return p;
}
page = await mockedProductPage({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, reference: 'PLM-TEST-0001' }) });
check('product quote attaches product', (await page.isVisible('[data-attached]')) && (await page.inputValue('input[name="product_id"]')) === 'prd-bread-brown-sourdough');
check('product quote preselects B2B and shows volume field', (await page.inputValue('#q-service')) === 'b2b' && (await page.isVisible('#q-volume')));
await page.fill('#q-name', 'QA Tester'); await page.fill('#q-email', 'qa@example.com'); await page.fill('#q-phone', '+966500000000'); await page.check('#q-privacy');
await page.click('#quote-form [data-submit]');
await page.waitForSelector('.form-status--success');
check('server-confirmed success shows reference', (await page.textContent('#quote-status')).includes('PLM-TEST-0001'));
check('generate_lead fired only after server success', await page.evaluate(() => window.dataLayer.some((e) => e.event === 'generate_lead' && e.lead_reference === 'PLM-TEST-0001')));
await page.close();
page = await mockedProductPage({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false }) });
await page.fill('#q-name', 'QA Tester'); await page.fill('#q-email', 'qa@example.com'); await page.fill('#q-phone', '+966500000000'); await page.check('#q-privacy');
await page.click('#quote-form [data-submit]');
await page.waitForSelector('.form-status--error');
check('server error → error message, no lead event', !(await page.evaluate(() => window.dataLayer.some((e) => e.event === 'generate_lead'))));
await page.close();

// Language switcher keeps product identity
page = await ctx.newPage();
await page.goto(`${BASE}/en/products/brown-sourdough-bread/`);
check('language switch → same product in Arabic', (await page.getAttribute('header [data-lang-switch]', 'href')) === '/ar/products/brown-sourdough-bread/');
await page.goto(`${BASE}/ar/services/sharikat/`);
check('language switch → corresponding service page', (await page.getAttribute('header [data-lang-switch]', 'href')) === '/en/services/corporates/');

// B2B filters
await page.goto(`${BASE}/en/services/b2b/`, { waitUntil: 'networkidle' });
await page.fill('[data-product-search]', 'sourdough');
await page.waitForTimeout(300);
check('catalogue search filters products', (await page.locator('[data-product]:visible').count()) === 1 && (await page.textContent('[data-catalogue-status]')).includes('1'));
await page.fill('[data-product-search]', '');
await page.click('[data-family-filter="molded-cakes"]');
await page.waitForTimeout(100);
check('family chip filter hides other families', !(await page.isVisible('#family-bread')) && (await page.isVisible('#family-molded-cakes')));
await page.goto(`${BASE}/ar/services/qitaa-al-aamal/`, { waitUntil: 'networkidle' });
await page.fill('[data-product-search]', 'ساوردو');
await page.waitForTimeout(300);
check('Arabic catalogue search works', (await page.locator('[data-product]:visible').count()) === 1);
await page.close();
await ctx.close();

// Mobile: drawer + sticky bar not covering consent banner
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
page = await m.newPage();
await page.goto(`${BASE}/ar/`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
await page.waitForTimeout(500);
const barBox = await page.locator('[data-mobile-bar]').boundingBox();
check('mobile bar stays off-screen while consent banner is open', barBox.y >= 844 - 1, `bar y=${Math.round(barBox.y)}`);
await page.click('[data-cookie-banner] [data-consent="accept"]');
await page.waitForTimeout(500);
const barBox2 = await page.locator('[data-mobile-bar]').boundingBox();
check('mobile bar appears after consent choice', barBox2.y < 844);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.tap('[data-drawer-open]');
check('mobile drawer opens', await page.isVisible('#site-drawer'));
const panel = await page.locator('.drawer__panel').boundingBox();
check('RTL drawer slides from the left edge', panel.x <= 1, `x=${panel.x}`);
await page.keyboard.press('Escape');
check('drawer closes with Escape', !(await page.isVisible('#site-drawer')));
await m.close();

// Reduced motion → no hidden reveal content
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
page = await rm.newPage();
await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
check('reduced motion: all reveal content visible immediately', await page.evaluate(() => [...document.querySelectorAll('.reveal')].every((el) => getComputedStyle(el).opacity === '1')));
await rm.close();

// No-JS: content, links and FAQ answers remain available
const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
page = await nojs.newPage();
await page.goto(`${BASE}/en/services/b2b/`);
check('no-JS: H1 visible', await page.isVisible('h1'));
check('no-JS: product links crawlable', (await page.locator('a[href^="/en/products/"]').count()) >= 3);
check('no-JS: FAQ answers visible', await page.isVisible('#b2b-faq-1'));
check('no-JS: reveal content visible', await page.evaluate(() => [...document.querySelectorAll('.reveal')].every((el) => getComputedStyle(el).opacity === '1')));
await nojs.close();

await browser.close();
const failed = results.filter((r) => !r.ok);
fs.writeFileSync(path.join(ROOT, 'docs', 'qa-browser-results.json'), JSON.stringify({ ranAt: new Date().toISOString(), total: results.length, failed: failed.length, results }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} browser checks passed`);
process.exit(failed.length ? 1 : 0);
