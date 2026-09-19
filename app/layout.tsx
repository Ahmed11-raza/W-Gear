import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import { BRAND } from "@/lib/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DemoNotice } from "@/components/layout/DemoNotice";
import { WhatsAppDesk } from "@/components/layout/WhatsAppDesk";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    locale: BRAND.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f8f6",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassNames}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-inverse focus:px-4 focus:py-3 focus:text-[0.8125rem] focus:uppercase focus:tracking-[0.08em]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <DemoNotice />
        <WhatsAppDesk />
        <Analytics />
      </body>
    </html>
  );
}
