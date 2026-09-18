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
