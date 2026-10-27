import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

export interface LogoProps {
  variant?: "light" | "dark";
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  markClassName?: string;
}

export function Logo({
  variant = "dark",
  showWordmark = true,
  size = "md",
  className,
  markClassName,
}: LogoProps) {
  // Exact dimensions calculated from the 600x339 emblem aspect ratio (~1.77:1)
  const dimensions = {
    sm: { width: 38, height: 22 },
    md: { width: 48, height: 27 },
    lg: { width: 64, height: 36 },
  }[size];

  const src = variant === "light"
    ? "/images/logo/w-gear-white.png"
    : "/images/logo/w-gear-dark.png";

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <span
        className={cn("relative inline-block shrink-0", markClassName)}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <Image
          src={src}
          alt=""
          width={dimensions.width * 2}
          height={dimensions.height * 2}
          priority
          className="h-full w-full object-contain"
        />
      </span>

      {showWordmark && (
        <span
          className={cn(
            "font-display font-black tracking-[-0.03em] uppercase leading-none transition-colors",
            size === "sm" && "text-[0.9375rem]",
            size === "md" && "text-[1.0625rem]",
            size === "lg" && "text-[1.375rem]",
            variant === "light" ? "text-canvas" : "text-ink"
          )}
        >
          {BRAND.wordmark}
        </span>
      )}
    </span>
  );
}
