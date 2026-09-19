"use client";

import type { Product } from "@/types";

/**
 * CLIENT-SIDE CATALOGUE
 *
 * The cart needs product names, prices and stock, but it runs in the browser
 * and cannot query the database. It also looks products up outside React —
 * `revive()` validates a stored cart before any component renders — so a hook
 * or a context would be reached too late and from the wrong place.
 *
 * So the server serialises the published catalogue into a JSON script tag and
 * this reads it lazily on first use. Nothing is written during render, the data
 * is in the HTML before any component hydrates, and there is no effect to wait
 * for.
 */

export const CATALOGUE_ELEMENT_ID = "__iwear_catalogue";

let cache: Product[] | null = null;

function load(): Product[] {
  if (cache) return cache;
  if (typeof document === "undefined") return [];

  const element = document.getElementById(CATALOGUE_ELEMENT_ID);
  if (!element?.textContent) return [];

  try {
    cache = JSON.parse(element.textContent) as Product[];
  } catch {
    cache = [];
  }

  return cache;
}

export function lookupProduct(slug: string): Product | undefined {
  return load().find((p) => p.slug === slug);
}

export function allProducts(): Product[] {
  return load();
}
