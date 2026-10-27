"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/cn";
import { Sparkles, SlidersHorizontal, ArrowDownUp, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/brand";

type SortKey = "featured" | "price-asc" | "price-desc";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export function ProductGrid({ products }: { products: Product[] }) {
  const [line, setLine] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [quickSearch, setQuickSearch] = useState<string>("");

  const lines = useMemo(() => {
    const present = new Set(products.map((p) => p.line));
    return ["all", ...Array.from(present)];
  }, [products]);

  const visible = useMemo(() => {
    let filtered = line === "all" ? products : products.filter((p) => p.line === line);

    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.line.toLowerCase().includes(q)
      );
    }

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
  }, [products, line, sort, quickSearch]);

  return (
    <>
      {/* Winter Season Announcement Banner */}
      <div className="bg-[#101214] border-b border-white/10 py-2.5 px-4 text-center">
        <div className="gutter flex flex-wrap items-center justify-center gap-3 text-xs font-mono tracking-wider uppercase text-white/80">
          <span className="inline-flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-white/50" />
            WINTER &apos;26 ATELIER DROP:
          </span>
          <span>Heavyweight 380 GSM Brushed Fleece &bull; Thermal Base-Layers &bull; Windproof Track Pants</span>
          <span className="hidden md:inline text-white/30">&bull;</span>
          <span className="hidden md:inline text-white/60">
            Complimentary Courier Dispatch on Prepaid Orders
          </span>
        </div>
      </div>

      {/* Interactive Filter & Sort Toolbar */}
      <div className="sticky top-[68px] md:top-[76px] z-30 bg-canvas/95 backdrop-blur-md border-b border-line py-3.5 shadow-xs">
        <div className="gutter flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-spec text-muted mr-2 shrink-0 hidden sm:inline">Category:</span>
            {lines.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setLine(id)}
                aria-pressed={line === id}
                className={cn(
                  "px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.06em] whitespace-nowrap transition-all duration-150 border",
                  line === id
                    ? "bg-ink text-inverse border-ink shadow-xs"
                    : "bg-surface text-ink hover:border-ink-soft border-line"
                )}
              >
                {id === "all" ? "All Pieces" : id}
              </button>
            ))}
          </div>

          {/* Search + Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search fleece, jogger, tee..."
              className="text-xs px-3 py-1.5 bg-surface border border-line focus:outline-none focus:border-ink w-36 sm:w-48"
            />

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowDownUp className="w-3.5 h-3.5 text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort catalog"
                className="bg-surface border border-line px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-ink font-medium"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid View */}
      <section aria-label="Products" className="gutter py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6 pb-2 border-b border-line">
          <p className="text-spec text-muted">
            Showing <strong className="text-ink">{visible.length}</strong> {visible.length === 1 ? "piece" : "pieces"}
            {line !== "all" && <span className="ml-1 text-accent-text font-bold">in {line}</span>}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-text" />
              <span>Doorstep Inspection</span>
            </span>
            <span>&bull;</span>
            <span className="text-accent-text font-medium">Easy Cash Back (7 Days)</span>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-display font-extrabold text-xl text-ink">No matching pieces found</h3>
            <p className="text-muted text-sm mt-1">Try resetting your filters or search keywords.</p>
            <button
              type="button"
              onClick={() => {
                setLine("all");
                setQuickSearch("");
              }}
              className="mt-4 px-4 py-2 border border-ink text-xs uppercase font-bold tracking-wider hover:bg-ink hover:text-inverse transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bulk / Teamwear Subtle Callout for Corporate & Club Buyers */}
      <section className="bg-surface border-t border-line py-12">
        <div className="gutter">
          <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-canvas border border-line flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-spec text-accent-text font-bold uppercase">Wholesale & Club Orders</span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-ink">
                Equipping a Sports Club, Academy, or Corporate Roster?
              </h3>
              <p className="text-xs text-muted max-w-xl">
                We manufacture bespoke squad kits in Sialkot with minimums from just 15 units. Sublimated badges, custom numbering, and direct wholesale pricing.
              </p>
            </div>
            <Link
              href="/teamwear/build"
              className="shrink-0 bg-ink hover:bg-accent text-inverse text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors"
            >
              Launch Kit Builder &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
