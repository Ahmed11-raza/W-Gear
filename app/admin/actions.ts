"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { revalidateStorefront } from "@/lib/store";
import { readSession, SESSION_COOKIE } from "@/lib/auth";
import type { ProductColorway, ProductVariant, Specification, SizeCode } from "@/types";

/**
 * ADMIN MUTATIONS
 *
 * Middleware already blocks unauthenticated requests to /admin, but server
 * actions are POST endpoints with their own URLs — they are reachable
 * independently of the page that renders the form. Every one of them
 * re-checks the session rather than trusting that the caller came through the
 * UI, and every one records who did what.
 */

async function requireActor(): Promise<string> {
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) throw new Error("Not authenticated.");
  return session.actor;
}

async function log(actor: string, action: string, entity: string, entityId?: string, detail?: string) {
  await db.insert(schema.activityLog).values({ actor, action, entity, entityId, detail });
}

/* --------------------------------------------------------------- publishing */

export async function publishChanges() {
  const actor = await requireActor();
  revalidateStorefront();
  await log(actor, "publish", "storefront");
  return { ok: true };
}

/* ----------------------------------------------------------------- products */

const SIZES: SizeCode[] = ["XS", "S", "M", "L", "XL", "XXL"];

/** Parses the product form. Throws with a readable message on bad input. */
function parseProduct(form: FormData) {
  const slug = String(form.get("slug") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const price = Number(form.get("price"));

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug may only contain lowercase letters, numbers and hyphens.");
  }
  if (!name) throw new Error("Name is required.");
  if (!Number.isFinite(price) || price < 0) throw new Error("Price must be a positive number.");

  const lines = (key: string): string[] =>
    String(form.get(key) ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  // "Weight | 145 GSM" per line — a table would be nicer but this keeps the
  // form editable without a nested field array.
  const specifications: Specification[] = lines("specifications").map((row) => {
    const [label, ...rest] = row.split("|");
    return { label: label.trim(), value: rest.join("|").trim() };
  });

  // "obsidian | Obsidian | #1c1917 | #b85d3b"
  const colorways: ProductColorway[] = lines("colorways").map((row) => {
    const [id, cwName, hex, accentHex] = row.split("|").map((s) => s.trim());
    return { id, name: cwName, hex, accentHex: accentHex || "#1c1917" };
  });

  const variants: ProductVariant[] = SIZES.map((size) => ({
    size,
    stock: Number(form.get(`stock_${size}`) ?? 0) || 0,
  }));

  return {
    slug,
    name,
    line: String(form.get("line") ?? "everyday") as never,
    silhouette: String(form.get("silhouette") ?? "tee") as never,
    price: Math.round(price),
    currency: "PKR",
    summary: String(form.get("summary") ?? "").trim(),
    description: lines("description"),
    fit: String(form.get("fit") ?? "regular") as never,
    specifications,
    features: lines("features"),
    colorways,
    variants,
    collections: lines("collections"),
    featured: form.get("featured") === "on",
    status: (form.get("status") === "published" ? "published" : "draft") as
      | "published"
      | "draft",
  };
}

export async function saveProduct(id: number | null, form: FormData) {
  const actor = await requireActor();
  const values = parseProduct(form);

  if (id) {
    await db
      .update(schema.products)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(schema.products.id, id));
    await log(actor, "update", "product", String(id), values.slug);
  } else {
    const [row] = await db.insert(schema.products).values(values).returning();
    await log(actor, "create", "product", String(row.id), values.slug);
  }

  revalidateStorefront();
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function setProductStatus(id: number, status: "draft" | "published") {
  const actor = await requireActor();
  await db
    .update(schema.products)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.products.id, id));
  await log(actor, status === "published" ? "publish" : "unpublish", "product", String(id));
  revalidateStorefront();
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: number) {
  const actor = await requireActor();
  await db.delete(schema.products).where(eq(schema.products.id, id));
  await log(actor, "delete", "product", String(id));
  revalidateStorefront();
  revalidatePath("/admin/products");
}

/* ---------------------------------------------------------------- discounts */

export async function saveDiscount(id: number | null, form: FormData) {
  const actor = await requireActor();

  const code = String(form.get("code") ?? "").trim().toUpperCase();
  const type = String(form.get("type") ?? "percentage") as "percentage" | "fixed";
  const value = Number(form.get("value"));

  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
    throw new Error("Code must be 3–32 characters: letters, numbers, hyphen or underscore.");
  }
  if (!Number.isFinite(value) || value <= 0) throw new Error("Value must be greater than zero.");
  if (type === "percentage" && value > 100) throw new Error("A percentage cannot exceed 100.");

  const dateOrNull = (key: string) => {
    const raw = String(form.get(key) ?? "").trim();
    return raw ? new Date(raw) : null;
  };
  const maxRaw = String(form.get("maxRedemptions") ?? "").trim();

  const values = {
    code,
    description: String(form.get("description") ?? "").trim() || null,
    type,
    value,
    minSubtotal: Number(form.get("minSubtotal") ?? 0) || 0,
    maxRedemptions: maxRaw ? Number(maxRaw) : null,
    startsAt: dateOrNull("startsAt"),
    endsAt: dateOrNull("endsAt"),
    active: form.get("active") === "on",
  };

  if (id) {
    await db
      .update(schema.discounts)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(schema.discounts.id, id));
    await log(actor, "update", "discount", String(id), code);
  } else {
    const [row] = await db.insert(schema.discounts).values(values).returning();
    await log(actor, "create", "discount", String(row.id), code);
  }

  revalidatePath("/admin/discounts");
  return { ok: true };
}

