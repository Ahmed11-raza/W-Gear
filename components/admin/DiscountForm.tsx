"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDiscount } from "@/app/admin/actions";
import { field, label, btn } from "./ui";

export function DiscountForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("percentage");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setError(null);

    start(async () => {
      try {
        await saveDiscount(null, form);
        formEl.reset();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="code" className={label}>Code</label>
        <input id="code" name="code" required placeholder="LAUNCH10" className={`${field} mt-2 font-mono uppercase`} />
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <input id="description" name="description" placeholder="Launch offer" className={`${field} mt-2`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="type" className={label}>Type</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${field} mt-2`}
          >
            <option value="percentage">Percent</option>
            <option value="fixed">Rupees</option>
          </select>
        </div>
        <div>
          <label htmlFor="value" className={label}>
            {type === "percentage" ? "Percent off" : "Rupees off"}
          </label>
          <input id="value" name="value" type="number" step="any" min="1" required className={`${field} mt-2`} />
        </div>
      </div>

      <div>
        <label htmlFor="minSubtotal" className={label}>Minimum subtotal (PKR)</label>
        <input id="minSubtotal" name="minSubtotal" type="number" min="0" defaultValue={0} className={`${field} mt-2`} />
      </div>

      <div>
        <label htmlFor="maxRedemptions" className={label}>Redemption limit</label>
        <input id="maxRedemptions" name="maxRedemptions" type="number" min="1" placeholder="unlimited" className={`${field} mt-2`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="startsAt" className={label}>Starts</label>
          <input id="startsAt" name="startsAt" type="date" className={`${field} mt-2`} />
        </div>
        <div>
          <label htmlFor="endsAt" className={label}>Ends</label>
          <input id="endsAt" name="endsAt" type="date" className={`${field} mt-2`} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-[0.875rem]">
        <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
        Active
      </label>

      {error && <p role="alert" className="text-[0.8125rem] text-red-400">{error}</p>}

      <button type="submit" disabled={pending} className={`${btn} w-full`}>
        {pending ? "Creating…" : "Create code"}
      </button>
    </form>
  );
}
