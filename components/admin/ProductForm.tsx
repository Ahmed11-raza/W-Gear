"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/app/admin/actions";
import type { ProductRow } from "@/db/schema";
import { field, area, label, btn, btnGhost } from "./ui";

const LINES = ["everyday", "training", "field"];
const FITS = ["regular", "athletic", "relaxed"];
const SILHOUETTES = [
  "tee", "polo", "longsleeve", "tank", "shorts", "joggers", "jacket", "hoodie", "jersey",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

/**
 * Product editor.
 *
 * The repeating value objects — specifications, colourways — are edited as one
 * item per line with pipe-separated fields. A nested field-array UI would be
 * prettier, but this stays fast to type into and impossible to get into a
 * half-saved state, which matters more for a catalogue this size.
 */
export function ProductForm({ product }: { product?: ProductRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);

    start(async () => {
      try {
        await saveProduct(product?.id ?? null, form);
        router.push("/admin/products");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  const specs = (product?.specifications ?? []).map((s) => `${s.label} | ${s.value}`).join("\n");
  const colorways = (product?.colorways ?? [])
    .map((c) => `${c.id} | ${c.name} | ${c.hex} | ${c.accentHex}`)
    .join("\n");

  return (
    <form onSubmit={onSubmit} className="max-w-[54rem] space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" defaultValue={product?.name} required />
        <Field
          name="slug"
          label="Slug (URL)"
          defaultValue={product?.slug}
          hint="lowercase-with-hyphens"
          required
        />
        <Field name="price" label="Price (PKR)" type="number" defaultValue={product?.price} required />
        <Select name="line" label="Line" options={LINES} defaultValue={product?.line} />
        <Select name="silhouette" label="Silhouette" options={SILHOUETTES} defaultValue={product?.silhouette} hint="Drives the drawn artwork when there is no photograph" />
        <Select name="fit" label="Fit" options={FITS} defaultValue={product?.fit} />
      </section>

      <Field name="summary" label="Summary" defaultValue={product?.summary} hint="One line under the name in the grid" />

      <Area
        name="description"
        label="Description"
        rows={5}
        defaultValue={(product?.description ?? []).join("\n")}
        hint="One paragraph per line"
      />

      <Area
        name="features"
        label="Features"
        rows={4}
        defaultValue={(product?.features ?? []).join("\n")}
        hint="One per line"
      />

      <Area
        name="specifications"
        label="Specifications"
        rows={4}
        defaultValue={specs}
        hint="One per line:  Label | Value    e.g.  Weight | 145 GSM"
      />

      <Area
        name="colorways"
        label="Colourways"
        rows={3}
        defaultValue={colorways}
        hint="One per line:  id | Name | #body | #accent"
      />

      <Area
        name="collections"
        label="Collections"
        rows={2}
        defaultValue={(product?.collections ?? []).join("\n")}
        hint="One collection slug per line"
      />

      <section>
        <p className={label}>Stock by size</p>
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SIZES.map((size) => {
            const current = product?.variants.find((v) => v.size === size);
            return (
              <div key={size}>
                <label htmlFor={`stock_${size}`} className="text-[0.75rem] text-white/60">
                  {size}
                </label>
                <input
                  id={`stock_${size}`}
                  name={`stock_${size}`}
                  type="number"
                  min={0}
                  defaultValue={current?.stock ?? 0}
                  className={field}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
        <label className="flex items-center gap-2 text-[0.875rem]">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4" />
          Featured on the homepage
        </label>

        <label className="flex items-center gap-2 text-[0.875rem]">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={product ? product.status === "published" : false}
            className="h-4 w-4"
          />
          Published
        </label>
      </section>

      {error && (
        <p role="alert" className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-[0.8125rem] text-red-300">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={btn}>
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.back()} className={btnGhost}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  name, label: text, hint, ...rest
}: { name: string; label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className={label}>{text}</label>
      <input id={name} name={name} className={`${field} mt-2`} {...rest} />
      {hint && <p className="mt-1 text-[0.75rem] text-white/35">{hint}</p>}
    </div>
  );
}

function Area({
  name, label: text, hint, ...rest
}: { name: string; label: string; hint?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={name} className={label}>{text}</label>
      <textarea id={name} name={name} className={`${area} mt-2 font-mono text-[0.8125rem]`} {...rest} />
      {hint && <p className="mt-1 text-[0.75rem] text-white/35">{hint}</p>}
    </div>
  );
}

function Select({
  name, label: text, options, hint, defaultValue,
}: { name: string; label: string; options: string[]; hint?: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className={label}>{text}</label>
      <select id={name} name={name} defaultValue={defaultValue} className={`${field} mt-2`}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[0.75rem] text-white/35">{hint}</p>}
    </div>
  );
}
