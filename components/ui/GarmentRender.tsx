import type { Silhouette } from "@/types";
import { cn } from "@/lib/cn";

interface GarmentRenderProps {
  silhouette: Silhouette;
  /** Body colour. */
  hex: string;
  /** Trim — collar, cuff, panel, drawcord. */
  accentHex: string;
  /**
   * Stable unique string. SVG `defs` ids must not collide when several renders
   * share a page, and this component is server-rendered, so the id cannot come
   * from `useId`. Product slug plus colourway id is already unique.
   */
  uid: string;
  className?: string;
}

/**
 * Procedural garment artwork.
 *
 * The catalogue has no photography (see SHOTLIST.md — four frames are briefed
 * and none are shot). Rather than ship empty slots across a twelve-product
 * grid, each product is drawn: a flat technical illustration in the brand
 * palette, tinted from the product's own colourway.
 *
 * This is deliberately a drawing and reads as one. It is not a render, and it
 * is not passed off as a photograph of a garment — the same principle the kit
 * preview works under. When real photography arrives it replaces this outright.
 */
export function GarmentRender({
  silhouette,
  hex,
  accentHex,
  uid,
  className,
}: GarmentRenderProps) {
  const key = uid.replace(/[^a-zA-Z0-9]/g, "");
  const weaveId = `weave-${key}`;
  const shadeId = `shade-${key}`;
  const clipId = `clip-${key}`;

  const shape = SHAPES[silhouette];

  return (
    <svg
      viewBox="0 0 400 480"
      className={cn("h-full w-full", className)}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        {/* Fine weave — gives the flat fill a cloth surface at close crop. */}
        <pattern id={weaveId} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="none" />
          <path d="M0 3 H6 M3 0 V6" stroke="#000" strokeOpacity="0.05" strokeWidth="0.75" />
        </pattern>

        {/* Soft vertical shade so the garment is not a dead flat shape. */}
        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor="#000" stopOpacity="0.14" />
          <stop offset="34%" stopColor="#000" stopOpacity="0" />
          <stop offset="76%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>

        <clipPath id={clipId}>
          {shape.mass.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>

      {/* Body and any secondary masses (sleeves, hood, legs) */}
      {shape.mass.map((d, i) => (
        <path
          key={`fill-${i}`}
          d={d}
          fill={hex}
          stroke="#1c1917"
          strokeOpacity="0.16"
          strokeWidth="1.25"
        />
      ))}

      {/* Surface treatments, clipped to the garment outline */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="400" height="480" fill={`url(#${weaveId})`} />
        <rect x="0" y="0" width="400" height="480" fill={`url(#${shadeId})`} />
        {shape.panels?.map((d, i) => (
          <path key={`panel-${i}`} d={d} fill={accentHex} fillOpacity="0.92" />
        ))}
      </g>

      {/* Trim drawn over the outline — cuff, waistband, placket */}
      {shape.trim?.map((d, i) => (
        <path
          key={`trim-${i}`}
          d={d}
          fill={accentHex}
          stroke="#1c1917"
          strokeOpacity="0.16"
          strokeWidth="1.25"
        />
      ))}

      {/* Neckline: an opening with a rib around it, not a filled shape. Filling
          the collar solid reads as a bib rather than a neck, and puts a large
          block of the accent colour at the throat — the accent belongs in a
          thin ring here (brief 04: use accents sparingly). */}
      {shape.neck && (
        <>
          <path d={shape.neck} fill="#1c1917" fillOpacity="0.5" />
          <path
            d={shape.neck}
            fill="none"
            stroke={accentHex}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d={shape.neck}
            fill="none"
            stroke="#1c1917"
            strokeOpacity="0.18"
            strokeWidth="1.25"
          />
        </>
      )}

      {/* Construction lines — seams and stitch detail */}
      {shape.seams?.map((d, i) => (
        <path
          key={`seam-${i}`}
          d={d}
          fill="none"
          stroke="#1c1917"
          strokeOpacity="0.22"
          strokeWidth="1.25"
          strokeDasharray={shape.stitched ? "5 4" : undefined}
        />
      ))}
    </svg>
  );
}

interface Shape {
  /** Filled garment masses. Also become the texture clip. */
  mass: string[];
  /** Accent regions inside the mass — stripes, pockets. */
  panels?: string[];
  /** Accent pieces drawn on top — cuffs, waistband, placket. */
  trim?: string[];
  /** Neck opening. Rendered as a hole with a rib, never filled solid. */
  neck?: string;
  /** Seam and construction lines. */
  seams?: string[];
  /** Render seams as topstitch dashes. */
  stitched?: boolean;
}

const TORSO =
  "M132 58 L268 58 C275 58 279 63 280 71 L292 430 C293 437 288 443 281 443 L119 443 C112 443 107 437 108 430 L120 71 C121 63 125 58 132 58 Z";

const SLEEVE_SHORT_L =
  "M133 59 C110 62 96 68 88 80 L48 152 C44 159 47 168 55 171 L95 187 C102 190 110 186 112 179 L131 118 Z";
const SLEEVE_SHORT_R =
  "M267 59 C290 62 304 68 312 80 L352 152 C356 159 353 168 345 171 L305 187 C298 190 290 186 288 179 L269 118 Z";

const SLEEVE_LONG_L =
  "M133 59 C110 62 96 68 88 80 L36 292 C33 303 39 312 50 314 L84 321 C94 323 101 318 103 308 L131 126 Z";
const SLEEVE_LONG_R =
  "M267 59 C290 62 304 68 312 80 L364 292 C367 303 361 312 350 314 L316 321 C306 323 299 318 297 308 L269 126 Z";

/* A neck opening, not a collar piece: wide, shallow, and sitting just below
   the shoulder line so the rib reads as ribbing rather than as a yoke. */
const CREW_NECK =
  "M174 57 C174 79 226 79 226 57 C226 50 214 46 200 46 C186 46 174 50 174 57 Z";

const SCOOP_NECK =
  "M176 56 C176 88 224 88 224 56 C224 49 212 45 200 45 C188 45 176 49 176 56 Z";

const CUFF_L = "M38 296 L104 310 L101 330 L35 316 Z";
const CUFF_R = "M362 296 L296 310 L299 330 L365 316 Z";

const SHAPES: Record<Silhouette, Shape> = {
  tee: {
    mass: [SLEEVE_SHORT_L, SLEEVE_SHORT_R, TORSO],
    neck: CREW_NECK,
    seams: [
      "M131 118 L133 59",
      "M269 118 L267 59",
      "M112 424 L288 424",
    ],
  },

  jersey: {
    mass: [SLEEVE_SHORT_L, SLEEVE_SHORT_R, TORSO],
    panels: [
      "M108 70 L128 70 L136 443 L112 443 Z",
      "M272 70 L292 70 L288 443 L264 443 Z",
    ],
    neck: SCOOP_NECK,
    seams: [
      "M131 118 L133 59",
      "M269 118 L267 59",
      "M112 424 L288 424",
      "M176 62 C186 86 194 104 200 114",
      "M224 62 C214 86 206 104 200 114",
    ],
  },

  polo: {
    mass: [SLEEVE_SHORT_L, SLEEVE_SHORT_R, TORSO],
    trim: [
      "M162 48 L200 92 L238 48 C238 48 242 62 244 74 L200 112 L156 74 C158 62 162 48 162 48 Z",
      "M96 176 L132 190 L128 205 L92 191 Z",
      "M304 176 L268 190 L272 205 L308 191 Z",
    ],
    seams: [
      "M131 118 L133 59",
      "M269 118 L267 59",
      "M190 100 L190 186",
      "M210 100 L210 186",
      "M112 424 L288 424",
      "M118 400 L118 443",
      "M282 400 L282 443",
    ],
  },

  longsleeve: {
    mass: [SLEEVE_LONG_L, SLEEVE_LONG_R, TORSO],
    trim: [CUFF_L, CUFF_R],
    neck: CREW_NECK,
    seams: [
      "M131 126 L133 59",
      "M269 126 L267 59",
      "M112 424 L288 424",
    ],
  },

  tank: {
    mass: [
      "M158 54 L242 54 C248 54 252 58 253 66 C258 96 264 122 270 142 L292 430 C293 437 288 443 281 443 L119 443 C112 443 107 437 108 430 L130 142 C136 122 142 96 147 66 C148 58 152 54 158 54 Z",
    ],
    neck: SCOOP_NECK,
    seams: [
      "M147 66 C152 100 138 128 130 142",
      "M253 66 C248 100 262 128 270 142",
      "M112 424 L288 424",
    ],
  },

  shorts: {
    mass: [
      "M110 96 L290 96 L284 300 C283 307 278 312 271 312 L216 312 C209 312 204 307 203 300 L200 196 L197 300 C196 307 191 312 184 312 L129 312 C122 312 117 307 116 300 Z",
    ],
    panels: [
      "M110 96 L124 96 L120 312 L116 312 Z",
      "M290 96 L276 96 L280 312 L284 312 Z",
    ],
    trim: ["M108 58 L292 58 C294 58 294 60 294 62 L294 96 L106 96 L106 62 C106 60 106 58 108 58 Z"],
    seams: ["M200 96 L200 196", "M182 84 C190 92 210 92 218 84"],
  },

  joggers: {
    mass: [
      "M110 96 L290 96 L281 412 C280 421 275 426 268 426 L221 426 C214 426 209 421 208 412 L200 236 L192 412 C191 421 186 426 179 426 L132 426 C125 426 120 421 119 412 Z",
    ],
    panels: [
      "M110 96 L124 96 L122 412 L119 412 Z",
      "M290 96 L276 96 L278 412 L281 412 Z",
    ],
    trim: [
      "M108 58 L292 58 C294 58 294 60 294 62 L294 96 L106 96 L106 62 C106 60 106 58 108 58 Z",
      "M118 408 L193 408 L192 432 L119 432 Z",
      "M282 408 L207 408 L208 432 L281 432 Z",
    ],
    seams: ["M200 96 L200 236", "M182 84 C190 92 210 92 218 84"],
  },

  jacket: {
    mass: [SLEEVE_LONG_L, SLEEVE_LONG_R, TORSO],
    trim: [
      "M158 46 L242 46 C246 46 248 50 248 56 L248 74 L152 74 L152 56 C152 50 154 46 158 46 Z",
      CUFF_L,
      CUFF_R,
      "M112 418 L288 418 L290 438 C290 441 288 443 285 443 L115 443 C112 443 110 441 110 438 Z",
    ],
    seams: [
      "M133 59 L172 132",
      "M267 59 L228 132",
      "M200 74 L200 418",
      "M190 150 L190 230",
      "M210 150 L210 230",
    ],
    stitched: true,
  },

  hoodie: {
    mass: [
      "M152 62 C152 26 172 8 200 8 C228 8 248 26 248 62 C238 50 220 44 200 44 C180 44 162 50 152 62 Z",
      SLEEVE_LONG_L,
      SLEEVE_LONG_R,
      TORSO,
    ],
    panels: ["M136 318 L264 318 L270 392 L130 392 Z"],
    trim: [
      CUFF_L,
      CUFF_R,
      "M110 414 L290 414 L292 438 C292 441 290 443 287 443 L113 443 C110 443 108 441 108 438 Z",
    ],
    neck: CREW_NECK,
    seams: [
      "M131 126 L133 59",
      "M269 126 L267 59",
      "M200 8 L200 44",
      "M176 118 L176 150",
      "M224 118 L224 150",
      "M136 318 L130 392",
      "M264 318 L270 392",
    ],
  },
};
