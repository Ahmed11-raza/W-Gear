"use client";

import { cn } from "@/lib/cn";

/**
 * Selection controls for the configurator.
 *
 * All of these are real radio groups underneath — native inputs, visually
 * hidden but focusable, so arrow keys move between options and screen readers
 * announce the group. The card is the label (brief 39).
 */

export function OptionGrid({
  legend,
  children,
  columns = 3,
}: {
  legend: string;
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">{legend}</legend>
      <div
        className={cn(
          "grid gap-3",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 lg:grid-cols-4",
        )}
      >
        {children}
      </div>
    </fieldset>
  );
}

export function OptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  note,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  note?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-[72px] cursor-pointer flex-col justify-center border p-4 transition-colors duration-[180ms]",
        checked
          ? "border-ink bg-ink text-canvas"
          : "border-line bg-canvas hover:border-line-strong",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="text-[0.9375rem] font-medium">{title}</span>
      {note && (
        <span className={cn("mt-1 text-[0.8125rem]", checked ? "text-canvas/70" : "text-muted")}>
          {note}
        </span>
      )}
    </label>
  );
}

export function SwatchRow({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { id: string; name: string; hex: string }[];
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-spec text-muted">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value.toLowerCase() === o.hex.toLowerCase();
          return (
            <label
              key={o.id}
              title={o.name}
              className={cn(
                "relative grid h-11 w-11 cursor-pointer place-items-center border transition-colors duration-[180ms]",
                selected ? "border-ink" : "border-line hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name={name}
                checked={selected}
                onChange={() => onChange(o.hex)}
                className="sr-only"
              />
              <span className="sr-only">{o.name}</span>
              <span
                aria-hidden
                className="h-7 w-7 border border-black/10"
                style={{ backgroundColor: o.hex }}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-spec block text-muted">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-2 text-[0.8125rem] text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full min-h-[48px] border border-line-strong bg-canvas px-4 text-[0.9375rem] " +
  "focus:border-ink focus:outline-2 focus:outline-offset-[3px] focus:outline-ink " +
  "aria-[invalid=true]:border-danger";
