# Placeholders

Every asset and business fact in this build that is not real, and what it is
waiting on.

**This is a demonstration build.** The site is complete and navigable end to
end, and the catalogue, prices, stock figures, policies and contact details in
it are sample data written to demonstrate the storefront. Nothing here describes
a real company, product or price.

That is a deliberate change from the earlier pass of this project, which shipped
empty rather than invented. The reason for the change is that the site now needs
to be shown; the reason for this document is that a site which looks finished is
exactly the one where someone assumes the numbers are real. Every invented value
is listed below, and a dismissible notice states the same thing on every page
(`components/layout/DemoNotice.tsx`).

---

## Brand identity

| Item | Current value | Needed |
|---|---|---|
| Brand name | `I-Wear` | Final name. Set `BRAND.name` in `lib/brand.ts` — it is the only place the name is defined. |
| Legal entity | `I-Wear Apparel (Pvt) Ltd` — **demo** | Registered company name for the footer copyright. |
| Domain | `https://demo.i-wear.pk` — **demo** | Real origin. Drives `metadataBase`, canonicals and Open Graph URLs. |
| Logo / wordmark | Set in Cabinet Grotesk as live type | A drawn wordmark, if the brand wants one. The type treatment works as-is. |
| Favicon / app icons | None | Icon set once the wordmark exists. |
| OG share image | None | 1200×630 share card. |

## Contact

All **demo** values. None of these accounts, numbers or addresses exist.

| Item | Current value |
|---|---|
| WhatsApp number | `923001234567` |
| Contact email | `hello@i-wear.pk` |
| Studio address | `Sector F-7, Islamabad` |
| Opening hours | `Monday to Saturday, 10:00 to 19:00 PKT` |
| Instagram / TikTok / YouTube | `instagram.com/iwear.pk` and siblings |

The WhatsApp deep-link builder (`whatsappLink()` in `lib/brand.ts`) is real and
works. It is currently pointed at a number that is not in service, so every
WhatsApp link on the site opens a conversation with nobody.

## Photography

Still none. All four slots render a marked placeholder carrying the shot brief.
Drop a file at the listed path and the slot fills automatically — no code
change. Full creative direction for each is in **`SHOTLIST.md`**.

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

### Product imagery

Products are **drawn, not photographed**. `components/ui/GarmentRender.tsx`
renders each product as a flat technical illustration tinted from its own
colourway. It is unmistakably a drawing and is labelled as one on the product
page ("Technical drawing"). It exists so a twelve-product grid is judgeable
without twelve photo shoots, and it is replaced outright when real product
photography arrives.

## Product data

`data/products.ts` is a **demo catalogue** — twelve products, and every field in
them is invented:

- Names, descriptions, feature lists
- Prices (PKR 3,600 to PKR 13,500)
- GSM, fibre composition, knit structure and care instructions
- Stock levels, including the sold-out sizes
- Fit profiles and the size-guide measurements in `app/shop/sizing/page.tsx`

The type model in `types/index.ts` is the contract the UI reads. Replacing this
module with a real adapter — CMS, Shopify, custom backend — requires no
component change.

## Cart and checkout

The cart is real client state and persists to `localStorage`
(`components/cart/CartProvider.tsx`). It is not a server basket and no order is
ever created.

Checkout (`components/cart/Checkout.tsx`) validates delivery details the way a
real checkout would and then **stops at the payment boundary**, which is marked
in the file. No card is taken, nothing is sent, and the confirmation screen says
so in as many words. The reference number it shows is generated in the browser
and corresponds to no record anywhere. The one route out that would genuinely
work in production — the WhatsApp handoff — is offered instead of a fake
confirmation.

Shipping rates and the returns policy in `app/shipping/page.tsx` are **demo
values** and bind nobody.

## Teamwear requests

`app/api/teamwear/route.ts` is a **real** endpoint — it validates server-side
and rejects bad input with usable messages — but it has **no delivery
integration**. A submitted request is validated and given a reference, and then
goes nowhere. Nobody is notified.

The success screen states this plainly. The delivery boundary is marked in the
route file; replace that block with a real integration (email, CRM or WhatsApp
Business API) and remove the notice in
`components/teamwear/steps/ReviewStep.tsx`.

Minimum order quantities in `data/teamwear.ts` (10–20 units depending on
garment) are **placeholder values** and need confirming against real production
capacity.

## Journal

`data/stories.ts` holds five **demo articles**. They are written in the brand
voice and are technically plausible — the pieces on GSM, print methods, seam
construction and heat acclimatisation describe real mechanisms — but they are
not reviewed editorial, carry no byline, and make no claim about this brand's
own products or suppliers. Each article page carries that disclosure.

## Still not built

Cart-to-order persistence, payment, search, account and order history, wishlist,
product reviews, stock reservation, and the manufacturing scroll sequence.

## Community and social proof

Nothing, and this has not changed. No teams, clubs, academies, schools or
partners are named or shown, because none have been confirmed. No testimonials,
no logo wall, no review counts, no athlete endorsements, no awards, no
certifications, no delivery statistics and no market-share claims appear
anywhere on the site. Sample product data is one thing; invented social proof
about real third parties is another, and none of it is here.
