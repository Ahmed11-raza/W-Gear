/**
 * IMAGE SLOT REGISTRY
 *
 * Every photograph the site expects is declared here with the brief for the
 * shot. Drop a file at `public/<path>` and the slot fills automatically — no
 * code change. Until then the slot renders a marked placeholder carrying this
 * same brief, so the composition is judgeable and nothing pretends to be real.
 *
 * `SHOTLIST.md` is generated from this file.
 */

export interface ImageSlot {
  id: string;
  /** Path under `public/`. */
  path: string;
  /** Written for the photographer: what this frame has to do. */
  brief: string;
  /** Real alt text for the intended subject (brief 40). */
  alt: string;
  /** width / height. Drives the aspect-ratio box that prevents CLS. */
  ratio: number;
  /** Above the fold — gets `priority`. Exactly one slot per route. */
  priority?: boolean;
}

export const IMAGE_SLOTS = {
  "hero-primary": {
    id: "hero-primary",
    path: "images/hero/primary.jpg",
    brief:
      "The opening frame of a campaign, not a banner. One athlete mid-movement, shot so the fabric is visibly reacting — a shirt catching air, a sleeve under tension. Hard directional light that reveals seams and weave. Urban or trail environment, Islamabad or Margalla, embedded not decorative. Frame loose enough that display type can sit across the image without covering the subject. Shoot vertical-safe: the mobile crop takes the centre third.",
    alt: "An athlete mid-stride, fabric pulled taut by the movement",
    ratio: 16 / 9,
    priority: true,
  },
  "split-everyday": {
    id: "split-everyday",
    path: "images/split/everyday.jpg",
    brief:
      "One person, sportswear worn off the field — walking a street, on campus, in transit. Not training. The garment reads as everyday clothing that happens to perform. Calm, unposed, real light.",
    alt: "A person wearing sportswear on a city street",
    ratio: 3 / 4,
  },
  "split-teamwear": {
    id: "split-teamwear",
    path: "images/split/teamwear.jpg",
    brief:
      "A team in matching kit — three or more people, shot as a unit rather than as individuals. Identical garments, shared identity. Court, pitch or ground. The counterweight to the everyday frame: collective where that one is solitary.",
    alt: "A team in matching kit, photographed together",
    ratio: 3 / 4,
  },
  "fabric-macro": {
    id: "fabric-macro",
    path: "images/fabric/macro.jpg",
    brief:
      "Extreme macro of the actual jersey fabric — weave, yarn, mesh ventilation, stitch line. Raking light so the surface has relief. This is the shot that makes a specification feel like a material.",
    alt: "Macro detail of performance fabric showing weave and stitching",
    ratio: 1,
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotId = keyof typeof IMAGE_SLOTS;
