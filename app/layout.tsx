import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import { BRAND } from "@/lib/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DemoNotice } from "@/components/layout/DemoNotice";
import { WhatsAppDesk } from "@/components/layout/WhatsAppDesk";
import { Analytics } from "@/components/analytics/Analytics";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { CatalogueSync } from "@/components/catalogue/CatalogueSync";
import { getProducts } from "@/lib/store";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The cart runs in the browser and cannot query the database, so the
  // published catalogue is handed to it here.
  const products = await getProducts();

  return (
    <html lang="en" className={fontClassNames}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-inverse focus:px-4 focus:py-3 focus:text-[0.8125rem] focus:uppercase focus:tracking-[0.08em]"
        >
          Skip to content
        </a>
        <CatalogueSync products={products} />
        <ChromeGate>
          <Header />
        </ChromeGate>
        <main id="main">{children}</main>
        <ChromeGate>
          <Footer />
          <DemoNotice />
          <WhatsAppDesk />
        </ChromeGate>
        <Analytics />
      </body>
    </html>
  );
}
