"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { useCart } from "@/components/cart/useCart";
import { MobileNav } from "./MobileNav";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/teamwear", label: "Teamwear" },
  { href: "/collections", label: "Collections" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
] as const;

/**
 * Restrained by instruction (brief 26). Wordmark, five links, the cart, and one
 * high-value CTA. The header earns its place by staying quiet.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { count, ready } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-[320ms]",
        scrolled ? "bg-canvas/92 backdrop-blur-[6px] border-b border-line" : "bg-transparent",
      )}
    >
      <div className="gutter flex items-center justify-between h-[68px] md:h-[76px]">
        <Link
          href="/"
          className="font-display font-extrabold text-[1.0625rem] tracking-[-0.02em] uppercase"
        >
          {BRAND.wordmark}
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.8125rem] uppercase tracking-[0.1em] text-ink hover:text-accent-text transition-colors duration-[180ms]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="inline-flex min-h-[44px] items-center gap-2 px-2 text-[0.75rem] uppercase tracking-[0.1em] text-ink hover:text-accent-text transition-colors duration-[180ms]"
          >
            Cart
            {/* Suppressed until localStorage has been read, so the server and
                client markup agree on first paint. */}
            <span className="text-spec text-muted">{ready ? `(${count})` : "(0)"}</span>
          </Link>

          <Link
            href="/teamwear/build"
            className="hidden lg:inline-flex min-h-[44px] items-center border border-ink px-5 text-[0.75rem] uppercase tracking-[0.1em] hover:bg-ink hover:text-inverse transition-colors duration-[180ms]"
          >
            Build your team
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
