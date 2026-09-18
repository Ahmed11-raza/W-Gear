import type { Sport, Garment, Colorway, Pattern } from "@/types";

/**
 * Teamwear configuration data (brief 42).
 * Structured, not hard-coded into the configurator component.
 */

export const SPORTS: Sport[] = [
  { id: "cricket", name: "Cricket", note: "Long innings, high sun, full sleeves optional." },
  { id: "football", name: "Football", note: "Ninety minutes of sprint and recovery." },
  { id: "basketball", name: "Basketball", note: "Indoor heat, constant vertical movement." },
  { id: "volleyball", name: "Volleyball", note: "Dives, court friction, shoulder range." },
  { id: "training", name: "Training", note: "Session wear that survives repeat washing." },
  { id: "other", name: "Something else", note: "Tell us the sport and we will spec it." },
];

const STANDARD_REGIONS = [
  { id: "body", label: "Body", defaultColor: "#1c1917" },
  { id: "panel", label: "Side panel", defaultColor: "#b85d3b" },
  { id: "collar", label: "Collar & cuffs", defaultColor: "#f9f8f6" },
];

export const GARMENTS: Garment[] = [
  {
    id: "jersey",
    name: "Jersey",
    sports: ["cricket", "football", "basketball", "volleyball"],
    regions: STANDARD_REGIONS,
    supportsName: true,
    supportsNumber: true,
    minimumOrder: 10,
  },
  {
    id: "shorts",
    name: "Shorts",
    sports: ["football", "basketball", "volleyball", "training"],
    regions: [
      { id: "body", label: "Body", defaultColor: "#1c1917" },
      { id: "panel", label: "Side stripe", defaultColor: "#b85d3b" },
    ],
    supportsName: false,
    supportsNumber: true,
    minimumOrder: 10,
  },
  {
    id: "training-kit",
    name: "Training kit",
    sports: ["cricket", "football", "basketball", "volleyball", "training", "other"],
    regions: STANDARD_REGIONS,
    supportsName: true,
    supportsNumber: false,
    minimumOrder: 12,
  },
  {
    id: "tracksuit",
    name: "Tracksuit",
    sports: ["cricket", "football", "basketball", "volleyball", "training", "other"],
    regions: STANDARD_REGIONS,
    supportsName: true,
    supportsNumber: false,
    minimumOrder: 12,
  },
  {
    id: "tshirt",
    name: "T-shirt",
    sports: ["training", "other"],
    regions: [
      { id: "body", label: "Body", defaultColor: "#1c1917" },
      { id: "collar", label: "Collar", defaultColor: "#f9f8f6" },
    ],
    supportsName: true,
    supportsNumber: false,
    minimumOrder: 20,
  },
  {
    id: "polo",
    name: "Polo",
    sports: ["cricket", "training", "other"],
    regions: STANDARD_REGIONS,
    supportsName: true,
    supportsNumber: false,
    minimumOrder: 20,
  },
];

export const COLORWAYS: Colorway[] = [
  { id: "obsidian", name: "Obsidian", hex: "#1c1917" },
  { id: "chalk", name: "Chalk", hex: "#f9f8f6" },
  { id: "clay", name: "Clay", hex: "#b85d3b" },
  { id: "cypress", name: "Cypress", hex: "#2c3e35" },
  { id: "sandstone", name: "Sandstone", hex: "#e7e3da" },
  { id: "cobalt", name: "Cobalt", hex: "#1d4ed8" },
  { id: "crimson", name: "Crimson", hex: "#9f1239" },
  { id: "marigold", name: "Marigold", hex: "#d97706" },
  { id: "forest", name: "Forest", hex: "#14532d" },
  { id: "violet", name: "Violet", hex: "#5b21b6" },
  { id: "teal", name: "Teal", hex: "#0f766e" },
  { id: "slate", name: "Slate", hex: "#475569" },
];

export const PATTERNS: Pattern[] = [
  { id: "none", name: "Solid" },
  { id: "diagonal", name: "Diagonal" },
  { id: "hoops", name: "Hoops" },
  { id: "fade", name: "Fade" },
];

export const LOGO_PLACEMENTS = [
  { id: "chest-left", name: "Left chest" },
  { id: "chest-centre", name: "Centre chest" },
  { id: "back-upper", name: "Upper back" },
  { id: "sleeve", name: "Sleeve" },
] as const;

export function garmentsForSport(sport: string | null): Garment[] {
  if (!sport) return GARMENTS;
  return GARMENTS.filter((g) => g.sports.includes(sport as Garment["sports"][number]));
}

export function getGarment(id: string | null): Garment | undefined {
  return GARMENTS.find((g) => g.id === id);
}
