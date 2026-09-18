"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product, SizeCode } from "@/types";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { Button } from "@/components/ui/Button";
import { addLine } from "@/components/cart/useCart";
import { BRAND, formatPrice, whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Below this, the size selector says how many are left. */
const LOW_STOCK = 6;

/**
 * The buying panel: artwork, colourway, size, quantity, add.
 *
 * Artwork and controls are one component because the artwork is a control —
 * choosing a colourway changes what you are looking at. Splitting them would
 * mean lifting that state into a wrapper that does nothing else.
 */
export function ProductPurchase({ product }: { product: Product }) {

  const [colorwayIndex, setColorwayIndex] = useState(0);
  const [size, setSize] = useState<SizeCode | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const colorway = product.colorways[colorwayIndex];
  const variant = product.variants.find((v) => v.size === size);
  const maxQuantity = variant?.stock ?? 1;

  const enquiry = whatsappLink(
    `Hello ${BRAND.name} — I have a question about the ${product.name} (${colorway.name}).`,
  );

  function handleAdd() {
    if (!size) return;
    addLine({ productSlug: product.slug, colorwayId: colorway.id, size, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  }

  return (
    <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative bg-surface" style={{ aspectRatio: "4 / 5" }}>
        <div className="absolute inset-0 flex items-center justify-center p-[10%]">
          <GarmentRender
            silhouette={product.silhouette}
            hex={colorway.hex}
            accentHex={colorway.accentHex}
            uid={`detail-${product.slug}-${colorway.id}`}
          />
        </div>
        <p className="text-spec absolute bottom-4 left-4 text-muted">
          Technical drawing &middot; {colorway.name}
        </p>
      </div>

      <div className="flex flex-col">
        <p className="text-spec text-muted">{product.line}</p>

        <h1
          className="mt-4 font-display"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--text-title--line-height)",
            letterSpacing: "var(--text-title--letter-spacing)",
          }}
        >
          {product.name}
        </h1>

        <p className="mt-4 text-[1.25rem] text-ink">{formatPrice(product.price)}</p>
        <p className="mt-3 max-w-[44ch] text-muted">{product.summary}</p>

        <div aria-hidden className="mt-8 h-px w-full bg-line" />

        <fieldset className="mt-8">
          <legend className="text-spec text-muted">
            Colour &mdash; <span className="text-ink">{colorway.name}</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.colorways.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorwayIndex(i)}
                aria-label={c.name}
                aria-pressed={i === colorwayIndex}
                className={cn(
                  "h-11 w-11 rounded-pill border-2 transition-transform duration-[180ms] hover:scale-105",
                  i === colorwayIndex ? "border-ink scale-105" : "border-line-strong",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <div className="flex items-baseline justify-between gap-4">
            <legend className="text-spec text-muted">Size</legend>
            <Link
              href="/shop/sizing"
              className="text-[0.8125rem] text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-ink"
            >
              Size guide
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const soldOut = v.stock < 1;
              return (
                <button
                  key={v.size}
                  type="button"
                  disabled={soldOut}
                  onClick={() => {
                    setSize(v.size);
                    setQuantity(1);
                  }}
                  aria-pressed={size === v.size}
                  className={cn(
                    "min-h-[48px] min-w-[56px] border px-3 text-[0.8125rem] uppercase tracking-[0.08em] transition-colors duration-[180ms]",
                    soldOut &&
                      "cursor-not-allowed border-line text-muted line-through opacity-50",
                    !soldOut && size === v.size && "border-ink bg-ink text-inverse",
                    !soldOut && size !== v.size && "border-line-strong text-ink hover:border-ink",
                  )}
                >
                  {v.size}
                </button>
              );
            })}
          </div>

          {variant && variant.stock <= LOW_STOCK && (
            <p className="text-spec mt-3 text-accent-text">
              {variant.stock} left in {variant.size}
            </p>
          )}
        </fieldset>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3">
            <span className="text-spec text-muted">Qty</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!size}
              className="min-h-[48px] border border-line-strong bg-canvas px-3 text-[0.9375rem] text-ink disabled:opacity-40"
            >
              {Array.from({ length: Math.min(maxQuantity, 8) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <Button size="lg" onClick={handleAdd} disabled={!size} className="flex-1">
            {size ? "Add to cart" : "Select a size"}
          </Button>
        </div>

        {/* Announced rather than shown as a toast — it stays in the flow. */}
        <p aria-live="polite" className="text-spec mt-4 min-h-[1.2em] text-success">
          {added ? `Added to cart — ${product.name}, ${colorway.name}, ${size}` : ""}
        </p>

        {enquiry && (
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-[0.9375rem] text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-ink"
          >
            Ask about this piece on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
