import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { resolveSlot } from "@/lib/images";
import { GARMENTS, SPORTS } from "@/data/teamwear";
import { QuoteRequest } from "@/components/teamwear/QuoteRequest";

export const metadata: Metadata = {
  title: "Custom teamwear",
  description:
    "Custom kit built to order — your colours, your crest, your players' names. Configure it and see it as you go.",
};

const PROCESS = [
  {
    heading: "Configure",
    body: "Pick the sport and the garment, set your colours, place your crest and add names and numbers. The drawing updates as you go, so you are choosing against something you can see.",
  },
  {
    heading: "Request",
    body: "Send the configuration with your contact details. Nothing is charged at this stage — it starts a conversation, not an order.",
  },
  {
    heading: "Proof",
    body: "We come back with a production proof and a firm price against your quantity, sizes and print method before anything is cut.",
  },
  {
    heading: "Produce",
    body: "Once the proof is signed off, the run goes into production and we confirm a delivery window against your fixture list.",
  },
];

export default function Page() {
  const team = resolveSlot("split-teamwear");
  const minimum = Math.min(...GARMENTS.map((g) => g.minimumOrder));

  return (
    <>
      <PageHeader
        kicker="Custom teamwear"
        title="For your team's next move."
        lede="Cricket, football, basketball, volleyball, training and everything between. Your colours, your crest, your players' names — configured in the browser and proofed before anything is cut."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/teamwear/build" size="lg">
            Build your team
          </ButtonLink>
          <ButtonLink href="/teamwear/manufacturing" variant="outline" size="lg">
            How it is made
          </ButtonLink>
        </div>
      </PageHeader>

      <div className="gutter pb-[clamp(3rem,7vw,6rem)]">
        <BrandImage slot={team} sizes="100vw" className="w-full" />
      </div>

      <section aria-labelledby="process-heading" className="gutter pb-[clamp(4rem,9vw,7rem)]">
        <h2 id="process-heading" className="text-spec text-muted">
          The process
        </h2>

        <Reveal stagger className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <div key={step.heading}>
              <p className="text-spec text-accent-text">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div aria-hidden className="mt-4 h-px w-full bg-line" />
              <h3 className="mt-5 font-display text-[1.375rem] font-extrabold tracking-[-0.02em]">
                {step.heading}
              </h3>
              <p className="mt-3 max-w-[38ch] text-muted">{step.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="range-heading" className="bg-surface">
        <div className="gutter py-[clamp(4rem,9vw,7rem)]">
          <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <h2 id="range-heading" className="text-spec text-muted">
                What we make
              </h2>
              <p
                className="mt-6 max-w-[34ch] font-display text-title font-extrabold tracking-[-0.02em]"
              >
                Six garments, six sports, from {minimum} units.
              </p>
              <p className="mt-6 max-w-[42ch] text-muted">
                Minimums vary by garment because the setup cost does. They are
                listed against each piece rather than buried in a quote.
              </p>
            </div>

            <div>
              <dl className="border-t border-line-strong">
                {GARMENTS.map((garment) => (
                  <div
                    key={garment.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line-strong py-4"
                  >
                    <dt className="font-display text-[1.125rem] font-extrabold tracking-[-0.015em]">
                      {garment.name}
                    </dt>
                    <dd className="text-spec text-muted">
                      From {garment.minimumOrder} units
                    </dd>
                    <dd className="text-small w-full text-muted">
                      {garment.sports
                        .map((s) => SPORTS.find((sport) => sport.id === s)?.name ?? s)
                        .join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="text-spec mt-6 text-muted">
                Demo figures. Minimum quantities are placeholder values pending
                confirmation against real production capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="gutter py-[clamp(4rem,9vw,8rem)]">
        <h2
          className="max-w-[18ch] font-display"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
            letterSpacing: "var(--text-display--letter-spacing)",
          }}
        >
          Start with your sport.
        </h2>
        <p className="mt-6 max-w-[54ch] text-[0.9375rem] leading-[1.6] text-muted">
          Configure the kit yourself and see it as you go — or, if you just need a number to take
          to a committee, ask for a quote instead.
        </p>
        <ButtonLink href="/teamwear/build" size="lg" className="mt-10">
          Build your team
        </ButtonLink>
      </section>

      {/* The lower-commitment path. Most enquiries are not ready to configure. */}
      <section aria-labelledby="quote-heading" className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <div className="max-w-[54rem]">
          <QuoteRequest />
        </div>
      </section>
    </>
  );
}
