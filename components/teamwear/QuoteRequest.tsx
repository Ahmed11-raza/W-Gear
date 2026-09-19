"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SPORTS, GARMENTS } from "@/data/teamwear";
import { whatsappLink } from "@/lib/brand";
import { trackLead } from "@/lib/track";

/**
 * The low-friction way into teamwear.
 *
 * The configurator is the better experience, but it asks for ten minutes and a
 * decision on every colour. A coach checking options at eleven at night will
 * not start it — and until now the only alternative was WhatsApp, which not
 * everyone will open first. This form is the middle rung: seven fields, a
 * quantity, and a way to be called back.
 *
 * It posts to the same validated endpoint as the configurator, so there is one
 * delivery boundary to wire up rather than two.
 */

const MIN_ORDER = Math.min(...GARMENTS.map((g) => g.minimumOrder));

type State = "idle" | "sending" | "sent" | "error";

export function QuoteRequest() {
  const [sport, setSport] = useState(SPORTS[0].id);
  const [garment, setGarment] = useState(GARMENTS[0].id);
  const [quantity, setQuantity] = useState(String(MIN_ORDER));
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const qty = Number.parseInt(quantity, 10);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setError(null);

    try {
      const response = await fetch("/api/teamwear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          garment,
          quantity: Number.isFinite(qty) ? qty : 0,
          contact: { name, whatsapp, email },
          // Carried through so whoever picks this up has the context.
          notes: [organisation && `Organisation: ${organisation}`, notes]
            .filter(Boolean)
            .join(" — "),
        }),
      });

      const body = (await response.json()) as { message?: string; reference?: string };

      if (!response.ok) {
        setError(body.message ?? "That did not go through. Try again.");
        setState("error");
        return;
      }

      trackLead("teamwear-quote", Number.isFinite(qty) ? qty : undefined);

      setReference(body.reference ?? null);
      setState("sent");
    } catch {
      setError("That did not go through. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-line bg-surface p-8 sm:p-10">
        <p className="text-spec text-accent-text">Request received</p>
        <h3 className="mt-4 font-display text-[1.75rem] font-black tracking-[-0.02em] text-ink">
          We have your numbers.
        </h3>
        <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-[1.6] text-muted">
          {reference && (
            <>
              Your reference is <span className="font-mono text-ink">{reference}</span>.{" "}
            </>
          )}
          A quote for {qty} × {GARMENTS.find((g) => g.id === garment)?.name.toLowerCase()} normally
          comes back the same working day.
        </p>
        <p className="text-spec mt-6 border-t border-line pt-5 text-muted">
          Demonstration build — this request was validated but not delivered anywhere, and no one
          will contact you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-surface p-6 sm:p-10">
      <p className="text-spec text-accent-text">Request a quote</p>
      <h3
        id="quote-heading"
        className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-black leading-[1.05] tracking-[-0.025em] text-ink"
      >
        Tell us the numbers.
      </h3>
      <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-[1.6] text-muted">
        Not ready to configure a full kit? Leave the essentials and we will come back with pricing.
        Minimum order is {MIN_ORDER} units.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Select
          id="q-sport"
          label="Sport"
          value={sport}
          onChange={setSport}
          options={SPORTS.map((s) => ({ value: s.id, label: s.name }))}
        />
        <Select
          id="q-garment"
          label="Garment"
          value={garment}
          onChange={setGarment}
          options={GARMENTS.map((g) => ({ value: g.id, label: g.name }))}
        />
        <Field
          id="q-qty"
          label={`Approximate quantity (min ${MIN_ORDER})`}
          value={quantity}
          onChange={setQuantity}
          type="number"
        />
        <Field
          id="q-org"
          label="Club, school or company"
          value={organisation}
          onChange={setOrganisation}
          autoComplete="organization"
        />
        <Field id="q-name" label="Your name" value={name} onChange={setName} autoComplete="name" />
        <Field
          id="q-whatsapp"
          label="WhatsApp number"
          value={whatsapp}
          onChange={setWhatsapp}
          type="tel"
          autoComplete="tel"
        />
        <div className="sm:col-span-2">
          <Field
            id="q-email"
            label="Email (optional if WhatsApp given)"
            value={email}
            onChange={setEmail}
            type="email"
            autoComplete="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-notes" className="text-spec text-muted">
            Anything else — deadline, colours, crest
          </label>
          <textarea
            id="q-notes"
            value={notes}
            rows={3}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 block w-full border border-line-strong bg-canvas px-3 py-2.5 text-[0.9375rem] text-ink focus:border-ink"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-spec mt-5 text-danger">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state === "sending"}
          className={cn(
            "inline-flex min-h-[48px] items-center justify-center bg-ink px-7 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-inverse transition-colors",
            state === "sending" ? "opacity-60" : "hover:bg-accent",
          )}
        >
          {state === "sending" ? "Sending…" : "Request a quote"}
        </button>

        <WhatsAppAlternative sport={sport} quantity={quantity} />
      </div>
    </form>
  );
}

function WhatsAppAlternative({ sport, quantity }: { sport: string; quantity: string }) {
  const sportName = SPORTS.find((s) => s.id === sport)?.name ?? "team";
  const href = whatsappLink(
    `Hi I-WEAR, I need a teamwear quote — ${sportName}, about ${quantity} units.`,
  );

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead("teamwear-whatsapp")}
      className="inline-flex min-h-[48px] items-center justify-center border border-line-strong px-7 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink"
    >
      Ask on WhatsApp instead
    </a>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-spec text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block min-h-[48px] w-full border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink focus:border-ink"
      />
    </div>
  );
}

function Select<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="text-spec text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-2 block min-h-[48px] w-full border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink focus:border-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
