"use client";

import { useCart, clearCart } from "@/components/cart/useCart";
import { formatPrice } from "@/lib/brand";
import Link from "next/link";
import { X, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { lookupProduct as getProduct } from "@/lib/catalogue";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { lines, subtotal, count } = useCart();
  const freeThreshold = 6000;
  const remaining = Math.max(0, freeThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeThreshold) * 100);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-canvas border-l border-line shadow-2xl flex flex-col">
          {/* Top header */}
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-[1rem] uppercase tracking-[-0.01em]">
                Shopping Bag
              </h2>
              <span className="text-spec text-muted">({count})</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted hover:text-ink"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress bar */}
          <div className="bg-surface px-6 py-3 border-b border-line">
            <div className="flex items-center justify-between text-[0.75rem] font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-ink">
                <Truck className="w-3.5 h-3.5 text-accent-text" />
                {remaining > 0 ? (
                  <span>Add <strong>{formatPrice(remaining)}</strong> for Free Express Delivery</span>
                ) : (
                  <span className="text-accent-text">Free Priority Delivery Unlocked</span>
                )}
              </span>
              <span className="text-spec text-muted">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-line h-1.5 overflow-hidden">
              <div
                className="bg-accent-text h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Item list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-line">
            {lines.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[0.875rem] font-bold text-ink">Your bag is empty</p>
                <p className="text-[0.75rem] text-muted mt-1 max-w-[30ch] mx-auto">
                  Pieces engineered for movement and unhurried life in Islamabad.
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-5 inline-block border border-ink px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.08em] hover:bg-ink hover:text-inverse transition-colors"
                >
                  Explore Shop
                </Link>
              </div>
            ) : (
              lines.map((line) => {
                const product = getProduct(line.productSlug);
                if (!product) return null;
                const colorway = product.colorways.find((c) => c.id === line.colorwayId) || product.colorways[0];
                return (
                  <div key={`${line.productSlug}-${line.colorwayId}-${line.size}`} className="pt-4 first:pt-0 flex justify-between gap-4">
                    <div>
                      <h4 className="font-display font-extrabold text-[0.875rem] leading-snug">
                        {product.name}
                      </h4>
                      <div className="text-[0.6875rem] text-muted space-x-2 mt-0.5">
                        <span>Size: <strong>{line.size}</strong></span>
                        <span>&bull;</span>
                        <span>Color: <strong>{colorway.name}</strong></span>
                        <span>&bull;</span>
                        <span>Qty: <strong>{line.quantity}</strong></span>
                      </div>
                      <p className="text-[0.75rem] text-ink font-bold mt-1.5">
                        {formatPrice(product.price * line.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom actions */}
          {lines.length > 0 && (
            <div className="p-6 border-t border-line bg-surface space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-spec text-muted">Subtotal</span>
                <span className="font-display font-extrabold text-[1.125rem] text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="p-2.5 bg-accent-muted/30 border border-accent/30 space-y-1 text-[0.6875rem]">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <RotateCcw className="w-3.5 h-3.5 text-accent-text shrink-0" />
                  <span>Easy Cash Back Policy Guaranteed</span>
                </div>
                <p className="text-muted text-[0.625rem] pl-5.5">
                  7-Day 100% Money-Back Guarantee &bull; Doorstep inspection allowed
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-ink hover:bg-accent text-inverse py-3.5 px-4 text-center text-[0.75rem] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block text-center text-[0.75rem] text-muted hover:text-ink py-1 font-semibold"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
