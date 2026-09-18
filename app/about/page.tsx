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
    "A sportswear brand built in Islamabad, for people who move and the teams they move with.",
};

const PRINCIPLES = [
  {
    heading: "One cloth, many movements",
    body: "The same standard of cut and finish goes into a training tee as into a match jersey. There is no second-tier line here — the difference between pieces is what they are built to solve, not how carefully they were made.",
  },
  {
    heading: "Specify, do not claim",
    body: "Every garment lists weight, composition and knit structure. Numbers you can check, rather than adjectives you cannot. If we cannot measure it, we do not put it on the page.",
  },
  {
    heading: "Built where it is worn",
    body: "Designed and specified in Islamabad, for a climate most sportswear is not designed around. Humid heat is the default condition here, not an edge case.",
  },
];

export default function Page() {
  const fabric = resolveSlot("fabric-macro");

  return (
    <>
      <PageHeader
        kicker="About"
        title="Sport doesn't stop at the field."
        lede="We started with a straightforward observation: the clothes people train in are the clothes they end up living in, and almost nothing is designed for both jobs at once."
      />

      <div className="gutter pb-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal className="flex max-w-[58ch] flex-col gap-6">
            <p className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
              A sports brand in Pakistan usually means one of two things: imported
              product at a price that assumes you are not paying attention, or
              locally made kit that treats the sport as the only thing that matters
              and the wearer as an afterthought.
            </p>
            <p className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
              We are trying to sit between those. Performance construction, held to
              a standard you can read off a specification sheet, in a range that
              works on the pitch and on the walk home from it.
            </p>
            <p className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
              The teamwear side exists for the same reason. Clubs, academies and
              university sides here have been ordering kit from whoever can turn it
              around fastest, and getting exactly what that process produces. A
              builder that shows you the garment as you configure it is a small fix
              for a real problem.
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
            How we work
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
          Find us
        </h2>

        <dl className="mt-10 grid gap-x-8 gap-y-8 border-t border-line pt-10 md:grid-cols-3">
          <div>
            <dt className="text-spec text-muted">Studio</dt>
            <dd className="mt-3 text-ink">{BRAND.contact.studio}</dd>
            <dd className="mt-1 text-muted">{BRAND.contact.city}</dd>
          </div>
          <div>
            <dt className="text-spec text-muted">Hours</dt>
            <dd className="mt-3 text-ink">{BRAND.contact.hours}</dd>
          </div>
          <div>
            <dt className="text-spec text-muted">Email</dt>
            <dd className="mt-3">
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-ink"
              >
                {BRAND.contact.email}
              </a>
            </dd>
          </div>
        </dl>

        <p className="text-spec mt-10 max-w-[64ch] text-muted">
          Demonstration build. The company, address, hours and contact details
          above are sample data and do not describe a real business.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            Shop sportswear
          </ButtonLink>
          <ButtonLink href="/teamwear" variant="outline" size="lg">
            Custom teamwear
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
