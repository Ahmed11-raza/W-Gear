"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/admin/actions";
import { field, label, btn } from "./ui";

const FIELDS = [
  { name: "whatsapp", label: "WhatsApp number", hint: "Digits only, international format, no plus. e.g. 923001234567" },
  { name: "email", label: "Contact email" },
  { name: "city", label: "City" },
  { name: "manufacturingHub", label: "Manufacturing hub" },
  { name: "hours", label: "Opening hours" },
  { name: "teamwearLeadTime", label: "Teamwear lead time", hint: "e.g. 14–18 working days from approved proof. Leave blank to hide." },
];

export function SettingsForm({ current }: { current: Record<string, string> }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    start(async () => {
      await saveSettings(form);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2600);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {FIELDS.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className={label}>
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            defaultValue={current[f.name] ?? ""}
            className={`${field} mt-2`}
          />
          {f.hint && <p className="mt-1 text-[0.75rem] text-white/35">{f.hint}</p>}
        </div>
      ))}

      <button type="submit" disabled={pending} className={btn}>
        {pending ? "Saving…" : saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}
