import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_SLOTS, type ImageSlot, type ImageSlotId } from "@/data/images";

export interface ResolvedSlot extends ImageSlot {
  /** True when a real file exists at `public/<path>`. */
  supplied: boolean;
  /** Web path, only meaningful when supplied. */
  src: string;
}

/**
 * Resolve a slot against the filesystem at render time. Server-only: the check
 * runs where `public/` exists, and the result is passed to client components as
 * plain data.
 */
export function resolveSlot(id: ImageSlotId): ResolvedSlot {
  const slot = IMAGE_SLOTS[id];
  const supplied = existsSync(join(process.cwd(), "public", slot.path));
  return { ...slot, supplied, src: `/${slot.path}` };
}

export function resolveAllSlots(): ResolvedSlot[] {
  return (Object.keys(IMAGE_SLOTS) as ImageSlotId[]).map(resolveSlot);
}
