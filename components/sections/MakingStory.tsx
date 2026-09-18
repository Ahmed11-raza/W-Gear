import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Manufacturing credibility — Sialkot technical craftsmanship.
 *
 * Sialkot is the undisputed global epicentre of sports garment engineering,
 * manufacturing kit for the FIFA World Cup and premier international athletic houses.
 * This section details the four precise stages of technical garment construction.
 */

const STEPS = [
  {
    n: "01",
    heading: "Cloth selection & Sialkot milling",
    body: "Custom-knitted circular jersey and micro-mesh engineered from high-tenacity technical yarns. Breathability and capillary cooling tested against Pakistan's summer humidity.",
  },
  {
    n: "02",
    heading: "Anatomical block grading",
    body: "Patterns are cut from individual athletic blocks rather than scaled mechanically from a single sample. Proportions remain true across every size from S to 3XL.",
  },
  {
    n: "03",
    heading: "Precision flatlock seaming",
    body: "Six-thread flatlock stitching sits completely flush against skin to prevent friction burn during training. Reinforcement bar-tacks anchor pocket openings and high-tension stress points.",
  },
  {
    n: "04",
    heading: "Sample inspection & batch verification",
    body: "Every single piece is individual-garment steam-pressed, checked for seam elasticity, and inspected against master tolerance sheets before final boxing.",
  },
];

export function MakingStory() {
  return (
    <section aria-labelledby="making-heading" className="gutter py-[var(--spacing-section)]">
      <div className="shell">
        <div className="grid gap-x-[clamp(2rem,5vw,6rem)] gap-y-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-[9rem]">
            <p className="text-spec text-muted">Sialkot Craftsmanship</p>
            <h2
              id="making-heading"
              className="mt-5 max-w-[12ch] font-display"
              style={{
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
                letterSpacing: "var(--text-display--letter-spacing)",
              }}
            >
              Engineered in Sialkot.
            </h2>
            <p className="mt-4 text-small text-muted max-w-[36ch] leading-relaxed">
              Constructed in Pakistan&apos;s historic sporting goods capital, where the world&apos;s finest performance gear has been cut and sewn for over a century.
            </p>
            <Link
              href="/teamwear/manufacturing"
              className="mt-6 inline-block text-[0.9375rem] text-ink underline decoration-line-strong underline-offset-[6px] transition-colors duration-[180ms] hover:decoration-ink"
            >
              The full manufacturing process &rarr;
            </Link>
          </div>

          <Reveal stagger as="ol" className="flex flex-col border-t border-line">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="grid gap-x-8 gap-y-3 border-b border-line py-8 sm:grid-cols-[4rem_1fr]"
              >
                <p className="text-spec text-accent-text">{step.n}</p>
                <div>
                  <h3 className="font-display text-[1.375rem] font-extrabold tracking-[-0.02em]">
                    {step.heading}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
