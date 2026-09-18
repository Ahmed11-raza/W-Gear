"use client";

import { useId } from "react";
import type { LogoPlacement } from "@/types";

interface KitPreviewProps {
  /** region id -> hex. Unknown regions are ignored. */
  colors: Record<string, string>;
  pattern: string;
  playerName: string;
  playerNumber: string;
  logoUrl: string | null;
  logoPlacement: LogoPlacement;
  showNumber: boolean;
  showName: boolean;
  className?: string;
}

/** Placement -> logo box on the 400x480 template grid. */
const LOGO_BOX: Record<LogoPlacement, { x: number; y: number; w: number; h: number }> = {
  "chest-left": { x: 232, y: 150, w: 58, h: 58 },
  "chest-centre": { x: 171, y: 148, w: 58, h: 58 },
  "back-upper": { x: 155, y: 132, w: 90, h: 46 },
  sleeve: { x: 62, y: 150, w: 44, h: 44 },
};

/**
 * Layered SVG garment template (brief 18).
 *
 * Tintable regions, pattern layers, logo placement and live name/number
 * rendering. Deliberately 2D — a fake 3D system would look impressive and tell
 * the customer nothing true. Every control here changes the artwork on screen.
 *
 * It approximates print placement. It does not simulate fabric drape, seam
 * shadow or how ink sits on a textured knit — the UI says so where the customer
 * can read it, rather than implying a production-accurate proof.
 */
export function KitPreview({
  colors,
  pattern,
  playerName,
  playerNumber,
  logoUrl,
  logoPlacement,
  showNumber,
  showName,
  className,
}: KitPreviewProps) {
  const uid = useId().replace(/:/g, "");
  const body = colors.body ?? "#1c1917";
  const panel = colors.panel ?? "#b85d3b";
  const collar = colors.collar ?? "#f9f8f6";

  const bodyClip = `bodyclip-${uid}`;
  const patternId = `pattern-${uid}`;
  const logoClip = `logoclip-${uid}`;

  const BODY_PATH =
    "M132 58 L268 58 C275 58 279 63 280 71 L292 430 C293 437 288 443 281 443 L119 443 C112 443 107 437 108 430 L120 71 C121 63 125 58 132 58 Z";

  const logo = LOGO_BOX[logoPlacement];

  return (
    <svg
      viewBox="0 0 400 480"
      className={className}
      role="img"
      aria-label={`Kit preview: ${pattern === "none" ? "solid" : pattern} pattern${
        showNumber && playerNumber ? `, number ${playerNumber}` : ""
      }${showName && playerName ? `, name ${playerName}` : ""}`}
    >
      <defs>
        <clipPath id={bodyClip}>
          <path d={BODY_PATH} />
        </clipPath>

        {pattern === "diagonal" && (
          <pattern id={patternId} width="54" height="54" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <rect width="27" height="54" fill={panel} />
          </pattern>
        )}
        {pattern === "hoops" && (
          <pattern id={patternId} width="10" height="76" patternUnits="userSpaceOnUse">
            <rect width="10" height="38" fill={panel} />
          </pattern>
        )}
        {pattern === "fade" && (
          <linearGradient id={patternId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={panel} stopOpacity="0.95" />
            <stop offset="72%" stopColor={panel} stopOpacity="0" />
          </linearGradient>
        )}

        <clipPath id={logoClip}>
          <rect x={logo.x} y={logo.y} width={logo.w} height={logo.h} />
        </clipPath>
      </defs>

      {/* Sleeves — drawn under the torso so the seam reads correctly */}
      <path
        d="M133 59 C110 62 96 68 88 80 L48 152 C44 159 47 168 55 171 L95 187 C102 190 110 186 112 179 L131 118 Z"
        fill={body}
      />
      <path
        d="M267 59 C290 62 304 68 312 80 L352 152 C356 159 353 168 345 171 L305 187 C298 190 290 186 288 179 L269 118 Z"
        fill={body}
      />

      {/* Torso base */}
      <path d={BODY_PATH} fill={body} />

      {/* Pattern layer, clipped to the torso */}
      {pattern !== "none" && (
        <g clipPath={`url(#${bodyClip})`}>
          <rect x="100" y="50" width="200" height="400" fill={`url(#${patternId})`} />
        </g>
      )}

      {/* Side panels — always visible so the panel colour is never a no-op */}
      {pattern === "none" && (
        <g clipPath={`url(#${bodyClip})`}>
          <rect x="108" y="50" width="20" height="400" fill={panel} />
          <rect x="272" y="50" width="20" height="400" fill={panel} />
        </g>
      )}

      {/* Collar */}
      <path
        d="M164 56 C176 84 224 84 236 56 C236 56 224 46 200 46 C176 46 164 56 164 56 Z"
        fill={collar}
      />
      <path
        d="M168 60 C180 86 220 86 232 60"
        fill="none"
        stroke={body}
        strokeOpacity="0.28"
        strokeWidth="3"
      />

      {/* Player number */}
      {showNumber && playerNumber && (
        <text
          x="200"
          y="300"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={collar}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "118px",
            fontWeight: 500,
            letterSpacing: "-0.04em",
          }}
        >
          {playerNumber.slice(0, 2)}
        </text>
      )}

      {/* Player name */}
      {showName && playerName && (
        <text
          x="200"
          y="208"
          textAnchor="middle"
          fill={collar}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          {playerName.toUpperCase().slice(0, 12)}
        </text>
      )}

      {/* Uploaded logo */}
      {logoUrl && (
        <g clipPath={`url(#${logoClip})`}>
          <image
            href={logoUrl}
            x={logo.x}
            y={logo.y}
            width={logo.w}
            height={logo.h}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )}
    </svg>
  );
}
