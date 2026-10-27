"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  ShoppingBag,
  Percent,
  Package,
  Users,
  MessageSquare,
  Mail,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/promotions", label: "Promotions & Sales", icon: Percent },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav aria-label="Admin sections" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {ADMIN_LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded px-3 text-[0.8125rem] transition-colors font-medium",
                    active ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Hamburger Toggle Button */}
      <div className="lg:hidden flex items-center">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white/70 hover:text-white focus:outline-hidden"
          aria-label="Open admin navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-[#141618] border-r border-white/10 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Store Management
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-white/60 hover:text-white"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ul className="mt-4 flex flex-col gap-1">
                {ADMIN_LINKS.map((link) => {
                  const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                          active
                            ? "bg-[#C4F319] text-black font-bold"
                            : "text-white/70 hover:text-white hover:bg-white/5",
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2 text-xs text-white/60 hover:text-white rounded hover:bg-white/5"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded hover:bg-white/5"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
