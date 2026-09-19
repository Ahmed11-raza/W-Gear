"use client";

import { useState, type FormEvent } from "react";
import { clearCart, useCart } from "./useCart";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getProduct } from "@/data/products";
import { BRAND, formatPrice, whatsappLink } from "@/lib/brand";
import { trackPurchase } from "@/lib/track";
import { cn } from "@/lib/cn";
import { ShieldCheck, Truck, Banknote, QrCode, CreditCard, CheckCircle2, MessageCircle } from "lucide-react";

interface Details {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  sectorOrArea: string;
  paymentMethod: "cod" | "raast" | "card";
}

const EMPTY: Details = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "Karachi",
  sectorOrArea: "DHA Phase 5 & 6",
  paymentMethod: "cod",
};

export function Checkout() {
  const { lines, subtotal, count, ready } = useCart();
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [placed, setPlaced] = useState<{ id: string; details: Details; total: number } | null>(null);

  const cityAreas: Record<string, string[]> = {
    Karachi: [
      "DHA Phase 1–8", "Clifton (Block 1–9)", "Gulshan-e-Iqbal", "PECHS",
      "North Nazimabad", "Bahria Town Karachi", "KDA Scheme 1", "Malir Cantt", "Other Area"
    ],
    Lahore: [
      "DHA Phase 1–8", "Gulberg (II–III)", "Model Town", "Cantt",
      "Bahria Town Lahore", "Johar Town", "WAPDA Town", "Faisal Town", "Other Area"
    ],
    Islamabad: [
      "Sector F-6", "Sector F-7", "Sector F-8", "Sector F-10", "Sector F-11",
      "Sector E-7", "Sector G-10", "Sector G-11", "Sector I-8", "DHA Phase 1 & 2", "Bahria Enclave", "Other Sector"
    ],
    Rawalpindi: [
      "Bahria Town (Phase 1–8)", "Chaklala Scheme 3", "Westridge",
      "Rawalpindi Cantt", "Askari (1–14)", "Other Area"
    ],
    Sialkot: [
      "Sialkot Cantt", "Model Town", "Paris Road", "Sambrial", "Other Area"
    ],
    Faisalabad: [
      "D Ground / Peoples Colony", "Madina Town", "Kohinoor City", "Canal Road", "Other Area"
    ],
    Peshawar: [
      "Hayatabad (Phase 1–7)", "University Town", "Peshawar Cantt", "Other Area"
    ],
    Multan: [
      "Multan Cantt", "Bosan Road", "Gulgasht Colony", "MDA Officers Colony", "Other Area"
    ],
  };

  const currentAreas = cityAreas[details.city] || ["Central Area", "Other Area"];

  // 5% discount for Raast instant prepaid transfer
  const raastDiscount = details.paymentMethod === "raast" ? Math.round(subtotal * 0.05) : 0;
  const deliveryFee = subtotal >= 6000 ? 0 : 250;
  const grandTotal = Math.max(0, subtotal + deliveryFee - raastDiscount);

  function validate(): boolean {
    const next: Partial<Record<keyof Details, string>> = {};

    if (!details.name.trim()) next.name = "We need a name for the courier.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(details.email.trim()))
      next.email = "Enter a valid email for the dispatch invoice.";
    if (details.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid mobile number (at least 10 digits) for SMS dispatch tracking.";
    if (!details.address.trim()) next.address = "We need a house and street address.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const orderRef = `IW-${Date.now().toString(36).toUpperCase()}`;
    trackPurchase(
      lines.flatMap((line) => {
        const item = getProduct(line.productSlug);
        return item
          ? [{
              slug: item.slug,
              name: item.name,
              price: item.price,
              size: line.size,
              quantity: line.quantity,
            }]
          : [];
      }),
      grandTotal,
      orderRef,
      details.paymentMethod,
    );

    setPlaced({
      id: orderRef,
      details,
      total: grandTotal,
    });
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (placed) {
    const waText = `Hi ${BRAND.name} Concierge, I placed order ${placed.id} for ${placed.details.name} in ${placed.details.sectorOrArea}, ${placed.details.city}. Total: ${formatPrice(placed.total)} (${placed.details.paymentMethod.toUpperCase()}). Please confirm dispatch.`;
    const waUrl = `https://wa.me/${BRAND.contact.whatsapp}?text=${encodeURIComponent(waText)}`;

    return (
      <div className="max-w-[68ch] space-y-8 bg-surface p-6 sm:p-10 border border-line shadow-xs">
        <div className="flex items-center gap-2 text-accent-text text-spec font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Order Registered &bull; Sialkot Workshop Direct Dispatch</span>
        </div>

        <div>
          <h2
            className="font-display font-black tracking-[-0.02em] uppercase text-ink"
            style={{ fontSize: "var(--text-title)", lineHeight: 1.1 }}
          >
            Dispatch Confirmed.
          </h2>
          <p className="mt-3 text-muted text-[0.9375rem] leading-relaxed">
            Thank you, {placed.details.name}. Your garments have been queued for dispatch via TCS Express.
            Estimated arrival across major urban centers is 2–3 business days with Doorstep Inspection.
          </p>
        </div>

        <div className="border-y border-line py-5 space-y-3 text-sm">
          <div className="flex justify-between items-baseline">
            <span className="text-spec text-muted">Order Reference</span>
            <span className="font-mono font-bold text-ink">{placed.id}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-spec text-muted">Delivery Destination</span>
            <span className="text-ink text-right font-medium">
              {placed.details.address}, {placed.details.sectorOrArea}, {placed.details.city}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-spec text-muted">Payment Rail</span>
            <span className="font-bold text-ink">
              {placed.details.paymentMethod === "cod"
                ? "Cash on Delivery (Doorstep Inspection Allowed)"
                : placed.details.paymentMethod === "raast"
                ? "Raast Instant QR / IBFT (5% Privilege Applied)"
                : "Credit / Debit Card (3D Secure)"}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-line font-black text-base">
            <span>Payable Total</span>
            <span className="text-ink">{formatPrice(placed.total)}</span>
          </div>
        </div>

        {placed.details.paymentMethod === "raast" && (
          <div className="p-4 bg-canvas border border-line text-xs space-y-1">
            <p className="font-bold text-ink">Raast Transfer Details:</p>
            <p className="text-muted">Raast ID: <strong>0300-1234567</strong> &bull; Bank: Meezan Bank Ltd</p>
            <p className="text-muted">Account Title: <strong>I-Wear Performance Apparel</strong></p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-ink hover:bg-accent text-inverse py-3.5 px-6 text-[0.75rem] font-bold uppercase tracking-[0.08em] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-accent-text" />
            <span>Track on WhatsApp Concierge</span>
          </a>
          <ButtonLink href="/shop" variant="outline" size="lg">
            Return to Store
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (lines.length === 0 && ready) {
    return (
      <div className="max-w-[48ch] py-12">
        <h2 className="font-display text-[1.5rem] font-extrabold text-ink">Your bag is empty.</h2>
        <p className="mt-3 text-muted">Add pieces from the collection before proceeding to checkout.</p>
        <div className="mt-6">
          <ButtonLink href="/shop" size="md">
            Go to store
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {/* Recipient info */}
        <div className="space-y-4">
          <h2 className="text-spec text-muted pb-2 border-b border-line uppercase tracking-wider font-bold">
            1. Contact & Recipient
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              id="name"
              label="Full Name"
              value={details.name}
              onChange={(name) => setDetails((d) => ({ ...d, name }))}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              id="phone"
              label="Mobile Number (for SMS & Rider WhatsApp)"
              value={details.phone}
              onChange={(phone) => setDetails((d) => ({ ...d, phone }))}
              error={errors.phone}
              type="tel"
              autoComplete="tel"
            />
          </div>
          <Field
            id="email"
            label="Email Address (for Dispatch Invoice)"
            value={details.email}
            onChange={(email) => setDetails((d) => ({ ...d, email }))}
            error={errors.email}
            type="email"
            autoComplete="email"
          />
        </div>

        {/* Shipping Destination across Pakistan */}
        <div className="space-y-4 pt-2">
          <h2 className="text-spec text-muted pb-2 border-b border-line uppercase tracking-wider font-bold">
            2. Nationwide Delivery Destination
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="text-spec text-muted">Major City</label>
              <select
                id="city"
                value={details.city}
                onChange={(e) => {
                  const city = e.target.value;
                  const firstArea = cityAreas[city]?.[0] || "Main Area";
                  setDetails((d) => ({
                    ...d,
                    city,
                    sectorOrArea: firstArea,
                  }));
                }}
                className="mt-2 block min-h-[48px] w-full border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink font-medium"
              >
                {Object.keys(cityAreas).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other City (All Pakistan)</option>
              </select>
            </div>

            <div>
              <label htmlFor="sector" className="text-spec text-muted">Neighborhood / Phase / Area</label>
              {cityAreas[details.city] ? (
                <select
                  id="sector"
                  value={details.sectorOrArea}
                  onChange={(e) => setDetails((d) => ({ ...d, sectorOrArea: e.target.value }))}
                  className="mt-2 block min-h-[48px] w-full border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink font-medium"
                >
                  {currentAreas.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="sector"
                  type="text"
                  value={details.sectorOrArea}
                  onChange={(e) => setDetails((d) => ({ ...d, sectorOrArea: e.target.value }))}
                  placeholder="e.g. Cantt, Main Town, Model Colony"
                  className="mt-2 block min-h-[48px] w-full border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink"
                />
              )}
            </div>
          </div>

          <Field
            id="address"
            label="Street Address & House / Apartment #"
            value={details.address}
            onChange={(address) => setDetails((d) => ({ ...d, address }))}
            error={errors.address}
            autoComplete="street-address"
          />
        </div>

        {/* Payment options */}
        <div className="space-y-4 pt-2">
          <h2 className="text-spec text-muted pb-2 border-b border-line uppercase tracking-wider font-bold">
            3. Payment Method
          </h2>

          <div className="space-y-3">
            <label
              className={cn(
                "block p-4 border cursor-pointer transition-colors",
                details.paymentMethod === "cod" ? "border-ink bg-surface shadow-xs" : "border-line bg-canvas hover:border-line-strong"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={details.paymentMethod === "cod"}
                  onChange={() => setDetails((d) => ({ ...d, paymentMethod: "cod" }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-ink" />
                    <span className="font-bold text-sm text-ink">Cash on Delivery (Doorstep Inspection)</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Inspect the parcel and garment fabric quality at your doorstep before handing cash to the TCS courier rider.
                  </p>
                </div>
              </div>
            </label>

            <label
              className={cn(
                "block p-4 border cursor-pointer transition-colors",
                details.paymentMethod === "raast" ? "border-ink bg-surface shadow-xs" : "border-line bg-canvas hover:border-line-strong"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="raast"
                  checked={details.paymentMethod === "raast"}
                  onChange={() => setDetails((d) => ({ ...d, paymentMethod: "raast" }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-accent-text" />
                    <span className="font-bold text-sm text-ink">Instant Raast QR / IBFT (5% Privilege)</span>
                    <span className="text-[0.625rem] bg-accent-text text-inverse font-bold px-1.5 py-0.5">SAVE 5%</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Zero-fee instant transfer via Meezan Bank, HBL, Nayapay, or SadaPay.
                  </p>
                </div>
              </div>
            </label>

            <label
              className={cn(
                "block p-4 border cursor-pointer transition-colors",
                details.paymentMethod === "card" ? "border-ink bg-surface shadow-xs" : "border-line bg-canvas hover:border-line-strong"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={details.paymentMethod === "card"}
                  onChange={() => setDetails((d) => ({ ...d, paymentMethod: "card" }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-ink" />
                    <span className="font-bold text-sm text-ink">Visa & Mastercard (3D Secure)</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Encrypted bank card transfer with OTP verification.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Confirm Order &bull; {formatPrice(grandTotal)}
        </Button>
      </form>

      {/* Aside Order Summary */}
      <aside aria-labelledby="order-heading" className="bg-surface p-[clamp(1.5rem,3vw,2.25rem)] border border-line h-fit sticky top-28 shadow-xs">
        <h2 id="order-heading" className="text-spec text-muted uppercase tracking-wider font-bold">
          Your order ({count} {count === 1 ? "item" : "items"})
        </h2>

        <ul className="mt-6 flex flex-col gap-4">
          {lines.map((line) => {
            const product = getProduct(line.productSlug);
            if (!product) return null;
            const colorway = product.colorways.find((c) => c.id === line.colorwayId);

            return (
              <li
                key={`${line.productSlug}-${line.colorwayId}-${line.size}`}
                className="flex items-baseline justify-between gap-4 text-xs"
              >
                <span className="text-[0.875rem] text-ink font-medium">
                  {product.name}
                  <span className="text-spec ml-2 text-muted block text-[0.75rem]">
                    {colorway?.name} &middot; {line.size} &times; {line.quantity}
                  </span>
                </span>
                <span className="text-spec shrink-0 text-ink font-bold">
                  {formatPrice(product.price * line.quantity)}
                </span>
              </li>
            );
          })}
        </ul>

        <div aria-hidden className="mt-6 h-px w-full bg-line-strong" />

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="text-ink font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Nationwide TCS Express</span>
            <span className="text-accent-text font-bold">
              {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
            </span>
          </div>
          {raastDiscount > 0 && (
            <div className="flex justify-between text-accent-text font-semibold">
              <span>Raast 5% Privilege</span>
              <span>-{formatPrice(raastDiscount)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-line flex items-baseline justify-between gap-4">
          <p className="text-spec text-muted">Total Payable</p>
          <p className="font-display text-[1.375rem] font-extrabold text-ink">
            {formatPrice(grandTotal)}
          </p>
        </div>

        <div className="mt-6 p-3.5 bg-canvas border border-line flex items-center gap-2 text-[0.6875rem] text-muted leading-snug">
          <ShieldCheck className="w-4 h-4 text-accent-text shrink-0" />
          <span>Doorstep Inspection Allowed: Check garment finish upon courier arrival</span>
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
