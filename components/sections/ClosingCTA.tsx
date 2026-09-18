import { ButtonLink } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";

/**
 * Final CTA (brief 11 §12).
 *
 * Typographic rather than decorated. The two paths out are the same two the
 * hero opened with and the brand split named — the page closes the loop it
 * started rather than introducing a third idea at the end.
 */
export function ClosingCTA() {
  return (
    <section aria-labelledby="closing-heading" className="gutter py-[var(--spacing-section)]">
      <div className="shell">
        <p className="text-spec text-muted">{BRAND.contact.city}</p>

        <h2
          id="closing-heading"
          className="mt-6 max-w-[13ch] font-display"
          style={{
            fontSize: "var(--text-hero)",
            lineHeight: "var(--text-hero--line-height)",
            letterSpacing: "var(--text-hero--letter-spacing)",
          }}
        >
          Made to move.
        </h2>

        <div aria-hidden className="mt-[clamp(2rem,5vw,3.5rem)] h-px w-full bg-line" />

        <div className="mt-[clamp(2rem,5vw,3rem)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[40ch] text-muted" style={{ fontSize: "var(--text-lede)" }}>
            Performance wear for the way you actually move &mdash; and custom kit
            for the teams that move together.
          </p>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop sportswear
            </ButtonLink>
            <ButtonLink href="/teamwear/build" variant="outline" size="lg">
              Build your team
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
