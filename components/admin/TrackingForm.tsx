"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateTracking } from "@/app/admin/actions";
import { field } from "./ui";

export function TrackingForm({
  orderId,
  trackingNumber,
  courierName,
}: {
  orderId: number;
  trackingNumber: string | null;
  courierName: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [tracking, setTracking] = useState(trackingNumber || "");
  const [courier, setCourier] = useState(courierName || "TCS Express");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[0.6875rem] uppercase tracking-[0.1em] text-white/50">
            Courier Service
          </label>
          <select
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className={`${field} mt-1`}
          >
            <option value="TCS Express">TCS Express</option>
            <option value="Leopards Courier">Leopards Courier</option>
            <option value="Pakistan Post">Pakistan Post</option>
            <option value="M&P Express">M&P Express</option>
            <option value="BlueEX">BlueEX</option>
            <option value="Trax">Trax</option>
            <option value="Call Courier">Call Courier</option>
            <option value="Rider">Rider</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-[0.6875rem] uppercase tracking-[0.1em] text-white/50">
            Tracking Number
          </label>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Enter tracking number"
            className={`${field} mt-1`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending || !tracking.trim()}
          onClick={() => {
            start(async () => {
              await updateTracking(orderId, tracking.trim(), courier);
              router.refresh();
            });
          }}
          className="inline-flex h-9 items-center rounded bg-[#C4F319] px-4 text-[0.8125rem] font-bold text-black transition-colors hover:bg-[#C4F319]/90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Tracking"}
        </button>
        {trackingNumber && (
          <p className="text-[0.75rem] text-emerald-300">
            Current: {courierName} &mdash; {trackingNumber}
          </p>
        )}
      </div>
    </div>
  );
}
