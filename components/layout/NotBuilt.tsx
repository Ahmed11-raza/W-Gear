import { ButtonLink } from "@/components/ui/Button";

/**
 * An honest dead end.
 *
 * This build covers the design foundation and the three signature moments. The
 * rest of the site is architected but not built. Rather than link nowhere or
 * fake a page, these routes say plainly what exists and send you to what does
 * (brief 51/53/64).
 */
export function NotBuilt({ title, note }: { title: string; note: string }) {
  return (
    <section className="gutter flex min-h-[100svh] flex-col justify-center py-[var(--spacing-section)]">
      <p className="text-spec text-muted">Not built yet</p>
      <h1
        className="mt-5 max-w-[14ch] font-display"
        style={{
          fontSize: "var(--text-display)",
          lineHeight: "var(--text-display--line-height)",
          letterSpacing: "var(--text-display--letter-spacing)",
        }}
      >
        {title}
      </h1>
      <div aria-hidden className="mt-9 h-px w-full bg-line" />
      <p className="mt-9 max-w-[52ch] text-muted" style={{ fontSize: "var(--text-lede)" }}>
        {note}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/teamwear/build" size="lg">
          Build your team
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
