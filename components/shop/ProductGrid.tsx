"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/cn";

type SortKey = "featured" | "price-asc" | "price-desc";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
];

/**
 * The storefront grid with its filter bar.
 *
 * Filtering is client-side over a catalogue that is already fully loaded —
 * twelve products is far below the point where this needs to become a server
 * round trip. The filter set is derived from the products passed in, so a
 * collection page gets only the filters that would actually return something.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const [line, setLine] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const lines = useMemo(() => {
    const present = new Set(products.map((p) => p.line));
    return ["all", ...Array.from(present)];
  }, [products]);

  const visible = useMemo(() => {
    const filtered = line === "all" ? products : products.filter((p) => p.line === line);

    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      default:
        return [...filtered].sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
        );
    }
  }, [products, line, sort]);

  return (
    <>
      <div className="gutter flex flex-wrap items-center justify-between gap-6 border-y border-line py-4">
        {lines.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-spec mr-2 text-muted">Line</span>
            {lines.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setLine(id)}
                aria-pressed={line === id}
                className={cn(
                  "min-h-[44px] border px-4 text-[0.75rem] uppercase tracking-[0.1em] transition-colors duration-[180ms]",
                  line === id
                    ? "border-ink bg-ink text-inverse"
                    : "border-line-strong text-ink hover:border-ink",
                )}
              >
                {id === "all" ? "Everything" : id}
              </button>
            ))}
          </div>
        )}

        <label className="flex items-center gap-3">
          <span className="text-spec text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-h-[44px] border border-line-strong bg-canvas px-3 text-[0.8125rem] text-ink"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="gutter py-[clamp(2.5rem,6vw,4.5rem)]">
        <p className="text-spec mb-10 text-muted" aria-live="polite">
          {visible.length} {visible.length === 1 ? "piece" : "pieces"}
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-3 lg:gap-x-8">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
