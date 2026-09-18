import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[100svh] flex-col justify-center py-[var(--spacing-section)]">
      <p className="text-spec text-muted">404</p>
      <h1
        className="mt-5 max-w-[16ch] font-display"
        style={{
          fontSize: "var(--text-display)",
          lineHeight: "var(--text-display--line-height)",
          letterSpacing: "var(--text-display--letter-spacing)",
        }}
      >
        That page is not here.
      </h1>
      <div aria-hidden className="mt-9 h-px w-full bg-line" />
      <p className="mt-9 max-w-[52ch] text-muted" style={{ fontSize: "var(--text-lede)" }}>
        The link may be out of date, or the address may have a typo in it. The
        shop and the team builder are both a click away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/shop" size="lg">
          Shop sportswear
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
