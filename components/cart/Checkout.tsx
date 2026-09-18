"use client";

import { useState, type FormEvent } from "react";
import { clearCart, useCart } from "./useCart";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getProduct } from "@/data/products";
import { BRAND, formatPrice, whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/cn";

interface Details {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

const EMPTY: Details = { name: "", email: "", phone: "", address: "", city: "" };

/**
 * DEMO CHECKOUT.
 *
 * Validates the way a real checkout would, then stops at the payment boundary
 * and says so. No card is taken, no order is created and nothing is sent. The
 * WhatsApp handoff is the one route out that would genuinely work in
 * production, so it is offered instead of a fake confirmation.
 */
export function Checkout() {
  const { lines, subtotal, count, ready } = useCart();
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [placed, setPlaced] = useState<string | null>(null);

  function validate(): boolean {
    const next: Partial<Record<keyof Details, string>> = {};

    if (!details.name.trim()) next.name = "We need a name for the delivery.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(details.email.trim()))
      next.email = "Enter an email we can send confirmation to.";
    if (details.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a phone number with at least 10 digits.";
    if (!details.address.trim()) next.address = "We need a street address.";
    if (!details.city.trim()) next.city = "Which city?";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    // ---- PAYMENT BOUNDARY ------------------------------------------------
    // A real build takes payment and creates an order here. This one does
    // neither. The reference below is generated locally so the summary screen
    // has something to show; it corresponds to no record anywhere.
    // ----------------------------------------------------------------------
    setPlaced(`IW-${Date.now().toString(36).toUpperCase()}`);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (placed) {
    const handoff = whatsappLink(
      `Hello ${BRAND.name} — I went through checkout on the site (reference ${placed}) and would like to complete this order.`,
    );

    return (
      <div className="max-w-[62ch]">
        <p className="text-spec text-success">Summary confirmed</p>
        <h2
          className="mt-5 font-display"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--text-title--line-height)",
            letterSpacing: "var(--text-title--letter-spacing)",
          }}
        >
          Nothing was charged.
        </h2>

        <p className="mt-6 text-muted" style={{ fontSize: "var(--text-lede)" }}>
          This is a demonstration build with no payment processor and no order
          system behind it. Your details were validated and then discarded — they
          were never sent anywhere, and no order exists.
        </p>

        <dl className="mt-8 border-y border-line py-4">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-spec text-muted">Local reference</dt>
            <dd className="text-spec text-ink">{placed}</dd>
          </div>
        </dl>

        <p className="mt-8 text-muted">
          If you want to order for real, the WhatsApp route below is the one that
          works — it opens a conversation rather than pretending a transaction
          happened.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {handoff && (
            <a
              href={handoff}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 bg-ink px-8 text-[0.875rem] font-medium tracking-[0.08em] text-inverse uppercase transition-colors duration-[180ms] hover:bg-ink-soft"
            >
              Continue on WhatsApp
            </a>
          )}
          <ButtonLink href="/shop" variant="outline" size="lg">
            Back to shop
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <p className="text-spec text-muted" aria-live="polite">
        Loading your cart
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div>
        <p className="max-w-[46ch] text-muted" style={{ fontSize: "var(--text-lede)" }}>
          There is nothing to check out.
        </p>
        <ButtonLink href="/shop" size="lg" className="mt-8">
          Shop sportswear
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <form onSubmit={onSubmit} noValidate>
        <h2 className="text-spec text-muted">Delivery details</h2>

        <div className="mt-6 flex flex-col gap-6">
          <Field
            id="name"
            label="Full name"
            value={details.name}
            error={errors.name}
            autoComplete="name"
            onChange={(v) => setDetails({ ...details, name: v })}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={details.email}
            error={errors.email}
            autoComplete="email"
            onChange={(v) => setDetails({ ...details, email: v })}
          />
          <Field
            id="phone"
            label="Phone"
            type="tel"
            value={details.phone}
            error={errors.phone}
            autoComplete="tel"
            onChange={(v) => setDetails({ ...details, phone: v })}
          />
          <Field
            id="address"
            label="Street address"
            value={details.address}
            error={errors.address}
            autoComplete="street-address"
            onChange={(v) => setDetails({ ...details, address: v })}
          />
          <Field
            id="city"
            label="City"
            value={details.city}
            error={errors.city}
            autoComplete="address-level2"
            onChange={(v) => setDetails({ ...details, city: v })}
          />
        </div>

        <Button type="submit" size="lg" className="mt-10 w-full sm:w-auto">
          Confirm order summary
        </Button>

        <p className="mt-4 max-w-[52ch] text-[0.8125rem] leading-[1.5] text-muted">
          No payment step follows this. Your details are validated in the browser
          and never leave it.
        </p>
      </form>

      <aside aria-labelledby="order-heading" className="bg-surface p-[clamp(1.5rem,3vw,2.25rem)]">
        <h2 id="order-heading" className="text-spec text-muted">
          Your order
        </h2>

        <ul className="mt-6 flex flex-col gap-4">
          {lines.map((line) => {
            const product = getProduct(line.productSlug);
            if (!product) return null;
            const colorway = product.colorways.find((c) => c.id === line.colorwayId);

            return (
              <li
                key={`${line.productSlug}-${line.colorwayId}-${line.size}`}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="text-[0.9375rem] text-ink">
                  {product.name}
                  <span className="text-spec ml-2 text-muted">
                    {colorway?.name} &middot; {line.size} &times; {line.quantity}
                  </span>
                </span>
                <span className="text-spec shrink-0 text-ink">
                  {formatPrice(product.price * line.quantity)}
                </span>
              </li>
            );
          })}
        </ul>

        <div aria-hidden className="mt-6 h-px w-full bg-line-strong" />

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <p className="text-spec text-muted">
            Subtotal &middot; {count} {count === 1 ? "item" : "items"}
          </p>
          <p className="font-display text-[1.5rem] font-extrabold tracking-[-0.02em]">
            {formatPrice(subtotal)}
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-2 block min-h-[48px] w-full border bg-canvas px-3 text-[0.9375rem] text-ink",
          error ? "border-danger" : "border-line-strong focus:border-ink",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="text-spec mt-2 text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
