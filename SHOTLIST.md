# Shot list

Four frames. Each one fills a named slot on the site the moment the file lands at
the path given — no code change, no rebuild of the layout. The slot reserves
exactly the space the final image will occupy, so nothing shifts when it arrives.

Source of truth is `data/images.ts`; this document is the readable version of it.

---

## How to deliver

- **Format:** JPEG, quality 85–90. Next.js re-encodes to AVIF and WebP and
  generates every responsive size, so ship one large master per slot.
- **Size:** at least 2400px on the long edge. Larger is fine — nothing that big
  is ever sent to a browser.
- **Colour:** sRGB.
- **Naming and location:** exact paths below. The filename matters.
- **Do not** add a logo, text, border, watermark or colour grade that assumes a
  particular crop. The site crops these per breakpoint.

## What the brand looks like

Warm mineral, not neon gym. The interface is limestone, chalk, obsidian and a
single clay accent; the garments carry the colour. Photography should feel
art-directed and expensive through light and timing, not through post-production.

Avoid entirely: posed studio smiles, someone holding a dumbbell looking at
camera, a model standing still wearing a shirt, gym-equipment close-ups, lens
flare, HDR, heavy vignettes, and anything that reads as stock.

Pakistan should be in the frame as environment, not as decoration. Islamabad
streets, Margalla trails, concrete architecture, university grounds, courts.
No flags, no truck art, no national symbolism.

---

## 1. `hero-primary` — the opening frame

**Path:** `public/images/hero/primary.jpg`
**Ratio:** 16:9 · **Priority:** this is the LCP image on the homepage

The opening frame of a campaign, not a website banner.

One athlete mid-movement, shot so the **fabric is visibly reacting** — a shirt
catching air, a sleeve under tension, a hem lifting. That reaction is the point
of the frame: it is what makes the garment look like it performs.

Hard directional light that reveals seams, weave and construction. Freeze the
motion at the instant of most tension, not at the peak of the pose.

**Composition:** frame loose. Large display type sits across the lower half of
this image, over a dark scrim, so keep the subject out of the bottom third and
leave air. Shoot vertical-safe — the mobile crop takes the centre third, so the
subject must survive being cut to a tall frame.

**Alt text on the site:** "An athlete mid-stride, fabric pulled taut by the movement"

---

## 2. `split-everyday` — the solitary frame

**Path:** `public/images/split/everyday.jpg`
**Ratio:** 3:4 (portrait)

Sportswear worn **off** the field. One person walking a street, crossing a
campus, waiting somewhere, in transit. Not training, not warming up.

The garment should read as everyday clothing that happens to perform — the
proposition is "I can live in this," not "I compete in this."

Calm, unposed, real light. This frame is quiet on purpose; it is the counterweight
to the team frame beside it.

**Alt text on the site:** "A person wearing sportswear on a city street"

---

## 3. `split-teamwear` — the collective frame

**Path:** `public/images/split/teamwear.jpg`
**Ratio:** 3:4 (portrait)

Three or more people in **matching kit**, photographed as a unit rather than as
individuals. Identical garments, shared identity, one group.

Court, pitch or ground. This sits directly beside the everyday frame on the site
and has to read as its opposite at a glance: collective where that one is
solitary, uniform where that one is personal.

Both frames carry a dark scrim and white type in their lower half — same
composition rule as the hero, keep the lower third clear.

**Alt text on the site:** "A team in matching kit, photographed together"

---

## 4. `fabric-macro` — the material frame

**Path:** `public/images/fabric/macro.jpg`
**Ratio:** 1:1 (square)

Extreme macro of the **actual jersey fabric**. Weave, yarn, mesh ventilation,
a stitch line crossing the frame.

Raking light across the surface so the texture has genuine relief and depth —
flat lighting kills this shot. Shallow depth of field is fine; the falloff sells
the scale.

This is the frame that turns a specification into a material. A customer who
cannot touch the cloth judges it here.

**Alt text on the site:** "Macro detail of performance fabric showing weave and stitching"

---

## A note on people in frame

Anyone recognisable in these images needs a signed model release before the site
goes live, since this is commercial use. That is why no stock photography of
identifiable athletes was used to fill these slots in the meantime.

---

## 5. `movement-editorial` — the lifestyle counterpart

**Path:** `public/images/editorial/movement.jpg`
**Ratio:** 4:5 (portrait)

Sits directly beside a macro fabric frame on the homepage, in the section that
carries the site's signature device (brief 30). The two halves scroll at
different speeds, so this frame reads as the human world moving past a fixed
material.

One athlete in motion, framed wide enough that the environment is legible —
Islamabad street, Margalla trail, court, or concrete architecture. Pakistan
embedded as place, not decoration: no flags, no truck art, no national
symbolism.

**Composition:** the mobile layout stacks this above the texture, so the
vertical crop has to survive. Keep the upper third calm — display type crosses
it, over a dark scrim.

**Alt text on the site:** "An athlete moving through a city environment"
