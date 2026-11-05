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
| Product photography (one original per product, plus optional extra images) | **76+** | 0 |
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
| Phone | `contact.phone` | null |
| Email | `contact.email` | null |
| WhatsApp number (official) | `contact.whatsappNumber` | null. WhatsApp controls show a non-clickable "pending" marker |
| Address (AR/EN) and opening hours | `contact.address`, `contact.openingHours` | null. LocalBusiness schema is omitted until supplied |
| Social profiles | `contact.social` | [] |
| Quote endpoint | `integrations.quoteEndpoint` | null. The form shows "integration pending" and sends nothing |
| GTM container ID | `integrations.gtmContainerId` | null. GTM is never loaded |
| Google Ads conversion ID/label | `integrations.googleAdsConversion` | null |
| Search Console verification token | `integrations.searchConsoleVerification` | null (DNS verification is preferred) |
| Catalogue PDF (AR/EN), version and date | `catalogue.pdf` | null. The download button is shown disabled with an explanation |

## 5. Products
- **Expected:** 76 products in 7 families (Bread 21, Croissants 6, Danish & Focaccia 10, Éclairs 12, Miracle Cakes 5, Molded Cakes 12, Whole Cakes 10). These counts are provisional and taken from the Blueprint.
- **Loaded:** 3 records, 0 approved:
  - `prd-bread-brown-sourdough`: *provisional*. Weight 750 g and 1,850 kcal come from the Blueprint, and the kcal basis (per loaf?) is unknown. Bread shelf life is fresh 2 days / baked-frozen 3 months.
  - `prd-molded-honey-cake` and `prd-whole-honey-cake`: *draft*, names only. They show how two products with the same name in different families get separate slugs.
- **Needed per product (AR + EN):** name, family, product code, photos, 60–120-word intro, 100–180-word distinct overview, variants (weight / energy **with basis**), packaging, storage/thawing, fresh vs frozen shelf life, foodservice uses, related products, and any verified ingredients and allergens (**never estimated**).
- Shelf life for the six families other than Bread.
- Approval of the Arabic family names (الكرواسون، الدنش والفوكاشيا، الإكلير، كيك ميراكل، كيك القوالب، الكيك الكامل), which are our translations.

## 6. Legal
- The Privacy Policy is a **review draft** with bracketed placeholders (entity, address, legal bases under PDPL, cookie inventory, retention periods, transfers, rights, privacy contact). The page stays **noindex** until `legal.privacyApproved = true`.
- The cookie inventory has to be finalised once GTM tags are configured.

## 7. SEO inputs
- GSC export, an indexed-URL list and a backlink audit, needed to finish `redirects-mapping.csv`.
- Keyword validation: Blueprint keywords are working hypotheses, not confirmed search volumes.
