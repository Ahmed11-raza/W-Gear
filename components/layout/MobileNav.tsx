"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "./Header";

/**
 * Full-screen takeover (brief 26). Large targets, clear hierarchy, no
 * dependence on hover. Escape closes, focus is trapped while open, background
 * scroll is locked, and focus returns to the trigger on close.
 */
export function MobileNav({ isDark = false }: { isDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="lg:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center -mr-2"
      >
        <span className="sr-only">Open menu</span>
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className={cn("block h-px w-6 transition-colors", isDark ? "bg-canvas" : "bg-ink")} />
          <span className={cn("block h-px w-6 transition-colors", isDark ? "bg-canvas" : "bg-ink")} />
        </span>
      </button>

      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-[60] bg-canvas flex flex-col"
      >
        <div className="gutter flex items-center justify-between h-[68px] border-b border-line">
          <Link href="/" onClick={close} className="flex items-center">
            <Logo variant="dark" size="sm" />
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center -mr-2"
          >
            <span className="sr-only">Close menu</span>
            <span aria-hidden className="relative block h-6 w-6">
              <span className="absolute top-1/2 left-0 h-px w-6 bg-ink rotate-45" />
              <span className="absolute top-1/2 left-0 h-px w-6 bg-ink -rotate-45" />
            </span>
          </button>
        </div>

        <nav aria-label="Site" className="gutter flex-1 overflow-y-auto py-8">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center min-h-[64px] font-display text-[2rem] font-extrabold tracking-[-0.03em] uppercase"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/teamwear/build"
            onClick={() => setOpen(false)}
            className="mt-8 flex min-h-[56px] items-center justify-center bg-ink text-inverse text-[0.8125rem] uppercase tracking-[0.1em]"
          >
            Build your team
          </Link>
        </nav>
      </div>
    </>
  );
}
