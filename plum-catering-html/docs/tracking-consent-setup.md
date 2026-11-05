# Tracking & consent setup (GTM · Consent Mode v2 · Google Ads)

## What is implemented now
- **Consent Mode v2 defaults** are set inline in `<head>` before any tag can load: `ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization` are all **denied**, with `wait_for_update: 500`. A stored choice is re-applied on every page.
- **Bilingual banner** (`cookie-consent.js`) with **Accept all / Reject non-essential / Customise**. "Cookie preferences" in the footer and on the Privacy page reopens the choices at any time.
- The choice is stored in `localStorage["plum_consent_v1"]` as `{v, analytics, marketing, ts}`. It holds no personal data.
- A choice calls `gtag('consent','update', …)` and dispatches the `plum:consent` DOM event.
- **GTM loader** (`tracking-adapter.js`) runs only when `gtmContainerId` matches `GTM-XXXX`. With `consentModeType: "basic"` (the default), GTM loads **only after** analytics or advertising consent is granted. With `"advanced"`, it loads immediately with everything denied and relies on Consent Mode modelling, which should be chosen only after legal review.
- **Events pushed to `dataLayer`:**
  | Event | When | Conversion? |
  |---|---|---|
  | `quote_open` | Quote modal opened | No (intent) |
  | `whatsapp_click` | WhatsApp link clicked (once a number is configured) | No (intent) |
  | `catalogue_download` | PDF download clicked | No |
  | `quote_submit_unconnected` | Valid submit while no endpoint is configured | No (debug) |
  | `generate_lead` | **Only** after the server returns `{ok:true, reference}` | **Yes** |
  Every event carries `page_language` and `page_path`. `generate_lead` also carries `lead_reference`, `service_type` and `product_id`.

## To go live
1. Set `integrations.gtmContainerId` in `site-config.json` (WP: theme settings) and rebuild.
2. In GTM:
   - Enable consent overview. Set Google tags to require their built-in consent.
   - Add a GA4 Configuration tag if analytics is approved.
   - Add a **Google Ads Conversion** tag triggered by Custom Event = `generate_lead`. Use `{{DLV lead_reference}}` as the Transaction ID for de-duplication.
   - Add the **Conversion Linker** tag (it respects `ad_storage`).
3. Optional direct fallback: set `googleAdsConversion.id`/`label`, and `trackLead()` will call `gtag('event','conversion')` only if marketing consent is granted and gtag exists.
4. Update the Privacy Policy's cookie list with the real tags and durations.

## Test procedure
1. In a new browser profile, open `/ar/` and check that the banner shows in Arabic. Run `dataLayer` in the console: it should contain the `consent default` entry with everything denied.
2. Reject non-essential. Check that no `googletagmanager.com` request appears in the Network tab (basic mode).
3. Use Customise to enable Analytics only. Check that the `consent update` shows `analytics_storage: granted` and `ad_storage: denied`.
4. Use GTM Preview / Tag Assistant to submit a quote against a staging endpoint. Confirm that `generate_lead` fires only after a 200 `{ok:true}` response, and that the Ads tag fires only when advertising consent is granted.
5. Force a 500 from the endpoint and confirm that no conversion fires.

The automated checks for steps 1–5 are in `src/build/browser-qa.mjs`. They use mocked endpoints, and GTM is not loaded because no ID is set.

## Legal note
Saudi PDPL requirements, banner wording and the basic-vs-advanced choice must be confirmed by Plum's legal counsel. The current banner and draft policy are prototypes.
