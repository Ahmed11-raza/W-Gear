import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { resolveSlot } from "@/lib/images";

export const metadata: Metadata = {
  title: "How it is made",
  description:
    "From an approved proof to a finished run — the steps a custom kit order goes through.",
};

const STAGES = [
  {
    stage: "Pattern",
    body: "Your garment starts from a graded block, not a guess. The size run is set against the measurements you supply, and anything unusual — a keeper's sleeve, an extended back hem — is a pattern change made before cutting rather than an alteration afterwards.",
  },
  {
    stage: "Print",
    body: "Artwork is separated and positioned against the pattern pieces, so a crest sits where it should once the garment is assembled rather than where it looked right on a flat drawing. Large areas go to sublimation; small marks on cotton go to screen.",
  },
  {
    stage: "Cut",
    body: "Printed panels are cut in a lay, which is what keeps colour consistent across a run. A side ordered in one batch comes out matching; the same kit ordered twice, months apart, can differ slightly and we will say so rather than pretend otherwise.",
  },
  {
    stage: "Assemble",
    body: "Flatlock through the body for anything worn against skin, overlock and coverstitch where strength matters more than profile. Bar tacks at the stress points — pocket corners, vent tops, drawcord exits.",
  },
  {
    stage: "Finish",
    body: "Trim, press, and a check against the approved proof piece by piece. Names and numbers are verified against your team sheet at this stage, because that is the error that is most expensive to find later.",
  },
];

export default function Page() {
  const fabric = resolveSlot("fabric-macro");

  return (
    <>
      <PageHeader
        kicker="Teamwear"
        title="From proof to finished run."
        lede="What happens between signing off a proof and a box of kit arriving. Most of what decides whether the kit lasts happens in the first two steps."
      />

      <div className="gutter pb-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <Reveal stagger as="ol" className="flex flex-col border-t border-line">
            {STAGES.map((item, i) => (
              <li key={item.stage} className="border-b border-line py-8">
                <div className="flex items-baseline gap-5">
                  <span className="text-spec text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-title font-extrabold tracking-[-0.02em]">
                    {item.stage}
                  </h2>
                </div>
                <p className="mt-4 max-w-[56ch] pl-[3.25rem] text-muted">{item.body}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="lg:sticky lg:top-[9rem]">
            <BrandImage slot={fabric} sizes="(min-width: 1024px) 38vw, 100vw" />
            <p className="text-spec mt-6 text-muted">
              Demonstration content. This describes a standard production route
              and is not a claim about a specific factory or supplier.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <ButtonLink href="/teamwear/build" size="lg">
          Build your team
        </ButtonLink>
      </section>
    </>
  );
}
