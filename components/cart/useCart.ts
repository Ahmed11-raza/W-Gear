"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CartLine, SizeCode } from "@/types";
import { lookupProduct as getProduct } from "@/lib/catalogue";

/**
 * DEMO CART.
 *
 * State lives in this browser and nowhere else — there is no order system, no
 * payment processor and no server-side basket in this build. It persists to
 * localStorage so the cart survives a reload and the demo can be walked across
 * pages, and checkout says plainly that nothing is charged.
 *
 * This is a module-level store read through `useSyncExternalStore` rather than
 * React state seeded from an effect: localStorage is an external system, and
 * reading it into state on mount is what produces a cascading render. No
 * provider is needed — any component can call `useCart` directly.
 */

const STORAGE_KEY = "iwear.cart.v1";

interface CartState {
  lines: CartLine[];
  /** False until localStorage has been read, so the UI can avoid a flash. */
  ready: boolean;
}

const EMPTY: CartState = { lines: [], ready: false };

let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Drop anything that no longer matches a real product, colourway or size. */
function revive(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry): CartLine[] => {
    if (typeof entry !== "object" || entry === null) return [];
    const { productSlug, colorwayId, size, quantity } = entry as Record<string, unknown>;
    if (typeof productSlug !== "string" || typeof colorwayId !== "string") return [];
    if (typeof size !== "string" || typeof quantity !== "number") return [];

    const product = getProduct(productSlug);
    if (!product) return [];
    if (!product.colorways.some((c) => c.id === colorwayId)) return [];

    const variant = product.variants.find((v) => v.size === size);
    if (!variant || variant.stock < 1) return [];

    return [
      {
        productSlug,
        colorwayId,
        size: size as SizeCode,
        quantity: Math.min(Math.max(Math.trunc(quantity), 1), variant.stock),
      },
    ];
  });
}

function commit(lines: CartLine[]) {
  state = { lines, ready: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable. The cart still works for this page session.
  }
  emit();
}

function hydrate() {
  let lines: CartLine[] = [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) lines = revive(JSON.parse(raw));
  } catch {
    // Private mode, blocked storage, or corrupt JSON — start empty.
  }
  state = { lines, ready: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (!hydrated) {
    hydrated = true;
    // After the hydrating render, so server and client markup agree first.
    queueMicrotask(hydrate);
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) hydrate();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => EMPTY;

function sameLine(a: CartLine, b: CartLine): boolean {
  return a.productSlug === b.productSlug && a.colorwayId === b.colorwayId && a.size === b.size;
}

export function addLine(line: CartLine) {
  const index = state.lines.findIndex((l) => sameLine(l, line));

  if (index === -1) {
    commit([...state.lines, line]);
    return;
  }

  const product = getProduct(line.productSlug);
  const stock = product?.variants.find((v) => v.size === line.size)?.stock ?? 1;
  const next = [...state.lines];
  next[index] = {
    ...next[index],
    quantity: Math.min(next[index].quantity + line.quantity, stock),
  };
  commit(next);
}

export function setLineQuantity(index: number, quantity: number) {
  commit(
    quantity < 1
      ? state.lines.filter((_, i) => i !== index)
      : state.lines.map((line, i) => (i === index ? { ...line, quantity } : line)),
  );
}

export function removeLine(index: number) {
  commit(state.lines.filter((_, i) => i !== index));
}

export function clearCart() {
  commit([]);
}

export function useCart() {
  const { lines, ready } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => {
      const product = getProduct(l.productSlug);
      return sum + (product ? product.price * l.quantity : 0);
    }, 0);

    return { lines, ready, count, subtotal };
  }, [lines, ready]);
}
