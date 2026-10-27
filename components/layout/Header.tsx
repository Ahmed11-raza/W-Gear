"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/components/cart/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileNav } from "./MobileNav";
import { ShoppingBag } from "lucide-react";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/teamwear", label: "Teamwear" },
  { href: "/collections", label: "Collections" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { count, ready } = useCart();
  const pathname = usePathname();

  const isDarkHero = (pathname === "/" || pathname === "/shop") && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-[320ms]",
          scrolled ? "bg-canvas/92 backdrop-blur-[6px] border-b border-line shadow-xs" : "bg-transparent",
        )}
      >
        {/* Easy Cash Back Policy & Value Announcement Moving Ribbon */}
        <div className="bg-[#101214] text-[#f9f8f6] border-b border-white/10 py-1.5 overflow-hidden select-none transition-colors group">
          <div className="animate-marquee flex items-center text-[0.6875rem] font-mono tracking-wider uppercase">
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                aria-hidden={copyIndex === 1}
                className="flex items-center gap-6 shrink-0 pr-6"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                  <span className="font-semibold text-white">Complimentary Priority Dispatch on Prepaid Orders (Raast &amp; Card)</span>
                </span>
                <span className="text-white/30">&bull;</span>
                <span className="flex items-center gap-1.5 text-white/90">
                  <span className="font-semibold text-white">7-Day Cash Back Guarantee:</span>
                  <span>Doorstep Inspection Allowed Before COD</span>
                </span>
                <span className="text-white/30">&bull;</span>
                <span className="flex items-center gap-1.5 text-white/90">
                  <span className="font-semibold text-white">Instant Raast Refunds:</span>
                  <span>Direct to Your Account</span>
                </span>
                <span className="text-white/30">&bull;</span>
                <span className="text-white/70">W-GEAR // SIALKOT ATELIER &bull; DROP 02</span>
                <span className="text-white/30">&bull;</span>
                <Link
                  href="/shipping"
                  className="inline-flex items-center gap-1 text-[0.625rem] text-white/70 hover:text-white underline underline-offset-2"
                >
                  Policy Details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="gutter flex items-center justify-between h-[64px] md:h-[72px]">
          <Link
            href="/"
            aria-label={`${BRAND.name} Home`}
            className="flex items-center transition-opacity hover:opacity-90"
          >
            <Logo variant={isDarkHero ? "light" : "dark"} size="md" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[0.8125rem] uppercase tracking-[0.1em] transition-colors duration-[180ms]",
                      isDarkHero
                        ? "text-canvas/90 hover:text-canvas"
                        : "text-ink hover:text-accent-text"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "inline-flex min-h-[44px] items-center gap-2 px-3 text-[0.75rem] uppercase tracking-[0.1em] transition-colors duration-[180ms]",
                isDarkHero ? "text-canvas hover:text-canvas/80" : "text-ink hover:text-accent-text"
              )}
              aria-label={`Shopping bag, ${count} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag</span>
              <span className={cn("text-spec", isDarkHero ? "text-canvas/60" : "text-muted")}>
                {ready ? `(${count})` : "(0)"}
              </span>
            </button>

            <Link
              href="/teamwear/build"
              className={cn(
                "hidden lg:inline-flex min-h-[44px] items-center border px-5 text-[0.75rem] uppercase tracking-[0.1em] transition-colors duration-[180ms]",
                isDarkHero
                  ? "border-canvas/40 text-canvas hover:bg-canvas hover:text-ink"
                  : "border-ink text-ink hover:bg-ink hover:text-inverse"
              )}
            >
              Build your team
            </Link>
            <MobileNav isDark={isDarkHero} />
          </div>
        </div>
      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
