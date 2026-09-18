/**
 * THE SINGLE RENAME POINT.
 *
 * The brand name is not locked (brief 01). Everything user-facing reads from
 * here — wordmark, metadata, Open Graph, footer, WhatsApp deep links. Changing
 * `name` below renames the entire site. Nothing else hard-codes it.
 *
 * DEMO VALUES. Every field below carries sample data so the site can be shown
 * end to end. None of it is a real company, number, address or account. Each
 * one is listed in PLACEHOLDERS.md and must be replaced before this goes live.
 */

export const BRAND = {
  /** Display wordmark. Change this one value to rename the brand. */
  name: "I-Wear",
  /** Used where the wordmark is set in display type and needs no punctuation. */
  wordmark: "I-WEAR",
  /** DEMO. Replace with the registered entity once incorporation completes. */
  legalName: "I-Wear Apparel (Pvt) Ltd",

  tagline: "Made to move. Built for everyday.",
  description:
    "A sportswear brand born in Pakistan. Everyday performance wear for people who move, and custom teamwear built to order.",

  /** DEMO origin. Drives metadataBase, canonicals and Open Graph URLs. */
  url: "https://demo.i-wear.pk",
  locale: "en_PK",

  contact: {
    /**
     * DEMO number — not in service. International format, digits only, no +.
     * The WhatsApp architecture (brief 23) is built and works; it will point at
     * the real number the moment this value is replaced.
     */
    whatsapp: "923001234567",
    email: "hello@i-wear.pk",
    city: "Islamabad, Pakistan",
    /** DEMO. Shown on the about page. */
    studio: "Sector F-7, Islamabad",
    hours: "Monday to Saturday, 10:00 to 19:00 PKT",
  },

  /** DEMO profile URLs — these accounts do not exist. */
  social: {
    instagram: "https://instagram.com/iwear.pk",
    tiktok: "https://tiktok.com/@iwear.pk",
    youtube: "https://youtube.com/@iwear-pk",
  },
} as const;

/** True only when a placeholder has been replaced with a real value. */
export function isConfigured(value: string): boolean {
  return !value.startsWith("PLACEHOLDER_");
}

/**
 * Build a WhatsApp deep link carrying the context the customer was looking at,
 * so the conversation starts informed rather than from zero (brief 23).
 * Returns null when the number is still a placeholder — callers must handle
 * that rather than rendering a link that goes nowhere (brief 64: no dead buttons).
 */
export function whatsappLink(message: string): string | null {
  if (!isConfigured(BRAND.contact.whatsapp)) return null;
  return `https://wa.me/${BRAND.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** PKR, whole rupees, grouped. Never invents a decimal the price does not have. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}
