"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, MEDIA, EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";

export function Hero({ image }: { image: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
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
      <div data-hero-media className="absolute inset-0 -z-10 [&>*]:h-full [&>*]:w-full">
        {image}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgb(28 25 23 / 0.92), rgb(28 25 23 / 0.55) 42%, rgb(28 25 23 / 0.12) 75%)",
        }}
      />

      <div className="gutter relative pb-[calc(clamp(2.5rem,6vw,5rem)+var(--demo-bar))] pt-[clamp(6rem,14vw,10rem)]">
        <p data-hero-meta className="text-spec mb-[clamp(1.5rem,3vw,2.5rem)] text-canvas/70 font-semibold tracking-widest uppercase">
          Precision Sportswear &bull; Manufactured in Sialkot
        </p>

        <h1
          id="hero-heading"
          className="font-display text-canvas font-black uppercase"
          style={{
            fontSize: "var(--text-hero)",
            lineHeight: "var(--text-hero--line-height)",
            letterSpacing: "var(--text-hero--letter-spacing)",
          }}
        >
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

        <div
          data-hero-rule
          aria-hidden
          className="mt-[clamp(1.75rem,4vw,3rem)] h-px w-full origin-left bg-canvas/35"
        />

        <div className="mt-[clamp(1.75rem,4vw,2.5rem)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[42ch] text-canvas/80 leading-relaxed" style={{ fontSize: "var(--text-lede)" }}>
            Engineered for Pakistan&apos;s climate and intense urban motion. Technical everyday performance wear, with bespoke squad manufacturing for teams.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span data-hero-cta>
              <ButtonLink href="/shop" variant="inverse" size="lg">
                Enter the Store &rarr;
              </ButtonLink>
            </span>
            <span data-hero-cta>
              <ButtonLink
                href="/teamwear/build"
                size="lg"
                className="border border-canvas/45 text-canvas hover:bg-canvas hover:text-ink bg-transparent transition-colors"
              >
                Teamwear & Bulk
              </ButtonLink>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
