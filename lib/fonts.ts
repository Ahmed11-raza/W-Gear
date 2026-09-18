import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";

/**
 * Typography system.
 *
 * Display  Cabinet Grotesk — editorial grotesque, slightly condensed.
 * UI       Satoshi — same foundry, built to sit under Cabinet Grotesk.
 * Spec     Geist Mono — technical data ONLY (GSM, measurements, numbers).
 *
 * All three are self-hosted: no render-blocking external stylesheet, no
 * layout shift. `display: swap` plus an explicitly matched fallback keeps
 * the CLS budget intact while the variable file streams in.
 */

export const cabinet = localFont({
  src: [{ path: "../public/fonts/CabinetGrotesk-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-cabinet",
  display: "swap",
  preload: true,
  fallback: ["Arial Narrow", "Helvetica Neue", "system-ui", "sans-serif"],
  adjustFontFallback: false,
});

export const satoshi = localFont({
  src: [{ path: "../public/fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "sans-serif"],
  adjustFontFallback: false,
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const fontClassNames = [cabinet.variable, satoshi.variable, geistMono.variable].join(" ");
