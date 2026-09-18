import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.08em] " +
  "transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:opacity-40 disabled:pointer-events-none select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px]";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-inverse hover:bg-ink-soft focus-visible:outline-ink",
  outline:
    "border border-line-strong text-ink hover:border-ink hover:bg-surface focus-visible:outline-ink",
  ghost:
    "text-ink underline underline-offset-[6px] decoration-line-strong hover:decoration-ink focus-visible:outline-ink",
  inverse:
    "bg-canvas text-ink hover:bg-surface focus-visible:outline-canvas",
};

/* 44px minimum touch target at every size (brief 37/39). */
const sizes: Record<Size, string> = {
  sm: "min-h-[44px] px-4 text-[0.75rem]",
  md: "min-h-[48px] px-6 text-[0.8125rem]",
  lg: "min-h-[56px] px-8 text-[0.875rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
