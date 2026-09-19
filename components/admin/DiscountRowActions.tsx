"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleDiscount, deleteDiscount } from "@/app/admin/actions";
import { btnGhost } from "./ui";

export function DiscountRowActions({ id, active, code }: { id: number; active: boolean; code: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => { await toggleDiscount(id, !active); router.refresh(); })}
        className={btnGhost}
      >
        {active ? "Turn off" : "Turn on"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete code ${code}? Orders that already used it keep their record.`)) return;
          start(async () => { await deleteDiscount(id); router.refresh(); });
        }}
        className={`${btnGhost} hover:border-red-500/50 hover:text-red-300`}
      >
        Delete
      </button>
    </div>
  );
}
