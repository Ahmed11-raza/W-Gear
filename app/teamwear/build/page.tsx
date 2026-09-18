import type { Metadata } from "next";
import { Configurator } from "@/components/teamwear/Configurator";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Build your team",
  description:
    "Design custom teamwear — choose your sport, garment, colours and artwork, and request a design for your team.",
};

export default function BuildPage() {
  return (
    <section className="gutter pb-[var(--spacing-section)] pt-[clamp(7rem,14vw,11rem)]">
      <Reveal as="header" stagger className="max-w-3xl">
        <p className="text-spec text-muted">Custom teamwear</p>
        <h1
          className="mt-5 font-display"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
            letterSpacing: "var(--text-display--letter-spacing)",
          }}
        >
          Build your team.
        </h1>
        <p className="mt-6 max-w-[54ch] text-muted" style={{ fontSize: "var(--text-lede)" }}>
          Seven steps. Everything you change shows up on the kit as you go. At the
          end we send you a proper design, not a price list.
        </p>
      </Reveal>

      <div aria-hidden className="mt-[clamp(2.5rem,6vw,4.5rem)] h-px w-full bg-line" />

      <div className="mt-[clamp(2.5rem,6vw,4rem)]">
        <Configurator />
      </div>
    </section>
  );
}
