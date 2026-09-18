"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, MEDIA } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";

interface BrandSplitProps {
  everyday: ReactNode;
  teamwear: ReactNode;
}

/**
 * SIGNATURE MOMENT 2 — where the brand architecture becomes legible.
 *
 * Two worlds, one brand. The division between them IS the Cut Line: the same
 * line a cutter follows, here separating the two things made from one cloth.
 *
 * Desktop: the line tracks the pointer, and the panels give and take against
 * each other. Mobile: two stacked full-bleed panels, each complete on its own.
 * The interaction is enhancement only — both panels, both headlines and both
 * CTAs are fully present and reachable whether or not it ever runs, so nothing
 * depends on hover (brief 37).
 *
 * This is the site's only path-choice section (brief 09).
 */
export function BrandSplit({ everyday, teamwear }: BrandSplitProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        const el = root.current;
        if (!el) return;

        // GSAP writes a bare number to a CSS variable, so the percent unit is
        // applied here explicitly. quickTo keeps this on GSAP's ticker — one
        // write per frame, instead of layout thrash from a raw pointermove.
        const state = { value: 50 };
        const to = gsap.quickTo(state, "value", {
          duration: 0.55,
          ease: "power3.out",
          onUpdate: () => el.style.setProperty("--split", `${state.value}%`),
        });

        const onMove = (e: PointerEvent) => {
          const { left, width } = el.getBoundingClientRect();
          const raw = ((e.clientX - left) / width) * 100;
          // Clamped so neither side can be squeezed out of usefulness.
          to(gsap.utils.clamp(32, 68, raw));
        };
        const onLeave = () => to(50);

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section aria-labelledby="split-heading" className="bg-ink text-canvas">
      <h2 id="split-heading" className="sr-only">
        Two worlds, one brand
      </h2>

      <div
        ref={root}
        className="grid lg:h-[min(100svh,58rem)] lg:grid-cols-[var(--split)_1fr]"
        style={{ ["--split" as string]: "50%" }}
      >
        <Panel
          kicker="Everyday"
          heading="For your everyday movement."
          body="Training wear that holds up at the gym, on the trail, on campus and everywhere after. You do not have to be a professional athlete to dress like one."
          href="/shop"
          cta="Shop sportswear"
          media={everyday}
        />

        <Panel
          kicker="Teamwear"
          heading="For your team's next move."
          body="Custom kit built to order — your colours, your crest, your players' names. Cricket, football, basketball, volleyball, training and everything between."
          href="/teamwear/build"
          cta="Build your team"
          media={teamwear}
          bordered
        />
      </div>
    </section>
  );
}

function Panel({
  kicker,
  heading,
  body,
  href,
  cta,
  media,
  bordered = false,
}: {
  kicker: string;
  heading: string;
  body: string;
  href: string;
  cta: string;
  media: ReactNode;
  bordered?: boolean;
}) {
  return (
    <article
      className={
        "group relative isolate flex min-h-[80svh] flex-col justify-end overflow-hidden lg:min-h-0 " +
        (bordered ? "border-t border-canvas/20 lg:border-t-0 lg:border-l" : "")
      }
    >
      <div className="absolute inset-0 -z-10 [&>*]:h-full [&>*]:w-full">{media}</div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgb(28 25 23 / 0.92), rgb(28 25 23 / 0.55) 42%, rgb(28 25 23 / 0.18) 78%)",
        }}
      />

      <div className="gutter py-[clamp(2.5rem,5vw,4rem)]">
        <p className="text-spec text-canvas/65">{kicker}</p>
        <h3
          className="mt-4 max-w-[16ch] font-display"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
            letterSpacing: "var(--text-display--letter-spacing)",
          }}
        >
          {heading}
        </h3>
        <p className="mt-5 max-w-[42ch] text-canvas/75">{body}</p>
        <ButtonLink href={href} variant="inverse" size="lg" className="mt-8">
          {cta}
        </ButtonLink>
      </div>
    </article>
  );
}
