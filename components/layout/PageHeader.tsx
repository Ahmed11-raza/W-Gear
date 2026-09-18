import type { ReactNode } from "react";

/**
 * The top of every interior route.
 *
 * Fixed header sits over the page, so the top padding here is what stops the
 * first line of type from being covered on load.
 */
export function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="gutter pt-[clamp(7rem,14vw,11rem)] pb-[clamp(2.5rem,5vw,4rem)]">
      <p className="text-spec text-muted">{kicker}</p>
      <h1
        className="mt-5 max-w-[18ch] font-display"
        style={{
          fontSize: "var(--text-display)",
          lineHeight: "var(--text-display--line-height)",
          letterSpacing: "var(--text-display--letter-spacing)",
        }}
      >
        {title}
      </h1>

      <div aria-hidden className="mt-9 h-px w-full bg-line" />

      {lede && (
        <p className="mt-9 max-w-[56ch] text-muted" style={{ fontSize: "var(--text-lede)" }}>
          {lede}
        </p>
      )}

      {children}
    </header>
  );
}
