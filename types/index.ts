/**
 * Domain model (brief 41).
 *
 * The UI reads these shapes and nothing else. The mock adapter in `data/` can
 * be swapped for a CMS, Shopify, or a custom backend without the UI changing.
 */

export type Currency = "PKR";

export type SizeCode = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type SportId =
  | "cricket"
  | "football"
  | "basketball"
  | "volleyball"
  | "training"
  | "other";

export type GarmentId =
  | "jersey"
  | "shorts"
  | "training-kit"
  | "tracksuit"
  | "tshirt"
  | "polo";

/** A tintable region of a garment template. Maps to SVG layer ids. */
export interface KitRegion {
  id: string;
  label: string;
  /** Default fill, overridden per-configuration. */
  defaultColor: string;
}

export interface Garment {
  id: GarmentId;
  name: string;
  /** Sports this garment is offered for. */
  sports: SportId[];
  /** Tintable regions on the SVG template. */
  regions: KitRegion[];
  /** Supports a printed player name. */
  supportsName: boolean;
  /** Supports a printed player number. */
  supportsNumber: boolean;
  minimumOrder: number;
}

export interface Sport {
  id: SportId;
  name: string;
  /** One line describing what this sport's kit has to handle. */
  note: string;
}

export interface Colorway {
  id: string;
  name: string;
  hex: string;
}

export interface Pattern {
  id: string;
  name: string;
}

/** A single logo/artwork upload attached to a teamwear request. */
export interface UploadedAsset {
  id: string;
  name: string;
  size: number;
  type: string;
  /** Object URL for local preview. Revoked on removal. */
  previewUrl: string;
}

export type LogoPlacement = "chest-left" | "chest-centre" | "back-upper" | "sleeve";

export interface TeamwearConfiguration {
  sport: SportId | null;
  garment: GarmentId | null;
  /** region id -> hex */
  colors: Record<string, string>;
  pattern: string;
  playerName: string;
  playerNumber: string;
  quantity: number;
  logo: UploadedAsset | null;
  sponsor: UploadedAsset | null;
  logoPlacement: LogoPlacement;
  contact: {
    name: string;
    whatsapp: string;
    email: string;
    organisation: string;
  };
}

/* ==========================================================================
   STOREFRONT MODEL
   The UI reads these shapes only. `data/products.ts` is a mock adapter and can
   be replaced by a CMS or commerce backend without any component changing.
   ========================================================================== */

/** Minor units (paisa) are not used — PKR is quoted in whole rupees. */
export type Price = number;

export type ProductLine = "everyday" | "training" | "field";

export type FitProfile = "regular" | "athletic" | "relaxed";

/** A garment silhouette the procedural renderer knows how to draw. */
export type Silhouette =
  | "tee"
  | "polo"
  | "longsleeve"
  | "tank"
  | "shorts"
  | "joggers"
  | "jacket"
  | "hoodie"
  | "jersey";

/** One measurable claim about the cloth. Rendered in the technical voice. */
export interface Specification {
  label: string;
  value: string;
}

export interface ProductColorway {
  id: string;
  name: string;
  /** Primary body colour. */
  hex: string;
  /** Secondary — trim, panel, collar. */
  accentHex: string;
}

export interface ProductVariant {
  size: SizeCode;
  /** Demo stock figure. Drives the disabled state on the size selector. */
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  line: ProductLine;
  silhouette: Silhouette;
  price: Price;
  compareAtPrice?: Price;
  currency: Currency;
  category?: string;
  campaignName?: string;
  salePercent?: number;
  imagePath?: string;
  images?: string[];
  /** One line under the name in the grid. */
  summary: string;
  /** Two or three paragraphs on the product page. */
  description: string[];
  fit: FitProfile;
  specifications: Specification[];
  features: string[];
  colorways: ProductColorway[];
  variants: ProductVariant[];
  /** Collection slugs this product belongs to. */
  collections: string[];
  /** Surfaces it on the shop landing rail. */
  featured?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  /** Sits under the collection title. */
  tagline: string;
  description: string;
  /** Display accent, drawn from the palette. */
  accentHex: string;
}

export interface Story {
  slug: string;
  title: string;
  /** ISO 8601. Drives ordering and `<time dateTime>`. */
  date: string;
  category: string;
  /** Standfirst — the paragraph under the headline. */
  standfirst: string;
  readingMinutes: number;
  /** Body as markdown-lite: `## ` opens a section, blank line splits blocks. */
  body: string[];
}

/** One line of a cart. Colour and size together identify what was chosen. */
export interface CartLine {
  productSlug: string;
  colorwayId: string;
  size: SizeCode;
  quantity: number;
}
