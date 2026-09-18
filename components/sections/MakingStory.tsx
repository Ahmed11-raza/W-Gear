import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Manufacturing credibility (brief 11 §8, brief 19).
 *
 * A numbered editorial sequence, not three feature cards (brief 59). It
 * describes the route a garment takes and claims nothing about capacity,
 * certification, factory partners or output — none of which are known
 * (brief 53). What it establishes is that the people behind this understand
 * what happens to cloth, which is a different and defensible claim.
 */

const STEPS = [
  {
    n: "01",
    heading: "Cloth first",
    body: "The material is chosen before the garment is drawn. Weight, composition and knit structure decide what a piece can do; everything after that is a decision made downstream of the cloth.",
  },
  {
    n: "02",
    heading: "Cut to a block",
    body: "Patterns are graded from a block rather than scaled from a single size, which is why a 2XL is shaped like a 2XL instead of an enlarged medium.",
  },
  {
    n: "03",
    heading: "Seamed for the movement",
    body: "Flatlock where the seam sits against skin, overlock and coverstitch where strength matters more than profile, bar tacks at the points that actually fail.",
  },
  {
    n: "04",
    heading: "Finished and checked",
    body: "Pressed, trimmed and checked piece by piece against the approved sample before it is boxed.",
  },
];

export function MakingStory() {
  return (
    <section aria-labelledby="making-heading" className="gutter py-[var(--spacing-section)]">
      <div className="shell">
        <div className="grid gap-x-[clamp(2rem,5vw,6rem)] gap-y-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-[9rem]">
            <p className="text-spec text-muted">How it is made</p>
            <h2
              id="making-heading"
              className="mt-5 max-w-[12ch] font-display"
              style={{
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
                letterSpacing: "var(--text-display--letter-spacing)",
              }}
            >
              From fabric to field.
            </h2>
            <Link
              href="/teamwear/manufacturing"
              className="mt-8 inline-block text-[0.9375rem] text-ink underline decoration-line-strong underline-offset-[6px] transition-colors duration-[180ms] hover:decoration-ink"
            >
              The full process
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
