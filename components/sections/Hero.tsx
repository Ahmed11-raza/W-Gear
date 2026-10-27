"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, MEDIA, EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { Sparkles, Moon, Sun, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export function Hero({ image }: { image?: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const [preface, setPreface] = useState<"midnight" | "daylight">("midnight");

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
          .from("[data-hero-chips]", { opacity: 0, y: 10, duration: 0.6 }, 0.55)
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
      {/* Background Imagery with Responsive Mobile Art Direction */}
      <div data-hero-media className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            preface === "midnight" ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* Mobile-optimized portrait crop (< 640px) */}
          <div className="relative h-full w-full sm:hidden">
            <Image
              src="/images/hero/primary-mobile.webp"
              alt="Elite sprinter accelerating in floodlit stadium in W-Gear technical kit"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-[center_top]"
            />
          </div>

          {/* Desktop/Tablet landscape view (>= 640px) */}
          <div className="relative hidden h-full w-full sm:block">
            <Image
              src="/images/hero/primary.webp"
              alt="Elite sprinter accelerating in floodlit stadium in W-Gear technical kit"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Cinematic responsive gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(16, 18, 20, 0.98) 0%, rgba(16, 18, 20, 0.88) 35%, rgba(16, 18, 20, 0.35) 65%, rgba(16, 18, 20, 0.1) 100%)",
            }}
          />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            preface === "daylight" ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          <Image
            src="/images/hero/light.jpg"
            alt="Athlete walking Islamabad stone plaza in W-Gear technical performance wear"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(20 18 16 / 0.95) 0%, rgb(20 18 16 / 0.75) 40%, rgb(20 18 16 / 0.25) 75%, rgb(20 18 16 / 0.1) 100%)",
            }}
          />
        </div>
      </div>

      {/* Preface Switcher Pill (Top Right) */}
      <div className="gutter absolute top-20 sm:top-24 right-0 z-20 flex justify-end">
        <div className="inline-flex items-center gap-1 p-1 bg-ink/75 backdrop-blur-md border border-white/15 rounded-full text-[0.6875rem] font-mono uppercase tracking-wider text-white shadow-xl">
          <button
            type="button"
            onClick={() => setPreface("midnight")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 ${
              preface === "midnight"
                ? "bg-[#C4F319] text-black font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
            aria-pressed={preface === "midnight"}
          >
            <Moon className="w-3 h-3" />
            <span>Midnight</span>
          </button>
          <button
            type="button"
            onClick={() => setPreface("daylight")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 ${
              preface === "daylight"
                ? "bg-white text-black font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
            aria-pressed={preface === "daylight"}
          >
            <Sun className="w-3 h-3" />
            <span>Daylight</span>
          </button>
        </div>
      </div>

      <div className="gutter relative pb-[calc(clamp(2rem,5vw,4.5rem)+var(--demo-bar))] pt-[clamp(5.5rem,12vw,9rem)]">
        {/* Kicker badge */}
        <div data-hero-meta className="mb-[clamp(1rem,2vw,1.75rem)] flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="text-[0.6875rem] font-mono tracking-widest uppercase font-bold text-[#C4F319] bg-[#C4F319]/10 border border-[#C4F319]/30 px-2.5 py-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            W-GEAR // ATHLETIC ATELIER
          </span>
          <span className="text-spec text-canvas/70 font-semibold tracking-widest uppercase hidden sm:inline">
            ENGINEERED PERFORMANCE // THERMO-REGULATING FABRICS
          </span>
        </div>

        {/* Brand Headline: YOUR GEAR FOR EVERY WIN */}
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
              Your <span className="text-[#C4F319]">G</span>ear for
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Every Win.
            </span>
          </span>
        </h1>

        <div
          data-hero-rule
          aria-hidden
          className="mt-[clamp(1.25rem,3vw,2.5rem)] h-px w-full origin-left bg-canvas/30"
        />

        {/* Narrative & Action Block */}
        <div className="mt-[clamp(1.25rem,3vw,2.25rem)] flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3.5 max-w-[50ch]">
            <p className="text-canvas/85 leading-relaxed font-normal text-sm sm:text-base md:text-lg">
              Engineered for high-output velocity and cold-weather training. Cut from thermo-regulating micro-knits and structured thermal fleece with zero-distraction fit &mdash; built for athletes who refuse off-seasons.
            </p>

            {/* High-trust persuasive badges */}
            <div data-hero-chips className="flex flex-wrap items-center gap-2 text-[0.75rem] text-canvas/80 font-mono">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-sm">
                <Zap className="w-3.5 h-3.5 text-[#C4F319]" />
                <span>24–48h Priority Dispatch</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
                <span>Cash on Delivery Nationwide</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-sm">
                <span>7-Day Free Exchange</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <span data-hero-cta className="w-full sm:w-auto">
              <ButtonLink
                href="/shop"
                variant="inverse"
                size="lg"
                className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] px-8 text-xs font-black tracking-widest uppercase justify-center shadow-lg"
              >
                <span>Shop Performance Gear</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </ButtonLink>
            </span>
            <span data-hero-cta className="w-full sm:w-auto">
              <ButtonLink
                href="/teamwear/build"
                size="lg"
                className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] border border-canvas/40 text-canvas hover:bg-canvas hover:text-ink bg-transparent transition-colors text-xs font-bold tracking-widest uppercase justify-center"
              >
                Custom Team Kits (10+)
              </ButtonLink>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
