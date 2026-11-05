# Content gaps: client input required

Everything below is either missing or provisional. In a **review build** (`npm run build`), provisional facts show a dashed **"To confirm"** badge and missing content shows a **"Content pending client approval"** block. In a **clean build** (`npm run build:clean`), both are hidden **and every provisional fact is omitted**, so nothing unverified can reach production by accident.

## 1. Brand assets
| Item | Status | Where it plugs in |
|---|---|---|
| Original logo, SVG or high-res transparent PNG | Missing. An interim crop from the brand board is in use | `site-config.json → brand.logo` |
| Approved reverse/monochrome logo (for dark surfaces) | Missing | Not used until supplied |
| Favicon / app icon | Missing | Add to `src/assets/logo/`, then link it in `layout.mjs → head()` |
| Official `Plum_Catering_Brand_Tokens.css` | Missing. Tokens were transcribed from the guidelines | `src/styles/tokens.css` |
| Font licence decision (self-hosted Playfair Display / Inter / Tajawal) | Pending. The prototype uses Google Fonts | See `wordpress-handoff.md §Fonts` |

## 2. Media
| Item | Target | Supplied |
|---|---|---|
| Gallery photos | **117** | **0**. 10 labelled demo placeholders are shown for layout review only and are never duplicated to reach the target |
| Hero video (MP4/WebM, muted, about 10–20 s) + poster | 1 | 0. Placeholder poster is shown and no video is loaded |
| Kitchen film + captions (AR/EN `.vtt`) + poster | 1 | 0 |
| Service section photography (Corporates ×7, Celebrations ×6, service cards ×4, About, Team, Kitchen) | about 25 | 0 |
| Product photography | 76 | **76 supplied** via the catalogue PDF (≈570 px extracted, soft-masked). Higher-resolution originals are recommended for the product hero |
| Client logos with written approval for each | ? | 0 |

## 3. Company facts (all provisional, from Blueprint §1)
- Central kitchen area of about 1,200 m². **Confirm.**
- ISO 22000:2018 and HACCP. **Provide the certificates (issuer, scope, issue/expiry dates).**
- Plum Catering is a brand of Advanced Food Co. **Confirm the legal entity name and the Arabic name** (the Arabic "شركة الأغذية المتقدمة" is our translation and needs approval).
- Commercial registration and VAT number, if they should appear.
- Founding year, story, milestones. **Not published until supplied.**
- Mission, Vision, Core Values: approved copy is required.
- Team facts and photos. **No headcounts or credentials are invented.**
- Cuisines actually served, customisation conditions and dietary options.
- Additional B2B industries served.
- Answers to the FAQs flagged "To confirm": service area, lead times, minimum guests, setup/service staff, delivery zones, storage.

## 4. Contact & integrations
| Item | Config key | Status |
|---|---|---|
| Phone | `contact.phone` | **+966 53 532 4747** (from the catalogue's contact page) |
| Email | `contact.email` | **info@plumcatering.com.sa** (from the catalogue) |
| WhatsApp number (official) | `contact.whatsappNumber` | null. The catalogue phone is the obvious candidate, but WhatsApp enablement is not confirmed, so controls show a "pending" marker |
| Address (AR/EN) and opening hours | `contact.address`, `contact.openingHours` | null. LocalBusiness schema is omitted until supplied |
| Social profiles | `contact.social` | [] |
| Quote endpoint | `integrations.quoteEndpoint` | null. The form shows "integration pending" and sends nothing |
| GTM container ID | `integrations.gtmContainerId` | null. GTM is never loaded |
| Google Ads conversion ID/label | `integrations.googleAdsConversion` | null |
| Search Console verification token | `integrations.searchConsoleVerification` | null (DNS verification is preferred) |
| Catalogue PDF (AR/EN), version and date | `catalogue.pdf` | **Supplied**: one bilingual file, `Plum_B2B-Catalogue-2026.pdf` (3.7 MB), served for both languages |

## 5. Products
- **Imported: 76 / 76** from the client's *Plum B2B Catalogue 2026* PDF — Bread 21, Croissants 6, Danish & Focaccia 10, Éclairs 12, Miracle Cakes 5, Molded Cakes 12, Whole Cakes 10. Names (AR/EN), weights, energy, size variants and family shelf lives are exactly as printed. Importer: `src/build/import-catalogue.py`.
- **Status: all 76 are `provisional` → noindex** until the client confirms the catalogue data is current. Approval is a one-field change per record (`status: "approved"`) and needs the bilingual overview text below.
- **Still needed per product (AR + EN):** 100–180-word distinct overview (`longDescription`), energy **basis** (per unit? per 100 g?) — catalogue prints kcal next to the unit weight, packaging, storage/thawing guidance, foodservice uses, product codes, and any verified ingredients and allergens (**never estimated**).
- **Spelling check:** the catalogue prints "Fetta", "Peperoni", "Pain Suisse / Swisse / Swiss", "Mandarine". These were kept verbatim; confirm whether to standardise.
- Arabic family names (الكرواسون، الدنش والفوكاشيا، الإكلير، كيك ميراكل، كيك القوالب، الكيك الكامل) are our translations — the catalogue uses selection headings (e.g. "تشكيلة الكيك") rather than family names.
- Molded and Whole Cakes are listed **fresh only (3 days)**; Bread, Croissants, Danish, Éclairs and Miracle Cakes are fresh 2 days / baked-frozen 3 months.

## 6. Legal
- The Privacy Policy is a **review draft** with bracketed placeholders (entity, address, legal bases under PDPL, cookie inventory, retention periods, transfers, rights, privacy contact). The page stays **noindex** until `legal.privacyApproved = true`.
- The cookie inventory has to be finalised once GTM tags are configured.

## 7. SEO inputs
- GSC export, an indexed-URL list and a backlink audit, needed to finish `redirects-mapping.csv`.
- Keyword validation: Blueprint keywords are working hypotheses, not confirmed search volumes.
