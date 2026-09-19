"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the storefront chrome on admin routes.
 *
 * The alternative was moving every storefront route into a `(site)` route
 * group so admin could have its own root layout. That is the tidier structure,
 * but it means relocating ten directories in a repository someone else is
 * actively committing to, and the merge cost is not worth the tidiness here.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