export async function toggleDiscount(id: number, active: boolean) {
  const actor = await requireActor();
  await db
    .update(schema.discounts)
    .set({ active, updatedAt: new Date() })
    .where(eq(schema.discounts.id, id));
  await log(actor, active ? "enable" : "disable", "discount", String(id));
  revalidatePath("/admin/discounts");
}

export async function deleteDiscount(id: number) {
  const actor = await requireActor();
  await db.delete(schema.discounts).where(eq(schema.discounts.id, id));
  await log(actor, "delete", "discount", String(id));
  revalidatePath("/admin/discounts");
}

/* ------------------------------------------------------------ orders, leads */

export async function setOrderStatus(id: number, status: string) {
  const actor = await requireActor();
  await db
    .update(schema.orders)
    .set({ status: status as never, updatedAt: new Date() })
    .where(eq(schema.orders.id, id));
  await log(actor, "status", "order", String(id), status);
  revalidatePath("/admin/orders");
}

export async function setLeadStatus(id: number, status: string) {
  const actor = await requireActor();
  await db
    .update(schema.leads)
    .set({ status: status as never, updatedAt: new Date() })
    .where(eq(schema.leads.id, id));
  await log(actor, "status", "lead", String(id), status);
  revalidatePath("/admin/leads");
}

/* -------------------------------------------------------------- promotions */

export async function updatePromotion(
  productId: number,
  compareAtPrice: number | null,
  campaignName: string | null,
) {
  const actor = await requireActor();
  const [product] = await db
    .select({ price: schema.products.price })
    .from(schema.products)
    .where(eq(schema.products.id, productId));

  const salePercent =
    compareAtPrice && compareAtPrice > 0 && product
      ? Math.round(((compareAtPrice - product.price) / compareAtPrice) * 100)
      : null;

  await db
    .update(schema.products)
    .set({ compareAtPrice, campaignName, salePercent, updatedAt: new Date() })
    .where(eq(schema.products.id, productId));

  await log(actor, "update-promotion", "product", String(productId), campaignName || "cleared");
  revalidateStorefront();
  revalidatePath("/admin/promotions");
  revalidatePath("/admin/products");
}

export async function clearPromotion(productId: number) {
  const actor = await requireActor();
  await db
    .update(schema.products)
    .set({
      compareAtPrice: null,
      campaignName: null,
      salePercent: null,
      updatedAt: new Date(),
    })
    .where(eq(schema.products.id, productId));

  await log(actor, "clear-promotion", "product", String(productId));
  revalidateStorefront();
  revalidatePath("/admin/promotions");
  revalidatePath("/admin/products");
}

/* ----------------------------------------------------------------- tracking */

export async function updateTracking(
  orderId: number,
  trackingNumber: string,
  courierName: string,
) {
  const actor = await requireActor();
  await db
    .update(schema.orders)
    .set({ trackingNumber, courierName, updatedAt: new Date() })
    .where(eq(schema.orders.id, orderId));

  await log(actor, "update-tracking", "order", String(orderId), `${courierName}: ${trackingNumber}`);
  revalidatePath("/admin/orders");
}

/* ----------------------------------------------------------------- settings */

export async function saveSettings(form: FormData) {
  const actor = await requireActor();

  const keys = ["whatsapp", "email", "city", "manufacturingHub", "hours", "teamwearLeadTime"];
  for (const key of keys) {
    const value = String(form.get(key) ?? "").trim();
    await db
      .insert(schema.settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: schema.settings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  await log(actor, "update", "settings");
  revalidateStorefront();
  revalidatePath("/admin/settings");
  return { ok: true };
}

/* ------------------------------------------------------------------ metrics */

export async function countRows() {
  await requireActor();
  const [p] = await db.select({ n: sql<number>`count(*)` }).from(schema.products);
  const [o] = await db.select({ n: sql<number>`count(*)` }).from(schema.orders);
  const [l] = await db.select({ n: sql<number>`count(*)` }).from(schema.leads);
  const [s] = await db.select({ n: sql<number>`count(*)` }).from(schema.subscribers);

  return { products: p.n, orders: o.n, leads: l.n, subscribers: s.n };
}
