"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { field } from "./ui";

/** Inline status change. Writes immediately — there is no separate save step. */
export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: number;
  value: string;
  options: string[];
  action: (id: number, status: string) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        start(async () => {
          await action(id, next);
          router.refresh();
        });
      }}
      className={`${field} h-9 w-[9rem] text-[0.8125rem]`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
