"use client";
import { SPORTS, COLORWAYS, PATTERNS, LOGO_PLACEMENTS, getGarment } from "@/data/teamwear";
import type { TeamwearConfiguration } from "@/types";
import { Button } from "@/components/ui/Button";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; reference: string };

function colorName(hex: string) {
  return COLORWAYS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex.toUpperCase();
}

export function ReviewStep({
  state,
  submit,
  submitState,
  onRetry,
}: {
  state: TeamwearConfiguration;
  submit: () => void;
  submitState: SubmitState;
  onRetry: () => void;
}) {
  const garment = getGarment(state.garment);
  const sport = SPORTS.find((s) => s.id === state.sport);

  if (submitState.status === "success") {
    return (
      <div className="max-w-xl">
        <p className="text-spec text-muted">Request received</p>
        <h3 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1] tracking-[-0.03em]">
          We have your brief.
        </h3>
        <p className="mt-5 text-muted">
          Your reference is{" "}
          <span className="text-spec text-ink">{submitState.reference}</span>. Keep it
          for any follow-up.
        </p>
        <div className="mt-8 border border-line-strong bg-surface p-5">
          <p className="text-spec text-muted">Prototype notice</p>
          <p className="mt-3 text-[0.875rem] leading-[1.6] text-ink">
            This build has no order system connected. Your request was validated
            and given a reference, but it has not reached a real inbox and nobody
            has been notified. Nothing here should be treated as a placed order.
          </p>
        </div>
      </div>
    );
  }

  const rows: [string, string][] = [
    ["Sport", sport?.name ?? "—"],
    ["Garment", garment?.name ?? "—"],
    ["Pattern", PATTERNS.find((p) => p.id === state.pattern)?.name ?? "—"],
    ...(garment?.regions.map(
      (r) => [r.label, colorName(state.colors[r.id] ?? r.defaultColor)] as [string, string],
    ) ?? []),
    ["Quantity", `${state.quantity} units`],
    ["Logo placement", LOGO_PLACEMENTS.find((p) => p.id === state.logoPlacement)?.name ?? "—"],
    ["Logo file", state.logo?.name ?? "Not supplied"],
    ["Sponsor file", state.sponsor?.name ?? "Not supplied"],
    ["Contact", state.contact.name || "—"],
    ["Organisation", state.contact.organisation || "—"],
    ["WhatsApp", state.contact.whatsapp || "—"],
    ["Email", state.contact.email || "—"],
  ];

  return (
    <div className="max-w-2xl">
      <dl className="border-t border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
            <dt className="text-spec text-muted">{label}</dt>
            <dd className="text-right text-[0.9375rem]">{value}</dd>
          </div>
        ))}
      </dl>

      {submitState.status === "error" && (
        <div role="alert" className="mt-6 border-l-2 border-danger bg-surface p-4">
          <p className="text-[0.875rem] text-danger">{submitState.message}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 min-h-[44px] text-[0.75rem] uppercase tracking-[0.1em] underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        onClick={submit}
        disabled={submitState.status === "submitting"}
        className="mt-8 w-full sm:w-auto"
      >
        {submitState.status === "submitting" ? "Sending…" : "Get my team design"}
      </Button>

      <p aria-live="polite" className="sr-only">
        {submitState.status === "submitting" ? "Sending your request" : ""}
      </p>

      <p className="mt-5 max-w-[52ch] text-[0.8125rem] text-muted">
        The preview approximates print placement and colour. It does not
        simulate how fabric drapes or how ink sits on a knit. We confirm final
        artwork with you before anything is cut.
      </p>
    </div>
  );
}
