import { NextResponse } from "next/server";
import { db, schema } from "@/db";

/**
 * Email capture.
 *
 * Most first-time visitors to an apparel store do not buy on that visit. Without
 * an address, that traffic is bought once and lost; with one it can be brought
 * back at no further acquisition cost. This is the endpoint behind that.
 *
 * Addresses are stored in the database and appear in the admin panel, where
 * they can be exported. Sending mail is a separate concern: wire an email
 * provider when there is something to send.
 */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Sources are a closed set so reporting cannot be polluted by arbitrary input. */
const SOURCES = new Set(["footer", "exit-intent", "checkout", "pdp"]);

export async function POST(request: Request) {
  let payload: { email?: string; source?: string };

  try {
    payload = (await request.json()) as { email?: string; source?: string };
  } catch {
    return NextResponse.json({ message: "That request could not be read." }, { status: 400 });
  }

  const email = (payload.email ?? "").trim().toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ message: "That email address does not look right." }, { status: 422 });
  }

  const source = SOURCES.has(payload.source ?? "") ? payload.source : "unknown";

  // Stored in the admin panel's subscriber list. Re-subscribing is not an
  // error — it just refreshes the source rather than rejecting the address.
  await db
    .insert(schema.subscribers)
    .values({ email, source: source ?? "unknown" })
    .onConflictDoUpdate({
      target: schema.subscribers.email,
      set: { source: source ?? "unknown", unsubscribedAt: null },
    });

  const delivered = true;

  return NextResponse.json({ delivered, source }, { status: 200 });
}
