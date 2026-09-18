/**
 * THE SINGLE RENAME POINT.
 *
 * The brand name is not locked (brief 01). Everything user-facing reads from
 * here — wordmark, metadata, Open Graph, footer, WhatsApp deep links. Changing
 * `name` below renames the entire site. Nothing else hard-codes it.
 */

export const BRAND = {
  /** Display wordmark. Change this one value to rename the brand. */
  name: "I-Wear",
  /** Used where the wordmark is set in display type and needs no punctuation. */
  wordmark: "I-WEAR",
  /** Registered/legal entity. Placeholder until incorporation is confirmed. */
  legalName: "PLACEHOLDER_LEGAL_ENTITY",

  tagline: "Made to move. Built for everyday.",
  description:
    "A sportswear brand born in Pakistan. Everyday performance wear for people who move, and custom teamwear built to order.",

  /** Canonical origin. Placeholder until a domain is registered. */
  url: "https://placeholder-i-wear.example",
  locale: "en_PK",

  contact: {
    /**
     * PLACEHOLDER. International format, digits only, no +.
     * The WhatsApp architecture (brief 23) is built and works; it will point
     * at the real number the moment this value is replaced.
     */
    whatsapp: "PLACEHOLDER_WHATSAPP_NUMBER",
    email: "PLACEHOLDER_CONTACT_EMAIL",
    city: "Islamabad, Pakistan",
  },

  social: {
    instagram: "PLACEHOLDER_INSTAGRAM_URL",
    tiktok: "PLACEHOLDER_TIKTOK_URL",
    youtube: "PLACEHOLDER_YOUTUBE_URL",
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
