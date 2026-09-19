import Link from "next/link";
import { cn } from "@/lib/cn";

/** Shared admin primitives. Dense and plain — this is a tool, not a shopfront. */

export function PageTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-[1.375rem] font-bold tracking-[-0.02em]">{title}</h1>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded border border-white/10 bg-white/[0.03] p-5", className)}>
      {children}
    </div>
  );
}

export function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const body = (
    <>
      <p className="text-[0.75rem] uppercase tracking-[0.1em] text-white/45">{label}</p>
      <p className="mt-2 text-[2rem] font-bold leading-none tracking-[-0.03em]">{value}</p>
    </>
  );

  return href ? (
    <Link href={href} className="rounded border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25">
      {body}
    </Link>
  ) : (
    <div className="rounded border border-white/10 bg-white/[0.03] p-5">{body}</div>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warn" | "bad"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-white/10 text-white/70",
    good: "bg-emerald-500/15 text-emerald-300",
    warn: "bg-amber-500/15 text-amber-300",
    bad: "bg-red-500/15 text-red-300",
  };
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-[0.6875rem] font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded border border-dashed border-white/15 p-10 text-center text-[0.875rem] text-white/45">
      {message}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded border border-white/10">
      <table className="w-full min-w-[46rem] border-collapse text-left text-[0.875rem]">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const field =
  "h-10 w-full rounded border border-white/15 bg-black/30 px-3 text-[0.875rem] text-white outline-none focus:border-white/50";
export const area =
  "w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-[0.875rem] text-white outline-none focus:border-white/50";
export const label = "text-[0.6875rem] uppercase tracking-[0.1em] text-white/50";
export const btn =
  "inline-flex h-10 items-center justify-center rounded bg-white px-4 text-[0.8125rem] font-semibold text-black transition-colors hover:bg-white/85 disabled:opacity-50";
export const btnGhost =
  "inline-flex h-9 items-center justify-center rounded border border-white/15 px-3 text-[0.75rem] text-white/70 transition-colors hover:border-white/35 hover:text-white";
