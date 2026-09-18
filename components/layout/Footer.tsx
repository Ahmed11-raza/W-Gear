import Link from "next/link";
import { BRAND, isConfigured } from "@/lib/brand";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All sportswear" },
      { href: "/collections/training", label: "Training" },
      { href: "/collections/everyday", label: "Everyday" },
      { href: "/shop/sizing", label: "Size guide" },
    ],
  },
  {
    heading: "Teamwear",
    links: [
      { href: "/teamwear", label: "Custom teamwear" },
      { href: "/teamwear/build", label: "Build your team" },
      { href: "/teamwear/manufacturing", label: "How it is made" },
    ],
  },
  {
    heading: "Brand",
    links: [
      { href: "/about", label: "About" },
      { href: "/stories", label: "Stories" },
      { href: "/shipping", label: "Shipping & returns" },
    ],
  },
] as const;

const SOCIAL = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="gutter py-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold uppercase tracking-[-0.035em] leading-[0.92]">
              {BRAND.wordmark}
            </p>
            <p className="mt-4 max-w-[34ch] text-muted">{BRAND.description}</p>
            <p className="text-spec mt-6 text-muted">{BRAND.contact.city}</p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL.filter(({ key }) => isConfigured(BRAND.social[key])).map(
                ({ key, label }) => (
                  <li key={key}>
                    <a
                      href={BRAND.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spec text-ink transition-colors duration-[180ms] hover:text-accent-text"
                    >
                      {label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-spec text-muted">{col.heading}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-ink hover:text-accent-text transition-colors duration-[180ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-spec text-muted">
            &copy; {year}{" "}
            {isConfigured(BRAND.legalName) ? BRAND.legalName : BRAND.name}
          </p>
          <p className="text-spec text-muted">
            {isConfigured(BRAND.contact.email)
              ? BRAND.contact.email
              : "Contact details to be confirmed"}
          </p>
        </div>

        <p className="text-spec mt-6 max-w-[70ch] text-muted">
          Demonstration build — products, prices, stock, policies and contact
          details are sample data and describe no real business.
        </p>
      </div>
    </footer>
  );
}
