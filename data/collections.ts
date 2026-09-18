import type { Collection } from "@/types";

/**
 * DEMO COLLECTIONS.
 *
 * Sample groupings written to demonstrate the collection routes. Product
 * membership is declared on each product, not here, so a product can sit in
 * more than one without the two files disagreeing.
 */

export const COLLECTIONS: Collection[] = [
  {
    slug: "everyday",
    name: "Everyday",
    tagline: "Performance wear that does not announce itself.",
    description:
      "The pieces that get worn on the days there is no session. Cut and finished to the same standard as the training line, in colours that do not look out of place away from a gym.",
    accentHex: "#b85d3b",
  },
  {
    slug: "training",
    name: "Training",
    tagline: "Built for the hour that actually costs you something.",
    description:
      "Lighter, closer, and engineered around heat and range of movement. Every piece in this collection is knitted or cut to solve one specific problem that shows up mid-session.",
    accentHex: "#2c3e35",
  },
  {
    slug: "field",
    name: "Field",
    tagline: "Match kit, sold one at a time or eleven.",
    description:
      "The sport-specific end of the range. These are the same blanks the teamwear builder starts from — order a single piece here, or configure a full side with your colours and crest.",
    accentHex: "#1d4ed8",
  },
  {
    slug: "layers",
    name: "Layers",
    tagline: "For the start of the session and the end of the day.",
    description:
      "Outerwear and mid-weights for cold starts, trail wind and the walk home. Sized to go over the rest of the range without pulling across the shoulder.",
    accentHex: "#475569",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
