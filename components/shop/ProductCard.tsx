"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { formatPrice } from "@/lib/brand";
import { inStock } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * Grid card.
 *
 * One link only — the product name, stretched over the whole card by an
 * overlay. The colourway swatches sit above that overlay and change the artwork
 * in place without navigating, so the card has a single destination and several
 * controls rather than several competing links.
 */
export function ProductCard({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const colorway = product.colorways[active];
  const available = inStock(product);

  return (
    <article className="group relative flex flex-col">
      <div
        className="relative overflow-hidden bg-surface"
        style={{ aspectRatio: "3 / 4" }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-[8%] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          <GarmentRender
            silhouette={product.silhouette}
            hex={colorway.hex}
            accentHex={colorway.accentHex}
            uid={`card-${product.slug}-${colorway.id}`}
          />
        </div>

        {!available && (
          <p className="text-spec absolute top-4 left-4 bg-ink px-2 py-1 text-inverse">
            Sold out
          </p>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.125rem] leading-tight font-extrabold tracking-[-0.015em]">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors duration-[180ms] group-hover:text-accent-text after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-spec shrink-0 text-ink">{formatPrice(product.price)}</p>
      </div>

      <p className="mt-2 text-small text-muted">{product.summary}</p>

      <div className="relative z-10 mt-4 flex items-center gap-2">
        {product.colorways.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            aria-label={`Show ${product.name} in ${c.name}`}
            aria-pressed={i === active}
            className={cn(
              "h-7 w-7 rounded-pill border transition-transform duration-[180ms]",
              i === active ? "border-ink scale-110" : "border-line-strong hover:scale-110",
            )}
            style={{ backgroundColor: c.hex }}
          />
        ))}
        <span className="text-spec ml-1 text-muted">{colorway.name}</span>
      </div>
    </article>
  );
}
