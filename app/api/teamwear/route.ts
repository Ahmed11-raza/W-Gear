import { NextResponse } from "next/server";
import { db, schema } from "@/db";

/**
 * Teamwear request endpoint.
 *
 * Validates the payload server-side, then records it as a lead. The admin
 * panel is the inbox: every request shows up under Leads with its contact
 * details and a status you can move through as you work it.
 */

interface Payload {
  sport?: string | null;
  garment?: string | null;
  quantity?: number;
  contact?: { name?: string; whatsapp?: string; email?: string };
  notes?: string;
  source?: string;
}

export async function POST(request: Request) {
  let payload: Payload;

  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ message: "That request could not be read." }, { status: 400 });
  }

  if (!payload.sport || !payload.garment) {
    return NextResponse.json(
      { message: "Sport and garment are both required." },
      { status: 422 },
    );
  }

  if (!Number.isInteger(payload.quantity) || (payload.quantity ?? 0) < 1) {
    return NextResponse.json({ message: "Quantity must be a whole number." }, { status: 422 });
  }

  const name = payload.contact?.name?.trim();
  const whatsapp = (payload.contact?.whatsapp ?? "").replace(/\D/g, "");
  const email = (payload.contact?.email ?? "").trim();
  const reachable = whatsapp.length >= 10 || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (!name || !reachable) {
    return NextResponse.json(
      { message: "We need a name and a way to reach you." },
      { status: 422 },
    );
  }

  const reference = `TW-${Date.now().toString(36).toUpperCase()}`;

  await db.insert(schema.leads).values({
    reference,
    sport: payload.sport ?? null,
    garment: payload.garment ?? null,
    quantity: payload.quantity ?? null,
    name: name!,
    organisation: null,
    whatsapp: whatsapp || null,
    email: email || null,
    notes: typeof payload.notes === "string" ? payload.notes : null,
    source: typeof payload.source === "string" ? payload.source : "teamwear",
  });

  return NextResponse.json({ reference, delivered: true }, { status: 200 });
}
