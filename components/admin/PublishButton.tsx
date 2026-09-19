"use client";

import { useState, useTransition } from "react";
import { publishChanges } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

/**
 * Pushes edits live.
 *
 * Saving writes to the database; the storefront reads through a tagged cache.
 * This clears those tags, so the next visitor sees the new content without a
 * rebuild or a redeploy.
 */
export function PublishButton() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await publishChanges();
          setDone(true);
          setTimeout(() => setDone(false), 2600);
        })
      }
      className={cn(
        "inline-flex h-9 items-center rounded px-4 text-[0.75rem] font-semibold transition-colors",
        done ? "bg-emerald-500 text-black" : "bg-white text-black hover:bg-white/85",
        pending && "opacity-60",
      )}
    >
      {pending ? "Publishing…" : done ? "Published" : "Publish changes"}
    </button>
  );
}
