"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePromotion, clearPromotion } from "@/app/admin/actions";
import { field, btn, btnGhost } from "./ui";
import { Pencil, X } from "lucide-react";

export function PromotionActions({
  productId,
  currentPrice,
  compareAtPrice,
  campaignName,
  salePercent,
}: {
  productId: number;
  currentPrice: number;
  compareAtPrice: number | null;
  campaignName: string | null;
  salePercent: number | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [newCompareAt, setNewCompareAt] = useState(
    String(compareAtPrice || ""),
  );
  const [newCampaign, setNewCampaign] = useState(campaignName || "");

  const isOnSale = compareAtPrice && compareAtPrice > currentPrice;

  if (!editing) {
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[0.6875rem] text-white/60 transition-colors hover:border-white/35 hover:text-white"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        {isOnSale && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              start(async () => {
                await clearPromotion(productId);
                router.refresh();
              });
            }}
            className="inline-flex items-center gap-1 rounded border border-red-500/30 px-2 py-1 text-[0.6875rem] text-red-400 transition-colors hover:bg-red-500/10"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-left">
      <div>
        <label className="text-[0.6875rem] uppercase tracking-[0.1em] text-white/40">
          Compare-At Price (PKR)
        </label>
        <input
          type="number"
          min={0}
          value={newCompareAt}
          onChange={(e) => setNewCompareAt(e.target.value)}
          placeholder={String(currentPrice)}
          className={`${field} mt-1 h-8 w-full text-[0.75rem]`}
        />
      </div>
      <div>
        <label className="text-[0.6875rem] uppercase tracking-[0.1em] text-white/40">
          Campaign Name
        </label>
        <input
          type="text"
          value={newCampaign}
          onChange={(e) => setNewCampaign(e.target.value)}
          placeholder="Flash Sale"
          className={`${field} mt-1 h-8 w-full text-[0.75rem]`}
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            start(async () => {
              const compare = Number(newCompareAt) || null;
              const campaign = newCampaign.trim() || null;
              await updatePromotion(productId, compare, campaign);
              setEditing(false);
              router.refresh();
            });
          }}
          className="inline-flex h-7 items-center rounded bg-[#C4F319] px-3 text-[0.6875rem] font-bold text-black transition-colors hover:bg-[#C4F319]/90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="inline-flex h-7 items-center rounded border border-white/15 px-3 text-[0.6875rem] text-white/60 transition-colors hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
