import Link from "next/link";
import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { PublishButton } from "@/components/admin/PublishButton";

export const metadata: Metadata = {
  title: "Admin",
  // The panel must never be indexed, even if the URL leaks.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Admin shell.
 *
 * Deliberately not the storefront's visual language. The storefront is warm,
 * spacious and editorial because it is selling something; this is dense,
 * cool-toned and utilitarian because it is a tool. Making them look alike
 * would invite the mistake of thinking you are on the live site.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#101214] text-[#e6e8ea]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#101214]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-6 px-5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-[0.8125rem] font-bold tracking-[0.12em] uppercase">
              I-Wear&nbsp;<span className="text-white/40">Admin</span>
            </Link>
            <AdminNav />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex h-9 items-center rounded border border-white/15 px-3 text-[0.75rem] text-white/70 transition-colors hover:border-white/35 hover:text-white"
            >
              View site
            </Link>
            <PublishButton />
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded px-3 text-[0.75rem] text-white/50 transition-colors hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[90rem] px-5 py-8">{children}</main>
    </div>
  );
}
