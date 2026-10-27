import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import type {
  ProductLine,
  Silhouette,
  FitProfile,
  Specification,
  ProductColorway,
  ProductVariant,
  CartLine,
} from "@/types";

/**
 * SCHEMA
 *
 * `types/index.ts` states that the UI reads its shapes and nothing else, and
 * that the mock adapter in `data/` can be swapped for a real backend without a
 * component changing. This schema honours that: the nested value objects that
 * the UI already treats as arrays (specifications, colourways, variants) are
 * stored as JSON rather than normalised into join tables, so a row maps to a
 * `Product` with no assembly step and no partial-load states.
 *
 * Top-level entities that are queried, filtered or counted on their own —
 * orders, leads, discounts — get real tables and real indexes.
 */

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};

/** Draft rows are invisible to the storefront but editable in admin. */
export type PublishStatus = "draft" | "published";

/* ==========================================================================
   CATALOGUE
   ========================================================================== */

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    line: text("line").$type<ProductLine>().notNull(),
    silhouette: text("silhouette").$type<Silhouette>().notNull(),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    currency: text("currency").notNull().default("PKR"),
    category: text("category"),
    campaignName: text("campaign_name"),
    salePercent: integer("sale_percent"),
    summary: text("summary").notNull(),
    /** Paragraphs. */
    description: text("description", { mode: "json" }).$type<string[]>().notNull(),
    fit: text("fit").$type<FitProfile>().notNull(),
    specifications: text("specifications", { mode: "json" })
      .$type<Specification[]>()
      .notNull(),
    features: text("features", { mode: "json" }).$type<string[]>().notNull(),
    colorways: text("colorways", { mode: "json" }).$type<ProductColorway[]>().notNull(),
    variants: text("variants", { mode: "json" }).$type<ProductVariant[]>().notNull(),
    /** Collection slugs. */
    collections: text("collections", { mode: "json" }).$type<string[]>().notNull(),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    /** Optional override for the product photograph. */
    imagePath: text("image_path"),
    images: text("images", { mode: "json" }).$type<string[]>(),
    status: text("status").$type<PublishStatus>().notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("products_status_idx").on(t.status)],
);

export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  accentHex: text("accent_hex").notNull(),
  status: text("status").$type<PublishStatus>().notNull().default("published"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  /** ISO 8601 date string, kept as text so it round-trips unchanged. */
  date: text("date").notNull(),
  category: text("category").notNull(),
  standfirst: text("standfirst").notNull(),
  readingMinutes: integer("reading_minutes").notNull(),
  body: text("body", { mode: "json" }).$type<string[]>().notNull(),
  status: text("status").$type<PublishStatus>().notNull().default("published"),
  ...timestamps,
});

/* ==========================================================================
   OFFERS
   ========================================================================== */

export type DiscountType = "percentage" | "fixed";

export const discounts = sqliteTable(
  "discounts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** Stored uppercase; matching is case-insensitive at the boundary. */
    code: text("code").notNull().unique(),
    description: text("description"),
    type: text("type").$type<DiscountType>().notNull(),
    /** Percent (1–100) or whole rupees, depending on `type`. */
    value: real("value").notNull(),
    /** Order subtotal required before the code applies. */
    minSubtotal: integer("min_subtotal").notNull().default(0),
    /** Null means unlimited. */
    maxRedemptions: integer("max_redemptions"),
    timesUsed: integer("times_used").notNull().default(0),
    startsAt: integer("starts_at", { mode: "timestamp" }),
    endsAt: integer("ends_at", { mode: "timestamp" }),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (t) => [index("discounts_code_idx").on(t.code)],
);

/* ==========================================================================
   ORDERS
   ========================================================================== */

export type OrderStatus = "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull().unique(),
    customerName: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    city: text("city").notNull(),
    sector: text("sector"),
    address: text("address").notNull(),
    paymentMethod: text("payment_method").notNull(),
    subtotal: integer("subtotal").notNull(),
    shipping: integer("shipping").notNull().default(0),
    discountCode: text("discount_code"),
    discountAmount: integer("discount_amount").notNull().default(0),
    total: integer("total").notNull(),
    /** Snapshot of what was bought, including price at time of sale. */
    lines: text("lines", { mode: "json" })
      .$type<(CartLine & { name: string; unitPrice: number })[]>()
      .notNull(),
    status: text("status").$type<OrderStatus>().notNull().default("pending"),
    trackingNumber: text("tracking_number"),
    courierName: text("courier_name").default("TCS Express"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [index("orders_status_idx").on(t.status)],
);

/* ==========================================================================
   DEMAND CAPTURE
   The teamwear endpoint and the newsletter endpoint both validate correctly
   and then stop at a marked delivery boundary. These two tables are that
   boundary's destination.
   ========================================================================== */

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull().unique(),
    sport: text("sport"),
    garment: text("garment"),
    quantity: integer("quantity"),
    name: text("name").notNull(),
    organisation: text("organisation"),
    whatsapp: text("whatsapp"),
    email: text("email"),
    notes: text("notes"),
    /** Which surface produced it — quote form, configurator, WhatsApp. */
    source: text("source").notNull().default("unknown"),
    status: text("status").$type<LeadStatus>().notNull().default("new"),
    ...timestamps,
  },
  (t) => [index("leads_status_idx").on(t.status)],
);

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("unknown"),
  unsubscribedAt: integer("unsubscribed_at", { mode: "timestamp" }),
  ...timestamps,
});

/* ==========================================================================
   SETTINGS
   Key/value so the brand's real contact details can replace the demo ones
   without a deploy. Read by the storefront through a cached accessor.
   ========================================================================== */

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).$type<unknown>().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/* ==========================================================================
   AUDIT
   Who changed what. An admin panel without this is a panel nobody can trust
   once more than one person has the password.
   ========================================================================== */

export const activityLog = sqliteTable("activity_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  detail: text("detail"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type ProductRow = typeof products.$inferSelect;
export type CollectionRow = typeof collections.$inferSelect;
export type StoryRow = typeof stories.$inferSelect;
export type DiscountRow = typeof discounts.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
export type SubscriberRow = typeof subscribers.$inferSelect;
