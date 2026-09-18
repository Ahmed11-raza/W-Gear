# Placeholders

Every asset and business fact in this build that is not yet real, and what it is
waiting on. Nothing in this list has been invented to fill a gap — where data is
missing, the interface says so rather than fabricating it.

Per the brief (§20, §53, §54): no client logos, testimonials, statistics, awards,
certifications, review counts, athlete endorsements, fabric specifications,
delivery figures or market claims appear anywhere in this site, because none of
them are known to be true.

---

## Brand identity

| Item | Current value | Needed |
|---|---|---|
| Brand name | `I-Wear` | Final name. Set `BRAND.name` in `lib/brand.ts` — it is the only place the name is defined. |
| Legal entity | `PLACEHOLDER_LEGAL_ENTITY` | Registered company name for the footer copyright. |
| Domain | `https://placeholder-i-wear.example` | Real origin. Drives `metadataBase`, canonicals and Open Graph URLs. |
| Logo / wordmark | Set in Cabinet Grotesk as live type | A drawn wordmark, if the brand wants one. The type treatment works as-is. |
| Favicon / app icons | None | Icon set once the wordmark exists. |
| OG share image | None | 1200×630 share card. |

## Contact

| Item | Current value | Needed |
|---|---|---|
| WhatsApp number | `PLACEHOLDER_WHATSAPP_NUMBER` | International format, digits only. The deep-link builder (`whatsappLink()` in `lib/brand.ts`) is written and returns `null` until this is set, so no dead link is ever rendered. |
| Contact email | `PLACEHOLDER_CONTACT_EMAIL` | Shown in the footer. |
| Instagram / TikTok / YouTube | `PLACEHOLDER_*_URL` | Profile URLs. Not linked anywhere until set. |

## Photography

All four slots render a marked placeholder carrying the shot brief. Drop a file
at the listed path and the slot fills automatically — no code change. Full
creative direction for each is in **`SHOTLIST.md`**.

| Slot | Path | Ratio |
|---|---|---|
| `hero-primary` | `public/images/hero/primary.jpg` | 16:9 |
| `split-everyday` | `public/images/split/everyday.jpg` | 3:4 |
| `split-teamwear` | `public/images/split/teamwear.jpg` | 3:4 |
| `fabric-macro` | `public/images/fabric/macro.jpg` | 1:1 |

**What is real:** `public/images/texture/` contains four genuine CC0 photographs
of cloth from StockSnap (provenance in `texture/CREDITS.md`). They are real
photographs of real fabric, but they are **not** photographs of this brand's
garments and must never be captioned as such.

## Product data

No products exist. The type model (`types/index.ts`) defines products, variants,
sizes and specifications, and the storefront reads from that shape — but no
catalogue has been written, and no garment, price, fabric weight or measurement
has been invented.

Specifically **not** claimed anywhere in this build:

- GSM, fibre composition, stretch, breathability or care instructions
- Prices, currency amounts or discounts
- Garment or body measurements, model height, model size
- Stock levels or availability
- Shipping times, return windows or delivery guarantees
- Accepted payment methods

## Teamwear requests

`app/api/teamwear/route.ts` is a **real** endpoint — it validates server-side and
rejects bad input with usable messages — but it has **no delivery integration**.
A submitted request is validated and given a reference, and then goes nowhere.
Nobody is notified.

The success screen states this plainly to the customer. The delivery boundary is
marked in the route file; replace that block with a real integration (email, CRM
or WhatsApp Business API) and remove the notice in
`components/teamwear/steps/ReviewStep.tsx`.

Minimum order quantities in `data/teamwear.ts` (10–20 units depending on garment)
are **placeholder values** and need confirming against real production capacity.

## Sections not built

Scope for this build was the design foundation plus the three signature moments.
These routes exist and say honestly that they are not built, rather than 404ing
or showing invented content:

`/shop` · `/collections` · `/stories` · `/about` · `/teamwear`

Not built at all: cart, checkout, payment, search, size guide, product detail,
account, journal articles, manufacturing scroll sequence.

## Community and social proof

Nothing. No teams, clubs, academies, schools or partners are named or shown,
because none have been confirmed. The homepage deliberately carries no
"trusted by" bar, no logo wall and no testimonials.
