"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, MEDIA } from "@/lib/motion";
import { TEXTURES } from "@/data/textures";

/**
 * THE VISUAL SIGNATURE — fabric × human (brief 30).
 *
 * A macro fabric surface holds one half of the viewport and a human frame holds
 * the other. On scroll the two travel at different speeds, so the material
 * reads as a fixed physical thing the person is moving through rather than two
 * pictures side by side. That differential is the whole device.
 *
 * The fabric half is a real photograph. The human half is a briefed slot that
 * has not been shot, so it renders the marked placeholder — which is why the
 * composition is built to work with either, and why the caption calls the
 * texture a material study rather than this brand's cloth (brief 53).
 *
 * Used sparingly: this is the homepage instance, and it should not recur on
 * every route or it stops being a signature (brief 30).
 */
export function MaterialStory({ human }: { human: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const texture = TEXTURES.weave;

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        // The two halves travel in opposite directions at different rates.
        // Small numbers: this should register as depth, not as sliding panels.
        gsap.fromTo(
          "[data-material-texture]",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );

        gsap.fromTo(
          "[data-material-human]",
          { yPercent: 5, scale: 1.02 },
          {
            yPercent: -5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="material-heading"
      className="relative overflow-hidden bg-ink text-canvas"
    >
      <div className="grid lg:grid-cols-2">
        {/* Fabric half — real photograph, over-tall so it can travel */}
        <div className="relative order-2 min-h-[70svh] overflow-hidden lg:order-1 lg:min-h-[92svh]">
          <div data-material-texture className="absolute inset-x-0 -top-[8%] h-[116%]">
            <Image
              src={texture.src}
              alt={texture.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgb(28 25 23 / 0.55), rgb(28 25 23 / 0.15))",
            }}
          />
          <p className="text-spec absolute bottom-6 left-6 text-canvas/70">
            {texture.note} &middot; material study
          </p>
        </div>

        {/* Human half — briefed slot, over-tall for the same reason */}
        <div className="relative order-1 min-h-[70svh] overflow-hidden lg:order-2 lg:min-h-[92svh]">
          <div
            data-material-human
            className="absolute inset-x-0 -top-[6%] h-[112%] [&>*]:h-full [&>*]:w-full"
          >
            {human}
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(28 25 23 / 0.82), rgb(28 25 23 / 0.28) 55%, rgb(28 25 23 / 0.10))",
            }}
          />
        </div>
      </div>

      {/* Type sits across the seam, which is what merges the two worlds */}
      <div className="pointer-events-none absolute inset-0 flex items-end">
        <div className="gutter w-full pb-[clamp(2.5rem,6vw,5rem)]">
          <div className="shell">
            <p className="text-spec text-canvas/60">The material</p>
            <h2
              id="material-heading"
              className="mt-5 max-w-[15ch] font-display"
              style={{
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
                letterSpacing: "var(--text-display--letter-spacing)",
              }}
            >
              A garment is only its cloth.
            </h2>
            <p className="mt-6 max-w-[46ch] text-canvas/75" style={{ fontSize: "var(--text-lede)" }}>
              Everything else &mdash; the cut, the seam, the print &mdash; is a
              decision made about a material that was chosen first. We publish
              the weight, the composition and the knit for every piece, because
              those three numbers are what you are actually buying.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
