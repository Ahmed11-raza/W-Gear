import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * Discount validation.
 *
 * The rules live here rather than in the browser, because a price the client
 * can compute is a price the client can forge. The checkout displays what this
 * returns and never calculates a discount of its own.
 */

export async function POST(request: Request) {
  let code: string;
  let subtotal: number;

  try {
    const body = (await request.json()) as { code?: string; subtotal?: number };
    code = String(body.code ?? "").trim().toUpperCase();
    subtotal = Number(body.subtotal ?? 0);
  } catch {
    return NextResponse.json({ message: "That request could not be read." }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ message: "Enter a code." }, { status: 422 });
  }

  const [row] = await db
    .select()
    .from(schema.discounts)
    .where(eq(schema.discounts.code, code))
    .limit(1);

  // One message for every failure mode. Telling someone a code exists but has
  // expired invites them to go hunting for one that has not.
  const reject = () =>
    NextResponse.json({ message: "That code is not valid." }, { status: 422 });

  if (!row || !row.active) return reject();

  const now = Date.now();
  if (row.startsAt && row.startsAt.getTime() > now) return reject();
  if (row.endsAt && row.endsAt.getTime() < now) return reject();
  if (row.maxRedemptions !== null && row.timesUsed >= row.maxRedemptions) return reject();

  if (subtotal < row.minSubtotal) {
    return NextResponse.json(
      { message: `This code applies on orders over Rs ${row.minSubtotal.toLocaleString("en-PK")}.` },
      { status: 422 },
    );
  }

  const amount =
    row.type === "percentage"
      ? Math.round((subtotal * row.value) / 100)
      : Math.min(Math.round(row.value), subtotal);

  return NextResponse.json({
    code: row.code,
    description: row.description,
    type: row.type,
    value: row.value,
    amount,
  });
}
