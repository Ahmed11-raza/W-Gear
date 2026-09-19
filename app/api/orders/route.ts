import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * Order recording.
 *
 * Totals are recomputed here from the database's own prices. The browser sends
 * what was chosen — slug, colourway, size, quantity — and never what it costs,
 * so a tampered client cannot talk the shop into a cheaper order.
 */

const SHIPPING_PKR = 250;

interface IncomingLine {
  productSlug?: string;
  colorwayId?: string;
  size?: string;
  quantity?: number;
}

export async function POST(request: Request) {
  let body: {
    lines?: IncomingLine[];
    discountCode?: string | null;
    customer?: Record<string, string>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "That request could not be read." }, { status: 400 });
  }

  const incoming = Array.isArray(body.lines) ? body.lines : [];
  if (incoming.length === 0) {
    return NextResponse.json({ message: "The bag is empty." }, { status: 422 });
  }

  const c = body.customer ?? {};
  const name = String(c.name ?? "").trim();
  const phone = String(c.phone ?? "").replace(/\s+/g, "");
  const city = String(c.city ?? "").trim();
  const address = String(c.address ?? "").trim();

  if (!name || phone.length < 10 || !city || !address) {
    return NextResponse.json({ message: "Delivery details are incomplete." }, { status: 422 });
  }

  // Resolve every line against the catalogue; prices come from the database.
  const catalogue = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.status, "published"));

  const lines = [];
  for (const line of incoming) {
    const product = catalogue.find((p) => p.slug === line.productSlug);
    const quantity = Math.max(1, Math.floor(Number(line.quantity ?? 1)));
    if (!product) {
      return NextResponse.json(
        { message: "One of those items is no longer available." },
        { status: 409 },
      );
    }
    lines.push({
      productSlug: product.slug,
      colorwayId: String(line.colorwayId ?? ""),
      size: String(line.size ?? "") as never,
      quantity,
      name: product.name,
      unitPrice: product.price,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  /* Re-validate the discount server-side rather than trusting the amount the
     checkout displayed. */
  let discountCode: string | null = null;
  let discountAmount = 0;

  if (body.discountCode) {
    const code = String(body.discountCode).trim().toUpperCase();
    const [row] = await db
      .select()
      .from(schema.discounts)
      .where(eq(schema.discounts.code, code))
      .limit(1);

    const now = Date.now();
    const usable =
      row &&
      row.active &&
      subtotal >= row.minSubtotal &&
      (!row.startsAt || row.startsAt.getTime() <= now) &&
      (!row.endsAt || row.endsAt.getTime() >= now) &&
      (row.maxRedemptions === null || row.timesUsed < row.maxRedemptions);

    if (usable) {
      discountCode = row.code;
      discountAmount =
        row.type === "percentage"
          ? Math.round((subtotal * row.value) / 100)
          : Math.min(Math.round(row.value), subtotal);

      await db
        .update(schema.discounts)
        .set({ timesUsed: sql`${schema.discounts.timesUsed} + 1` })
        .where(eq(schema.discounts.id, row.id));
    }
  }

  const shipping = SHIPPING_PKR;
  const total = Math.max(0, subtotal - discountAmount) + shipping;
  const reference = `IW-${Date.now().toString(36).toUpperCase()}`;

  await db.insert(schema.orders).values({
    reference,
    customerName: name,
    phone,
    email: String(c.email ?? "").trim() || null,
    city,
    sector: String(c.sectorOrArea ?? c.sector ?? "").trim() || null,
    address,
    paymentMethod: String(c.paymentMethod ?? "cod"),
    subtotal,
    shipping,
    discountCode,
    discountAmount,
    total,
    lines,
    status: "pending",
  });

  return NextResponse.json({ reference, subtotal, discountAmount, shipping, total });
}
