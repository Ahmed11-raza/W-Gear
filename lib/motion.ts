"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Motion system (brief 32/33).
 *
 * Four levels, used in proportion:
 *   L1 180ms  hover, press, swatch, icon
 *   L2 320ms  drawers, menus, accordions
 *   L3 620ms  scroll reveals, stagger
 *   L4        the three signature moments only
 *
 * Every L3/L4 behaviour is registered inside a `gsap.matchMedia()` guarded on
 * `prefers-reduced-motion`, so the reduced branch renders the final state with
 * no movement and no loss of content or function.
 */

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const DURATION = { l1: 0.18, l2: 0.32, l3: 0.62 } as const;

export const EASE = {
  /** Decelerating — entrances. */
  out: "power3.out",
  /** Symmetric — things that move under a finger. */
  inOut: "power2.inOut",
  /** Long, expensive settle — signature moments only. */
  settle: "expo.out",
} as const;

/** Media queries every timeline branches on. */
export const MEDIA = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger };
