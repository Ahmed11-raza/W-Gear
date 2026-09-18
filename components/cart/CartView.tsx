"use client";

import Link from "next/link";
import { removeLine, setLineQuantity, useCart } from "./useCart";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { ButtonLink } from "@/components/ui/Button";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/brand";

export function CartView() {
  const { lines, subtotal, count, ready } = useCart();

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
          Your cart is empty.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            Shop sportswear
          </ButtonLink>
          <ButtonLink href="/teamwear/build" variant="outline" size="lg">
            Build your team
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <ul className="border-t border-line">
        {lines.map((line, index) => {
          const product = getProduct(line.productSlug);
          if (!product) return null;

          const colorway =
            product.colorways.find((c) => c.id === line.colorwayId) ?? product.colorways[0];
          const stock = product.variants.find((v) => v.size === line.size)?.stock ?? 1;

          return (
            <li
              key={`${line.productSlug}-${line.colorwayId}-${line.size}`}
              className="flex gap-5 border-b border-line py-6"
            >
              <Link
                href={`/shop/${product.slug}`}
                className="relative w-[84px] shrink-0 bg-surface sm:w-[104px]"
                style={{ aspectRatio: "3 / 4" }}
                aria-label={product.name}
              >
                <span className="absolute inset-0 flex items-center justify-center p-[8%]">
                  <GarmentRender
                    silhouette={product.silhouette}
                    hex={colorway.hex}
                    accentHex={colorway.accentHex}
                    uid={`cart-${product.slug}-${colorway.id}-${line.size}`}
                  />
                </span>
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-display text-[1.0625rem] font-extrabold tracking-[-0.015em]">
                    <Link href={`/shop/${product.slug}`} className="hover:text-accent-text">
                      {product.name}
                    </Link>
                  </h2>
                  <p className="text-spec text-ink">{formatPrice(product.price * line.quantity)}</p>
                </div>

                <p className="text-spec mt-2 text-muted">
                  {colorway.name} &middot; {line.size}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                  <label className="flex items-center gap-2">
                    <span className="sr-only">
                      Quantity for {product.name}, {colorway.name}, {line.size}
                    </span>
                    <select
                      value={line.quantity}
                      onChange={(e) => setLineQuantity(index, Number(e.target.value))}
                      className="min-h-[44px] border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink"
                    >
                      {Array.from({ length: Math.min(stock, 8) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="min-h-[44px] text-[0.8125rem] text-muted underline decoration-line-strong underline-offset-[5px] transition-colors duration-[180ms] hover:text-ink hover:decoration-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside aria-labelledby="summary-heading" className="bg-surface p-[clamp(1.5rem,3vw,2.25rem)]">
        <h2 id="summary-heading" className="text-spec text-muted">
          Summary
        </h2>

        <dl className="mt-6 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted">
              {count} {count === 1 ? "item" : "items"}
            </dt>
            <dd className="text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-spec text-muted">Calculated at checkout</dd>
          </div>
        </dl>

        <div aria-hidden className="mt-6 h-px w-full bg-line-strong" />

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <p className="text-spec text-muted">Subtotal</p>
          <p className="font-display text-[1.5rem] font-extrabold tracking-[-0.02em]">
            {formatPrice(subtotal)}
          </p>
        </div>

        <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
          Checkout
        </ButtonLink>

        <p className="mt-4 text-[0.8125rem] leading-[1.5] text-muted">
          This is a demonstration build. Checkout confirms the order summary and
          nothing is charged.
        </p>
      </aside>
    </div>
  );
}
