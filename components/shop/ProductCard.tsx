"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { formatPrice } from "@/lib/brand";
import { inStock } from "@/data/products";
import { getProductPhoto } from "@/lib/images";
import { cn } from "@/lib/cn";

export function ProductCard({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const colorway = product.colorways[active];
  const available = inStock(product);

  const photo = getProductPhoto(product.slug);

  return (
    <article className="group relative flex flex-col bg-surface border border-line p-3 transition-shadow duration-200 hover:shadow-md">
      <div
        className="relative overflow-hidden bg-canvas"
        style={{ aspectRatio: "3 / 4" }}
      >
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          {photo ? (
            <Image
              src={photo}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="p-[8%] w-full h-full flex items-center justify-center">
              <GarmentRender
                silhouette={product.silhouette}
                hex={colorway.hex}
                accentHex={colorway.accentHex}
                uid={`card-${product.slug}-${colorway.id}`}
              />
            </div>
          )}
        </div>

        {!available && (
          <p className="text-spec absolute top-3 left-3 bg-ink px-2 py-0.5 text-inverse text-[0.6875rem] font-bold uppercase z-10">
            Sold out
          </p>
        )}

        {/* Campaign or Winter Tag */}
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <span className="text-spec absolute bottom-3 left-3 bg-ink text-white border border-white/20 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider shadow-xs z-10">
            {product.campaignName || "SALE"} &bull; {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
          </span>
        ) : product.silhouette === "hoodie" || product.silhouette === "jacket" || product.silhouette === "joggers" || product.silhouette === "longsleeve" ? (
          <span className="text-spec absolute bottom-3 left-3 bg-ink/90 text-white border border-white/20 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider z-10 backdrop-blur-xs">
            WINTER CORE &bull; 380 GSM
          </span>
        ) : null}

        <span className="text-spec absolute top-3 right-3 bg-canvas/90 backdrop-blur-xs px-2 py-0.5 text-ink text-[0.625rem] font-bold uppercase tracking-wider border border-line z-10">
          {product.line}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[1rem] sm:text-[1.0625rem] leading-tight font-extrabold tracking-[-0.015em]">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors duration-[180ms] group-hover:text-accent-text after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <div className="text-right shrink-0">
          <p className="text-spec text-ink font-bold text-[0.9375rem]">{formatPrice(product.price)}</p>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <s className="text-spec text-muted text-[0.75rem] block">{formatPrice(product.compareAtPrice)}</s>
          )}
        </div>
      </div>

      <p className="mt-1.5 text-small text-muted line-clamp-2 leading-snug">{product.summary}</p>

      {/* Available Sizes Quick View */}
      <div className="relative z-10 mt-2.5 flex items-center gap-1 flex-wrap">
        <span className="text-[0.625rem] font-mono text-muted uppercase tracking-wider mr-1">Sizes:</span>
        {product.variants.map((v) => (
          <span
            key={v.size}
            className={cn(
              "px-1.5 py-0.5 text-[0.625rem] font-mono font-bold rounded",
              v.stock > 0
                ? "bg-canvas text-ink border border-line"
                : "text-muted/40 line-through"
            )}
          >
            {v.size}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-3 pt-2 border-t border-line/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
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
                "h-5 w-5 rounded-full border transition-transform duration-[180ms]",
                i === active ? "border-ink scale-110 shadow-xs" : "border-line-strong hover:scale-110",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <span className="text-spec text-muted text-[0.6875rem] font-medium">{colorway.name}</span>
      </div>
    </article>
  );
}
