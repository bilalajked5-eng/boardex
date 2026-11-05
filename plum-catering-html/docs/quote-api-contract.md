# Quote API contract

The front-end form (`src/scripts/quote-modal.js`) is complete. **No backend exists in this prototype.** While `site-config.json → integrations.quoteEndpoint` is `null`, submitting a valid form shows an "online form integration pending" message. Nothing is sent, no success is claimed and no conversion fires.

## Request
`POST {quoteEndpoint}` (recommended path: `/api/quote`, same origin) with
`Content-Type: application/json`, `Accept: application/json`.

```json
{
  "name": "string, 2–120",
  "email": "string, valid email",
  "phone": "string, E.164 preferred",
  "company": "string, optional",
  "service_type": "corporate | celebration | b2b | facility",
  "event_date": "YYYY-MM-DD, corporate/celebration only",
  "guest_count": "integer, corporate/celebration only",
  "product_name": "string, b2b only",
  "supply_volume": "string, b2b only",
  "product_id": "string, set automatically on product pages",
  "product_category": "string",
  "source_path": "/en/products/brown-sourdough-bread/",
  "lang": "ar | en",
  "message": "string, ≤3000",
  "privacy_ack": true,
  "marketing_consent": false
}
```
Fields for a service that isn't selected are disabled and therefore left out. The honeypot field `website` is stripped on the client, and the server must also reject any request where it is non-empty.

## Responses
| Case | HTTP | Body | Front-end behaviour |
|---|---|---|---|
| Accepted and email delivered or queued | 200/201 | `{"ok": true, "reference": "PLM-2026-000123"}` | Success message with the reference; pushes `generate_lead` (the only conversion trigger) |
| Validation error | 422 | `{"ok": false, "errors": {"email": "…"}}` | Field errors shown |
| Rate limited / spam | 429 / 400 | `{"ok": false}` | Generic error |
| Server failure | 5xx | anything | Generic error, **no** lead event |
| Network failure / 15 s timeout | — | — | Network error, **no** lead event |

**Success requires `ok === true` and a non-empty `reference` string.** Anything else counts as failure.

## Server-side requirements
1. Re-validate every field on the server. Never trust the client.
2. Spam protection: honeypot, rate limiting per IP/email, and optionally Cloudflare Turnstile (privacy-friendly; add it to the consent/privacy docs).
3. CSRF: same-origin only, check `Origin`, and use a WordPress nonce in the WP build.
4. Deliver email through **Microsoft 365 via Microsoft Graph `sendMail` with OAuth 2.0 client credentials** (app registration with `Mail.Send` restricted to the sending mailbox through an Exchange application access policy), or through authenticated SMTP AUTH if the tenant allows it. **Secrets stay in server environment variables and never reach the browser or the repository.**
5. Send a notification to the Plum inbox with every field plus `source_path` and `product_id`. An auto-reply to the customer is optional and bilingual.
6. Log a minimal record with a retention period agreed in the privacy policy. Do not store PII in browser storage.
7. Only after delivery is confirmed or queued, return `{ok:true, reference}`.

## WordPress implementation path
- Register `POST /wp-json/plum/v1/quote` (`register_rest_route`) with a nonce. Set `quoteEndpoint` from `wp_localize_script` or an inline config.
- Put the Graph mailer in a small plugin or theme module (`inc/integrations/m365-mailer.php`). Keep the credentials in `wp-config.php` constants that read server environment variables.
- Optional: save submissions to a private CPT `plum_lead` for audit, then purge them according to the retention policy.
