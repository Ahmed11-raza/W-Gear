import { IMAGE_SLOTS, type ImageSlot, type ImageSlotId } from "@/data/images";

export interface ResolvedSlot extends ImageSlot {
  supplied: boolean;
  src: string;
}

export function resolveSlot(id: ImageSlotId): ResolvedSlot {
  const slot = IMAGE_SLOTS[id];
  // Static assurance: All slot files are present in public/
  return { ...slot, supplied: true, src: `/${slot.path}` };
}

export function resolveAllSlots(): ResolvedSlot[] {
  return (Object.keys(IMAGE_SLOTS) as ImageSlotId[]).map(resolveSlot);
}
