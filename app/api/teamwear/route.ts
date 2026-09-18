import { NextResponse } from "next/server";

/**
 * Teamwear request endpoint.
 *
 * This is a real handler: it validates the payload server-side and rejects bad
 * input with a usable message. What it does NOT do is deliver the request
 * anywhere — there is no inbox, CRM or order system connected in this build.
 * The success response says so, and so does the UI (brief 53: never pretend
 * prototype behaviour is real).
 *
 * To make it live, replace the marked block with a real delivery call.
 */

interface Payload {
  sport?: string | null;
  garment?: string | null;
  quantity?: number;
  contact?: { name?: string; whatsapp?: string; email?: string };
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

  // ---- DELIVERY BOUNDARY -------------------------------------------------
  // Nothing is sent. Replace this with the real integration (email, CRM,
  // WhatsApp Business API) and update the prototype notice in ReviewStep.
  // ------------------------------------------------------------------------

  const reference = `TW-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({ reference, delivered: false }, { status: 200 });
}
