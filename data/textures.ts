/**
 * REAL PHOTOGRAPHY.
 *
 * Unlike `data/images.ts` — which registers frames that have been briefed but
 * not shot — every file here exists on disk and is a genuine photograph of real
 * cloth, CC0 from StockSnap. Provenance is recorded in
 * `public/images/texture/CREDITS.md`.
 *
 * They are NOT photographs of this brand's garments (brief 53). Captions must
 * describe them as material studies, never as a specific product's fabric.
 */

export interface Texture {
  id: string;
  src: string;
  alt: string;
  /** What the surface reads as. Used as the on-image caption. */
  note: string;
}

export const TEXTURES: Record<string, Texture> = {
  weave: {
    id: "weave",
    src: "/images/texture/weave.jpg",
    alt: "Macro photograph of a woven fabric surface",
    note: "Plain weave",
  },
  rib: {
    id: "rib",
    src: "/images/texture/rib.jpg",
    alt: "Macro photograph of a ribbed knit surface",
    note: "Rib structure",
  },
  linen: {
    id: "linen",
    src: "/images/texture/linen.jpg",
    alt: "Macro photograph of a linen surface",
    note: "Open weave",
  },
  cloth: {
    id: "cloth",
    src: "/images/texture/cloth.jpg",
    alt: "Macro photograph of a draped cloth surface",
    note: "Drape and fall",
  },
};

export const TEXTURE_LIST: Texture[] = Object.values(TEXTURES);
