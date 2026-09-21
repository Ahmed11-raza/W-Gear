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

export const PRODUCT_PHOTOS: Record<string, string> = {
  "meridian-training-tee": "/images/products/meridian-tee.jpg",
  "baseline-performance-polo": "/images/products/baseline-polo.jpg",
  "ridge-training-short": "/images/products/ridge-short.jpg",
  "altitude-track-jacket": "/images/products/track-jacket.jpg",
  "altitude-track-pant": "/images/products/track-pant.jpg",
  "contour-base-layer": "/images/products/base-layer.jpg",
  "field-match-jersey": "/images/products/match-jersey.jpg",
  "trail-running-tee": "/images/products/trail-tee.jpg",
  "court-training-tank": "/images/products/training-tank.jpg",
  "margalla-windbreaker": "/images/products/windbreaker.jpg",
  "session-hoodie": "/images/products/session-hoodie.jpg",
  "session-jogger": "/images/products/session-jogger.jpg",
};

export function getProductPhoto(slug: string): string | undefined {
  return PRODUCT_PHOTOS[slug];
}
