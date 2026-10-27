"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product, SizeCode } from "@/types";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { Button } from "@/components/ui/Button";
import { addLine } from "@/components/cart/useCart";
import { trackAddToCart } from "@/lib/track";
import { getProductPhoto } from "@/lib/images";
import { BRAND, formatPrice, whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { ShieldCheck, Truck, Ruler, CheckCircle2, RotateCcw } from "lucide-react";

const LOW_STOCK = 6;

export function ProductPurchase({ product }: { product: Product }) {
  const [colorwayIndex, setColorwayIndex] = useState(0);
  const [size, setSize] = useState<SizeCode | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [unit, setUnit] = useState<"inches" | "cm">("inches");
  const [sizeModal, setSizeModal] = useState(false);

  const colorway = product.colorways[colorwayIndex];
  const variant = product.variants.find((v) => v.size === size);
  const maxQuantity = variant?.stock ?? 1;

  const photo = getProductPhoto(product.slug);

  const enquiry = whatsappLink(
    `Hello ${BRAND.name} — I have a question about the ${product.name} (${colorway.name}).`,
  );

  function handleAdd() {
    if (!size) return;
    addLine({ productSlug: product.slug, colorwayId: colorway.id, size, quantity });
    trackAddToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      colorway: colorway.name,
      size,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  }

  return (
    <>
      <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative bg-surface overflow-hidden border border-line" style={{ aspectRatio: "4 / 5" }}>
          {photo ? (
            <Image
              src={photo}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-[10%]">
              <GarmentRender
                silhouette={product.silhouette}
                hex={colorway.hex}
                accentHex={colorway.accentHex}
                uid={`detail-${product.slug}-${colorway.id}`}
              />
            </div>
          )}
          <p className="text-spec absolute bottom-4 left-4 bg-canvas/80 px-2.5 py-1 backdrop-blur-xs text-muted font-bold text-xs">
            {photo ? "Studio Master Shot" : "Technical drawing"} &middot; {colorway.name}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-spec text-accent-text uppercase tracking-widest font-bold">{product.line} Series</p>

          <h1
            className="mt-3 font-display font-black tracking-[-0.02em] uppercase text-ink"
            style={{
              fontSize: "var(--text-title)",
              lineHeight: "var(--text-title--line-height)",
            }}
          >
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <span className="text-[1.75rem] font-black text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <s className="text-muted text-[1.125rem]">{formatPrice(product.compareAtPrice)}</s>
                <span className="bg-[#C4F319] text-black text-xs font-black px-2 py-0.5 tracking-wider uppercase">
                  Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  {product.campaignName ? ` · ${product.campaignName}` : ""}
                </span>
              </>
            )}
          </div>
          <p className="mt-3 max-w-[46ch] text-muted leading-relaxed text-sm">{product.summary}</p>

          {/* Model Fit Bar */}
          <div className="mt-6 p-4 bg-surface border border-line text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-ink">
              <span>Verified Fit Profile</span>
              <span className="text-accent-text uppercase text-[0.6875rem]">{product.fit} Cut</span>
            </div>
            <p className="text-muted text-[0.75rem]">
              Model is 6&apos;1&quot; (185 cm), 81 kg wearing size Large. Standard athletic drape.
            </p>
          </div>

          <div aria-hidden className="mt-6 h-px w-full bg-line" />

          {/* Colorway selector */}
          <fieldset className="mt-6">
            <legend className="text-spec text-muted">
              Colourway &middot; <span className="text-ink font-bold">{colorway.name}</span>
            </legend>
            <div className="mt-3 flex items-center gap-2.5">
              {product.colorways.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorwayIndex(i)}
                  aria-label={`Select ${c.name}`}
                  aria-pressed={i === colorwayIndex}
                  className={cn(
                    "h-8 w-8 rounded-full border transition-transform duration-[180ms]",
                    i === colorwayIndex ? "border-ink scale-110 shadow-xs" : "border-line-strong hover:scale-110",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </fieldset>

          {/* Size selector */}
          <fieldset className="mt-6">
            <div className="flex items-baseline justify-between">
              <legend className="text-spec text-muted">
                Size {size ? <span className="text-ink font-bold">&middot; {size}</span> : null}
              </legend>
              <button
                type="button"
                onClick={() => setSizeModal(true)}
                className="text-spec text-muted hover:text-ink underline flex items-center gap-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Measurement Guide</span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {product.variants.map((v) => {
                const isSelected = v.size === size;
                const isOutOfStock = v.stock === 0;

                return (
                  <button
                    key={v.size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSize(v.size);
                      setQuantity(1);
                    }}
                    className={cn(
                      "flex min-h-[48px] flex-col items-center justify-center border p-2 text-[0.875rem] font-bold uppercase transition-colors",
                      isSelected
                        ? "border-ink bg-ink text-inverse"
                        : isOutOfStock
                        ? "border-line text-muted line-through opacity-40 cursor-not-allowed"
                        : "border-line-strong hover:border-ink bg-canvas text-ink",
                    )}
                  >
                    <span>{v.size}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Add to Bag Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              size="lg"
              onClick={handleAdd}
              disabled={!size}
              className="flex-1 min-h-[52px]"
            >
              {added ? "Added to bag" : size ? `Add to bag \u2014 ${formatPrice(product.price * quantity)}` : "Select a size"}
            </Button>

            {enquiry && (
              <a
                href={enquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center border border-line-strong px-5 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink hover:border-ink hover:bg-surface transition-colors"
              >
                Inquire on WhatsApp
              </a>
            )}
          </div>

          {/* Easy Cash Back Policy Ribbon */}
          <div className="mt-5 p-3.5 bg-accent-muted/40 border border-accent/40 flex items-start gap-3 text-xs">
            <RotateCcw className="w-4 h-4 text-accent-text shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-ink uppercase tracking-wider text-[0.75rem]">
                Easy Cash Back Policy &bull; 100% Guaranteed
              </p>
              <p className="text-muted text-[0.6875rem] mt-0.5 leading-relaxed">
                Test the fit and performance with zero risk. If you are not completely satisfied, return within 7 days for an instant, hassle-free cash refund directly via Raast or bank transfer.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-3 text-[0.75rem] text-muted">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-accent-text" />
              <span>Nationwide 2-3 Day Dispatch via TCS</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-text" />
              <span>Doorstep Inspection Allowed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sizing Modal */}
      {sizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-canvas border border-line max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display font-extrabold text-[1.125rem]">Size & Fit Calibration</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUnit("inches")}
                  className={cn("px-2.5 py-1 text-spec font-bold", unit === "inches" ? "bg-ink text-inverse" : "text-muted border border-line")}
                >
                  IN
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={cn("px-2.5 py-1 text-spec font-bold", unit === "cm" ? "bg-ink text-inverse" : "text-muted border border-line")}
                >
                  CM
                </button>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-line text-spec text-muted">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Length</th>
                  <th className="py-2">Weight Est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                <tr>
                  <td className="py-2.5 font-bold">S</td>
                  <td>{unit === "inches" ? "38\"" : "96 cm"}</td>
                  <td>{unit === "inches" ? "28.5\"" : "72 cm"}</td>
                  <td className="text-muted">62–70 kg</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">M</td>
                  <td>{unit === "inches" ? "41\"" : "104 cm"}</td>
                  <td>{unit === "inches" ? "29.5\"" : "75 cm"}</td>
                  <td className="text-muted">71–80 kg</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">L</td>
                  <td>{unit === "inches" ? "44\"" : "112 cm"}</td>
                  <td>{unit === "inches" ? "30.5\"" : "77 cm"}</td>
                  <td className="text-muted">81–90 kg</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">XL</td>
                  <td>{unit === "inches" ? "47\"" : "119 cm"}</td>
                  <td>{unit === "inches" ? "31.5\"" : "80 cm"}</td>
                  <td className="text-muted">91–100 kg</td>
                </tr>
              </tbody>
            </table>

            <div className="p-3.5 bg-surface border border-line text-[0.75rem] text-muted leading-relaxed">
              <strong>Need a size swap?</strong> If the fit is not exact upon arrival, contact our WhatsApp desk within 7 days for a hassle-free doorstep exchange.
            </div>

            <Button type="button" size="md" className="w-full" onClick={() => setSizeModal(false)}>
              Close Guide
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
