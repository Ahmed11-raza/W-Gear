import { KitPreview } from "@/components/teamwear/KitPreview";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GARMENTS } from "@/data/teamwear";

/**
 * Teamwear introduction (brief 11 §9).
 *
 * The homepage lead-in to the third signature moment. It shows the actual
 * configurator artwork in three colourways rather than describing what the
 * builder can do — the brief's position is that this is where the company
 * demonstrates capability instead of claiming it (brief 47).
 *
 * The kits are the real `KitPreview` component, the same one the builder
 * drives. Nothing here is a mockup of the feature; it is the feature, held
 * still.
 */

const KITS = [
  {
    label: "Cricket",
    colors: { body: "#1c1917", panel: "#b85d3b", collar: "#f9f8f6" },
    pattern: "none",
    number: "07",
  },
  {
    // KitPreview draws the number in the collar colour. Against white hoops a
    // white collar would render the number invisible, so this one goes dark.
    label: "Football",
    colors: { body: "#1d4ed8", panel: "#f9f8f6", collar: "#1c1917" },
    pattern: "hoops",
    number: "10",
  },
  {
    label: "Basketball",
    colors: { body: "#9f1239", panel: "#1c1917", collar: "#f9f8f6" },
    pattern: "diagonal",
    number: "23",
  },
];

export function TeamwearIntro() {
  const minimum = Math.min(...GARMENTS.map((g) => g.minimumOrder));

  return (
    <section aria-labelledby="teamwear-intro-heading" className="bg-ink text-canvas">
      <div className="gutter py-[var(--spacing-section)]">
        <div className="shell">
          <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <p className="text-spec text-canvas/55">Custom teamwear</p>
              <h2
                id="teamwear-intro-heading"
                className="mt-5 max-w-[14ch] font-display"
                style={{
                  fontSize: "var(--text-display)",
                  lineHeight: "var(--text-display--line-height)",
                  letterSpacing: "var(--text-display--letter-spacing)",
                }}
              >
                Your colours. Your crest.
              </h2>

              <p
                className="mt-7 max-w-[44ch] text-canvas/75"
                style={{ fontSize: "var(--text-lede)" }}
              >
                Configure a full side in the browser and watch the kit change as
                you go &mdash; colours, pattern, crest placement, names and
                numbers. No quote form, no waiting to see what you are buying.
              </p>

              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                <div>
                  <dt className="text-spec text-canvas/55">Minimum order</dt>
                  <dd className="mt-2 font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">
                    {minimum} units
                  </dd>
                </div>
                <div>
                  <dt className="text-spec text-canvas/55">Garments</dt>
                  <dd className="mt-2 font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">
                    {GARMENTS.length}
                  </dd>
                </div>
              </dl>

              <ButtonLink href="/teamwear/build" variant="inverse" size="lg" className="mt-10">
                Build your team
              </ButtonLink>
            </div>

            <Reveal stagger className="grid grid-cols-3 gap-3 sm:gap-5">
              {KITS.map((kit, i) => (
                <figure
                  key={kit.label}
                  className={
                    "border border-canvas/15 bg-canvas/[0.04] p-2 sm:p-4 " +
                    // Centre kit sits lower, so the row reads as a composition
                    // rather than three equal tiles.
                    (i === 1 ? "translate-y-5 sm:translate-y-8" : "")
                  }
                >
                  <KitPreview
                    colors={kit.colors}
                    pattern={kit.pattern}
                    playerName=""
                    playerNumber={kit.number}
                    logoUrl={null}
                    logoPlacement="chest-left"
                    showNumber
                    showName={false}
                    className="h-auto w-full"
                  />
                  <figcaption className="text-spec mt-2 text-canvas/55">{kit.label}</figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
