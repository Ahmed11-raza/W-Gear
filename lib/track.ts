/**
 * Commerce events.
 *
 * Page views answer "how many came". These answer "where they stopped", which
 * is the only question that changes revenue. Each call forwards to whichever
 * tags are live and is a no-op when none are — so call sites never have to
 * check whether measurement is configured.
 *
 * Event names follow GA4's recommended commerce schema, because the funnel and
 * checkout reports only populate for the reserved names.
 */

type Params = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Params) => void;
    fbq?: (command: string, event: string, params?: Params) => void;
  }
}

function send(ga: string, meta: string | null, params: Params) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", ga, params);
  if (meta) window.fbq?.("track", meta, params);
}

interface Item {
  slug: string;
  name: string;
  price: number;
  colorway?: string;
  size?: string;
  quantity?: number;
}

const toGA = (i: Item) => ({
  item_id: i.slug,
  item_name: i.name,
  price: i.price,
  item_variant: [i.colorway, i.size].filter(Boolean).join(" / ") || undefined,
  quantity: i.quantity ?? 1,
});

export function trackViewItem(item: Item) {
  send("view_item", "ViewContent", {
    currency: "PKR",
    value: item.price,
    items: [toGA(item)],
  });
}

export function trackAddToCart(item: Item) {
  send("add_to_cart", "AddToCart", {
    currency: "PKR",
    value: item.price * (item.quantity ?? 1),
    items: [toGA(item)],
  });
}

export function trackBeginCheckout(items: Item[], value: number) {
  send("begin_checkout", "InitiateCheckout", {
    currency: "PKR",
    value,
    items: items.map(toGA),
  });
}

export function trackPurchase(items: Item[], value: number, orderId: string, method: string) {
  send("purchase", "Purchase", {
    transaction_id: orderId,
    currency: "PKR",
    value,
    payment_type: method,
    items: items.map(toGA),
  });
}

/**
 * Teamwear enquiries and newsletter signups — the highest-value events on the
 * site, since one team order is worth many individual ones.
 *
 * No monetary value is attached. Teamwear is quoted rather than priced, so any
 * figure here would be invented, and an invented conversion value corrupts
 * every ROAS number downstream. Quantity is passed instead; value can be
 * joined on later from whatever the quote actually closes at.
 */
export function trackLead(source: string, quantity?: number) {
  send("generate_lead", "Lead", {
    lead_source: source,
    ...(quantity ? { quantity } : {}),
  });
}

export function trackSignup(source: string) {
  send("sign_up", "CompleteRegistration", { method: source });
}

/** WhatsApp hand-offs leave the site, so they are the last thing we can measure. */
export function trackWhatsApp(topic: string) {
  send("contact_whatsapp", "Contact", { topic });
}
