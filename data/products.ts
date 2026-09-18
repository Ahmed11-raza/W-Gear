import type { Product, ProductVariant, SizeCode } from "@/types";

/**
 * DEMO CATALOGUE.
 *
 * Every product, price, fabric weight and stock figure in this file is sample
 * data written to demonstrate the storefront. None of it describes a garment
 * that exists. Before launch this module is replaced by a real adapter — the
 * UI reads the `Product` shape and nothing else, so nothing downstream changes.
 *
 * Prices are PKR, whole rupees.
 */

export const SIZE_ORDER: SizeCode[] = ["XS", "S", "M", "L", "XL", "XXL"];

/** Build a full size run. `out` lists sizes that should read as sold out. */
function sizeRun(stock: number, out: SizeCode[] = []): ProductVariant[] {
  return SIZE_ORDER.map((size) => ({
    size,
    stock: out.includes(size) ? 0 : stock,
  }));
}

export const PRODUCTS: Product[] = [
  {
    slug: "meridian-training-tee",
    name: "Meridian Training Tee",
    line: "training",
    silhouette: "tee",
    price: 4200,
    currency: "PKR",
    summary: "Open-knit jersey that moves air through the session.",
    description: [
      "The tee we built first, because it is the one that gets worn most. A fine open knit with the weight taken out of the back panel, so the fabric is doing the ventilation rather than a row of laser holes doing it for show.",
      "Cut with a dropped shoulder seam that sits off the joint. Raise your arms and the hem stays where you left it — the sleeve travels instead of the body.",
    ],
    fit: "athletic",
    specifications: [
      { label: "Weight", value: "145 GSM" },
      { label: "Composition", value: "88% recycled polyester, 12% elastane" },
      { label: "Knit", value: "Open-hole jersey, back panel" },
      { label: "Care", value: "Cold wash, line dry, no softener" },
    ],
    features: [
      "Dropped shoulder seam for full overhead range",
      "Flatlock construction — no raised seam under a strap",
      "Back panel knit open for airflow",
      "Hem sits at the hip and stays there",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#b85d3b" },
      { id: "chalk", name: "Chalk", hex: "#f0ede6", accentHex: "#1c1917" },
      { id: "cypress", name: "Cypress", hex: "#2c3e35", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(18, ["XS"]),
    collections: ["training", "everyday"],
    featured: true,
  },
  {
    slug: "baseline-performance-polo",
    name: "Baseline Performance Polo",
    line: "everyday",
    silhouette: "polo",
    price: 5900,
    currency: "PKR",
    summary: "A collar that survives a full day and still sits flat.",
    description: [
      "Most performance polos fail at the collar — it curls after three washes and the garment starts looking tired long before it wears out. This one is knitted as a single piece with a bonded inner band, so it holds its line.",
      "Pique face, smooth back. The texture is on the outside where it does the work of breaking up light; the side against your skin stays flat.",
    ],
    fit: "regular",
    specifications: [
      { label: "Weight", value: "210 GSM" },
      { label: "Composition", value: "92% polyester, 8% elastane" },
      { label: "Knit", value: "Performance pique" },
      { label: "Care", value: "Cold wash, line dry" },
    ],
    features: [
      "Self-fabric collar with bonded inner band",
      "Three-button placket, horn-finish buttons",
      "Side vents at the hem",
      "Straight hem — wears tucked or loose",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#f0ede6" },
      { id: "sandstone", name: "Sandstone", hex: "#e7e3da", accentHex: "#1c1917" },
      { id: "cypress", name: "Cypress", hex: "#2c3e35", accentHex: "#f0ede6" },
      { id: "clay", name: "Clay", hex: "#b85d3b", accentHex: "#f0ede6" },
    ],
    variants: sizeRun(12),
    collections: ["everyday"],
    featured: true,
  },
  {
    slug: "ridge-training-short",
    name: "Ridge Training Short",
    line: "training",
    silhouette: "shorts",
    price: 4600,
    currency: "PKR",
    summary: "Seven-inch inseam, zip pocket, no ride.",
    description: [
      "A short that stays out of the conversation. Seven-inch inseam, gusseted so a deep squat does not pull the waistband down, and a zip pocket sized for a phone that does not swing when you run.",
      "The waistband is a flat bonded panel rather than an elastic casing — less bulk under a shirt, and nothing to roll over.",
    ],
    fit: "athletic",
    specifications: [
      { label: "Weight", value: "165 GSM" },
      { label: "Composition", value: "86% nylon, 14% elastane" },
      { label: "Inseam", value: "7 inches / 18 cm" },
      { label: "Care", value: "Cold wash, line dry" },
    ],
    features: [
      "Gusseted crotch for unrestricted squat depth",
      "Bonded flat waistband, internal drawcord",
      "Zip pocket, right hip",
      "Reflective trim at the outseam",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#b85d3b" },
      { id: "slate", name: "Slate", hex: "#475569", accentHex: "#f0ede6" },
      { id: "forest", name: "Forest", hex: "#14532d", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(22),
    collections: ["training"],
    featured: true,
  },
  {
    slug: "altitude-track-jacket",
    name: "Altitude Track Jacket",
    line: "everyday",
    silhouette: "jacket",
    price: 11500,
    currency: "PKR",
    summary: "The layer that goes over everything and under nothing.",
    description: [
      "A track jacket cut close enough to wear on its own and sized to take a tee underneath without pulling. The shoulder is set slightly forward, which is why it still looks right when your hands are in the pockets.",
      "Twin-needle topstitch down the raglan seam — a construction detail borrowed from kit that gets worn hard, kept because it reads as honest rather than decorative.",
    ],
    fit: "regular",
    specifications: [
      { label: "Weight", value: "280 GSM" },
      { label: "Composition", value: "94% polyester, 6% elastane" },
      { label: "Face", value: "Brushed tricot, matte finish" },
      { label: "Care", value: "Cold wash, line dry, do not iron" },
    ],
    features: [
      "Raglan sleeve with twin-needle topstitch",
      "Full-length YKK zip with chin guard",
      "Zip side pockets",
      "Ribbed cuff and hem",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#b85d3b" },
      { id: "cypress", name: "Cypress", hex: "#2c3e35", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(9, ["XXL"]),
    collections: ["everyday", "layers"],
  },
  {
    slug: "altitude-track-pant",
    name: "Altitude Track Pant",
    line: "everyday",
    silhouette: "joggers",
    price: 9200,
    currency: "PKR",
    summary: "Tapered, zipped at the ankle, cut to sit on a shoe.",
    description: [
      "Built as the other half of the Altitude jacket and finished to the same standard. The taper is set so the hem breaks on the shoe rather than bunching above it.",
      "Ankle zips open far enough to get a training shoe through without taking the pant off.",
    ],
    fit: "regular",
    specifications: [
      { label: "Weight", value: "280 GSM" },
      { label: "Composition", value: "94% polyester, 6% elastane" },
      { label: "Inseam", value: "30 inches / 76 cm, regular" },
      { label: "Care", value: "Cold wash, line dry, do not iron" },
    ],
    features: [
      "Tapered leg with 18 cm ankle zip",
      "Zip side pockets, single zip back pocket",
      "Bonded waistband with internal drawcord",
      "Articulated knee panel",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#b85d3b" },
      { id: "cypress", name: "Cypress", hex: "#2c3e35", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(11),
    collections: ["everyday", "layers"],
  },
  {
    slug: "contour-base-layer",
    name: "Contour Base Layer",
    line: "training",
    silhouette: "longsleeve",
    price: 5400,
    currency: "PKR",
    summary: "Close-knit long sleeve for cold starts and early trails.",
    description: [
      "A base layer knitted in zones: denser through the chest where you lose heat standing still, opened up under the arm and down the flank where you generate it moving.",
      "Thumbholes at the cuff, because the first twenty minutes of a winter run are the whole argument for owning one of these.",
    ],
    fit: "athletic",
    specifications: [
      { label: "Weight", value: "195 GSM" },
      { label: "Composition", value: "78% polyester, 22% elastane" },
      { label: "Knit", value: "Zoned body-mapped jersey" },
      { label: "Care", value: "Cold wash, line dry, no softener" },
    ],
    features: [
      "Zoned knit — dense chest, open flank",
      "Thumbhole cuffs",
      "Flatlock seams throughout",
      "Extended back hem",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#475569" },
      { id: "slate", name: "Slate", hex: "#475569", accentHex: "#f0ede6" },
      { id: "crimson", name: "Crimson", hex: "#9f1239", accentHex: "#f0ede6" },
    ],
    variants: sizeRun(14, ["XS", "XXL"]),
    collections: ["training", "layers"],
  },
  {
    slug: "field-match-jersey",
    name: "Field Match Jersey",
    line: "field",
    silhouette: "jersey",
    price: 6800,
    currency: "PKR",
    summary: "Match-weight jersey, ready for a number.",
    description: [
      "The blank the teamwear builder starts from, sold on its own for anyone who wants one without ordering for eleven people. Match weight, mesh back, and a sublimation-ready face.",
      "If you are kitting out a side rather than yourself, the builder takes the same garment and prices it by the unit.",
    ],
    fit: "athletic",
    specifications: [
      { label: "Weight", value: "155 GSM" },
      { label: "Composition", value: "100% recycled polyester" },
      { label: "Back panel", value: "Engineered mesh" },
      { label: "Care", value: "Cold wash, line dry, no iron on print" },
    ],
    features: [
      "Sublimation-ready face for names and numbers",
      "Engineered mesh back panel",
      "Set-in sleeve, bound neck",
      "Available as custom teamwear from ten units",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#b85d3b" },
      { id: "cobalt", name: "Cobalt", hex: "#1d4ed8", accentHex: "#f0ede6" },
      { id: "crimson", name: "Crimson", hex: "#9f1239", accentHex: "#f0ede6" },
      { id: "marigold", name: "Marigold", hex: "#d97706", accentHex: "#1c1917" },
    ],
    variants: sizeRun(26),
    collections: ["field"],
    featured: true,
  },
  {
    slug: "trail-running-tee",
    name: "Trail Running Tee",
    line: "training",
    silhouette: "tee",
    price: 4800,
    currency: "PKR",
    summary: "Light enough to forget, cut for a vest.",
    description: [
      "Made for the Margalla trails and the kind of humidity that makes a heavier shirt a mistake. Under a hundred and twenty grams per square metre, with the shoulder seam moved inboard so a pack strap does not sit on it.",
      "The fabric is knitted with a slight surface texture, which keeps it off the skin when it is wet.",
    ],
    fit: "athletic",
    specifications: [
      { label: "Weight", value: "118 GSM" },
      { label: "Composition", value: "90% recycled polyester, 10% elastane" },
      { label: "Knit", value: "Textured surface jersey" },
      { label: "Care", value: "Cold wash, line dry, no softener" },
    ],
    features: [
      "Inboard shoulder seam clears a pack strap",
      "Textured face holds the fabric off wet skin",
      "Reflective mark at the back hem",
      "Bonded neck tape — no label to cut out",
    ],
    colorways: [
      { id: "chalk", name: "Chalk", hex: "#f0ede6", accentHex: "#b85d3b" },
      { id: "teal", name: "Teal", hex: "#0f766e", accentHex: "#f0ede6" },
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#d97706" },
    ],
    variants: sizeRun(16),
    collections: ["training"],
  },
  {
    slug: "court-training-tank",
    name: "Court Training Tank",
    line: "field",
    silhouette: "tank",
    price: 3600,
    currency: "PKR",
    summary: "Cut wide at the arm, closed at the shoulder.",
    description: [
      "An indoor tank with a proper shoulder — wide enough through the armhole to give the joint room, narrow enough across the top that it stays put when you reach.",
      "Knitted heavier than it looks so it does not cling once the hall warms up.",
    ],
    fit: "athletic",
    specifications: [
      { label: "Weight", value: "170 GSM" },
      { label: "Composition", value: "92% polyester, 8% elastane" },
      { label: "Knit", value: "Double-face jersey" },
      { label: "Care", value: "Cold wash, line dry" },
    ],
    features: [
      "Wide armhole, closed shoulder line",
      "Double-face knit resists cling",
      "Bound armhole and neck",
      "Straight hem",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#b85d3b" },
      { id: "chalk", name: "Chalk", hex: "#f0ede6", accentHex: "#1c1917" },
      { id: "cobalt", name: "Cobalt", hex: "#1d4ed8", accentHex: "#f0ede6" },
    ],
    variants: sizeRun(19, ["XXL"]),
    collections: ["field", "training"],
  },
  {
    slug: "margalla-windbreaker",
    name: "Margalla Windbreaker",
    line: "everyday",
    silhouette: "jacket",
    price: 13500,
    currency: "PKR",
    summary: "Packs into its own pocket. Holds off a trail wind.",
    description: [
      "A shell for the weather that arrives halfway up a trail. Wind-resistant face, taped shoulder seams, and light enough that carrying it is not a decision you have to think about.",
      "It packs into the left hand pocket and clips to a belt or a pack strap.",
    ],
    fit: "relaxed",
    specifications: [
      { label: "Weight", value: "95 GSM" },
      { label: "Composition", value: "100% recycled nylon ripstop" },
      { label: "Finish", value: "PFC-free durable water repellent" },
      { label: "Care", value: "Cold wash, line dry, do not iron" },
    ],
    features: [
      "Packs into the left hand pocket",
      "Taped shoulder seams",
      "Elasticated cuff, adjustable hem",
      "Two-way front zip with storm flap",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#d97706" },
      { id: "sandstone", name: "Sandstone", hex: "#e7e3da", accentHex: "#1c1917" },
      { id: "forest", name: "Forest", hex: "#14532d", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(7, ["XS"]),
    collections: ["everyday", "layers"],
  },
  {
    slug: "session-hoodie",
    name: "Session Hoodie",
    line: "everyday",
    silhouette: "hoodie",
    price: 12400,
    currency: "PKR",
    summary: "Heavyweight loopback, cut to sit square.",
    description: [
      "A heavy loopback hoodie that keeps its shape because the body is cut on a square block rather than tapered in at the waist. It hangs off the shoulder instead of gripping the torso.",
      "The hood is two-panel with a proper lined seam — it stands up on its own rather than collapsing flat against your back.",
    ],
    fit: "relaxed",
    specifications: [
      { label: "Weight", value: "420 GSM" },
      { label: "Composition", value: "80% organic cotton, 20% recycled polyester" },
      { label: "Knit", value: "Brushed loopback" },
      { label: "Care", value: "Cold wash inside out, line dry" },
    ],
    features: [
      "Two-panel lined hood",
      "Square body block — no waist taper",
      "Ribbed cuff and hem, two-end rib",
      "Kangaroo pocket with bar-tacked corners",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#e7e3da" },
      { id: "sandstone", name: "Sandstone", hex: "#e7e3da", accentHex: "#1c1917" },
      { id: "clay", name: "Clay", hex: "#b85d3b", accentHex: "#f0ede6" },
      { id: "cypress", name: "Cypress", hex: "#2c3e35", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(13),
    collections: ["everyday", "layers"],
    featured: true,
  },
  {
    slug: "session-jogger",
    name: "Session Jogger",
    line: "everyday",
    silhouette: "joggers",
    price: 8600,
    currency: "PKR",
    summary: "The same loopback, cut to sit on the hip.",
    description: [
      "Matched to the Session Hoodie in weight and colour so the two read as a set without looking like a uniform. The rise is cut higher at the back, which is the reason it stays up without the drawcord doing all the work.",
      "Deep front pockets with a bar tack at the stress point.",
    ],
    fit: "relaxed",
    specifications: [
      { label: "Weight", value: "420 GSM" },
      { label: "Composition", value: "80% organic cotton, 20% recycled polyester" },
      { label: "Inseam", value: "28 inches / 71 cm, regular" },
      { label: "Care", value: "Cold wash inside out, line dry" },
    ],
    features: [
      "Higher back rise",
      "Deep front pockets, bar-tacked",
      "Ribbed ankle cuff",
      "Flat drawcord, metal-free tips",
    ],
    colorways: [
      { id: "obsidian", name: "Obsidian", hex: "#1c1917", accentHex: "#e7e3da" },
      { id: "sandstone", name: "Sandstone", hex: "#e7e3da", accentHex: "#1c1917" },
      { id: "cypress", name: "Cypress", hex: "#2c3e35", accentHex: "#e7e3da" },
    ],
    variants: sizeRun(15),
    collections: ["everyday"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsInCollection(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.collections.includes(slug));
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

/** Everything except the one given, sharing at least one collection. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.collections.some((c) => product.collections.includes(c)),
  ).slice(0, limit);
}

export function inStock(product: Product): boolean {
  return product.variants.some((v) => v.stock > 0);
}
