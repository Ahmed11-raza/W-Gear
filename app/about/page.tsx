import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { resolveSlot } from "@/lib/images";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description:
    "A performance sportswear brand manufactured in Sialkot, engineered for urban movement across Pakistan.",
};

const PRINCIPLES = [
  {
    heading: "One cloth, many movements",
    body: "The same standard of cut and finish goes into a training tee as into a professional club match jersey. There is no second-tier line here — the difference between pieces is what they are built to solve, not how carefully they were made.",
  },
  {
    heading: "Specify, do not claim",
    body: "Every garment lists weight in GSM, technical composition and knit structure. Concrete metrics you can verify, rather than ambiguous lifestyle slogans.",
  },
  {
    heading: "Sialkot industrial mastery",
    body: "Proudly manufactured in Sialkot, Punjab — the historic global heart of athletic goods manufacturing that supplies world cups and global sport institutions.",
  },
];

export default function Page() {
  const fabric = resolveSlot("fabric-macro");

  return (
    <>
      <PageHeader
        kicker="About"
        title="Sport doesn't stop at the field."
        lede="The pieces people train in are the pieces they live in. We build performance sportswear engineered for Pakistan's urban climate and uncompromised everyday motion."
      />

      <div className="gutter pb-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal className="flex max-w-[58ch] flex-col gap-6">
            <p className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
              Sportswear in Pakistan has long suffered a compromise: expensive international imports with steep markups, or generic local gear that neglects tailored fit, longevity, and modern aesthetics.
            </p>
            <p className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
              W-Gear bridges this gap. We leverage Sialkot&apos;s world-class manufacturing heritage to produce athletic wear with architectural precision, premium matte finishes, and climate-adapted breathability.
            </p>
            <p className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
              From Karachi&apos;s maritime humidity to Lahore&apos;s intense summers and Islamabad&apos;s varied seasons, our pieces regulate heat and retain shape through hundreds of high-intensity cycles.
            </p>
          </Reveal>

          <Reveal>
            <BrandImage slot={fabric} sizes="(min-width: 1024px) 45vw, 100vw" />
          </Reveal>
        </div>
      </div>

      <section aria-labelledby="principles-heading" className="bg-ink text-canvas">
        <div className="gutter py-[clamp(4rem,9vw,7rem)]">
          <h2 id="principles-heading" className="text-spec text-canvas/60">
            Our Foundations
          </h2>

          <Reveal stagger className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {PRINCIPLES.map((principle, i) => (
              <div key={principle.heading}>
                <p className="text-spec text-canvas/45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 max-w-[16ch] font-display text-[1.5rem] leading-[1.1] font-extrabold tracking-[-0.02em]">
                  {principle.heading}
                </h3>
                <p className="mt-4 max-w-[38ch] text-canvas/75">{principle.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="gutter py-[clamp(4rem,9vw,8rem)]">
        <h2 id="contact-heading" className="text-spec text-muted">
          Connect & Hubs
        </h2>

        <dl className="mt-10 grid gap-x-8 gap-y-8 border-t border-line pt-10 md:grid-cols-3">
          <div>
            <dt className="text-spec text-muted">Manufacturing Facility</dt>
            <dd className="mt-3 text-ink font-semibold">{BRAND.contact.manufacturingHub}</dd>
            <dd className="mt-1 text-muted">Technical Production & Milling</dd>
          </div>
          <div>
            <dt className="text-spec text-muted">Concierge Desk</dt>
            <dd className="mt-3 text-ink font-semibold">Nationwide Dispatch</dd>
            <dd className="mt-1 text-muted">Karachi &bull; Lahore &bull; Islamabad &bull; Rawalpindi</dd>
          </div>
          <div>
            <dt className="text-spec text-muted">Digital Support</dt>
            <dd className="mt-3">
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-ink"
              >
                {BRAND.contact.email}
              </a>
            </dd>
            <dd className="mt-1 text-muted">{BRAND.contact.hours}</dd>
          </div>
        </dl>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            Explore Store
          </ButtonLink>
          <ButtonLink href="/teamwear" variant="outline" size="lg">
            Custom Teamwear
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
