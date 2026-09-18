import Image from "next/image";
import type { ResolvedSlot } from "@/lib/images";
import { cn } from "@/lib/cn";

interface BrandImageProps {
  slot: ResolvedSlot;
  /** Responsive sizes hint. Always pass one — it decides the bytes downloaded. */
  sizes: string;
  className?: string;
  /** Show the full shot brief in the placeholder. Off for small slots. */
  showBrief?: boolean;
}

/**
 * An image slot.
 *
 * Supplied  -> the real photograph, responsive, AVIF/WebP, aspect-ratio boxed.
 * Unsupplied -> a designed, unmistakably-marked placeholder carrying the shot
 *               brief, so the layout is judgeable and nothing is passed off as
 *               real photography (brief 20/53).
 *
 * Both branches occupy identical space, so filling a slot causes no reflow.
 */
export function BrandImage({ slot, sizes, className, showBrief = true }: BrandImageProps) {
  if (slot.supplied) {
    return (
      <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio: slot.ratio }}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={slot.priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder for ${slot.id}. Awaiting photography: ${slot.alt}`}
      className={cn(
        "relative overflow-hidden bg-surface border border-line flex flex-col justify-between",
        className,
      )}
      style={{ aspectRatio: slot.ratio }}
    >
      {/* Cutting-table hatch — the Cut Line device at texture scale */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id={`hatch-${slot.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" className="text-line" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hatch-${slot.id})`} opacity="0.55" />
      </svg>

      <div className="relative gutter pt-5">
        <p className="text-spec text-ink">Placeholder</p>
        <p className="text-spec mt-1 text-muted">
          {slot.id} &middot; {slot.ratio.toFixed(2)}:1
        </p>
      </div>

      {showBrief && (
        <div className="relative gutter pb-5">
          <p className="max-w-[46ch] text-[0.8125rem] leading-[1.5] text-muted">{slot.brief}</p>
        </div>
      )}
    </div>
  );
}
