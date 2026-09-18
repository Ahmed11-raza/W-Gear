"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, MEDIA, EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";

/**
 * SIGNATURE MOMENT 1 — the hero.
 *
 * Headline: "Sport doesn't stop at the field." That is the brand's actual
 * thesis (brief 03), it is specific enough that no other business could use it,
 * and it earns both commercial worlds in one line — everyday wear, and the kit
 * a team needs for the field it did start on.
 *
 * Composition is full-bleed image with type over a scrim, not text-left /
 * person-right (brief 07). The scrim is what makes the contrast deterministic:
 * chalk type reads over a dark photograph and over the light placeholder alike,
 * so the layout never depends on which image lands in the slot.
 */
export function Hero({ image }: { image: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        // Entrance — the one Level 4 moment on this route.
        gsap
          .timeline({ defaults: { ease: EASE.settle } })
          .from("[data-hero-line]", {
            yPercent: 108,
            duration: 1.15,
            stagger: 0.08,
          })
          .from("[data-hero-rule]", { scaleX: 0, duration: 0.9 }, 0.25)
          .from("[data-hero-meta]", { opacity: 0, duration: 0.7 }, 0.5)
          .from("[data-hero-cta]", { opacity: 0, y: 14, duration: 0.7, stagger: 0.06 }, 0.62);

        // Slow scrubbed drift. Background moves slower than the scroll, so the
        // frame feels like it has depth rather than sliding away.
        gsap.to("[data-hero-media]", {
          yPercent: 12,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* Media layer */}
      <div data-hero-media className="absolute inset-0 -z-10 [&>*]:h-full [&>*]:w-full">
        {image}
      </div>

      {/* Scrim — guarantees type contrast over any image, supplied or not. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgb(28 25 23 / 0.90), rgb(28 25 23 / 0.58) 38%, rgb(28 25 23 / 0.10) 72%)",
        }}
      />

      <div className="gutter relative pb-[clamp(2.5rem,6vw,5rem)] pt-[clamp(6rem,14vw,10rem)]">
        <p data-hero-meta className="text-spec mb-[clamp(1.5rem,3vw,2.5rem)] text-canvas/70">
          Everyday sportswear &nbsp;/&nbsp; Custom teamwear
        </p>

        <h1
          id="hero-heading"
          className="font-display text-canvas"
          style={{
            fontSize: "var(--text-hero)",
            lineHeight: "var(--text-hero--line-height)",
            letterSpacing: "var(--text-hero--letter-spacing)",
          }}
        >
          {/* Two lines, no more (brief 05). Each masked so it rises into place. */}
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Sport doesn&rsquo;t
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              stop at the field.
            </span>
          </span>
        </h1>

        {/* THE CUT LINE */}
        <div
          data-hero-rule
          aria-hidden
          className="mt-[clamp(1.75rem,4vw,3rem)] h-px w-full origin-left bg-canvas/35"
        />

        <div className="mt-[clamp(1.75rem,4vw,2.5rem)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[38ch] text-canvas/80" style={{ fontSize: "var(--text-lede)" }}>
            Performance wear for the way you actually move &mdash; and custom kit
            for the teams that move together.
          </p>

          <div className="flex flex-wrap gap-3">
            <span data-hero-cta>
              <ButtonLink href="/shop" variant="inverse" size="lg">
                Shop sportswear
              </ButtonLink>
            </span>
            <span data-hero-cta>
              <ButtonLink
                href="/teamwear/build"
                size="lg"
                className="border border-canvas/45 text-canvas hover:bg-canvas hover:text-ink bg-transparent"
              >
                Build your team
              </ButtonLink>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
