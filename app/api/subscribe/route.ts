import { NextResponse } from "next/server";

/**
 * Email capture.
 *
 * Most first-time visitors to an apparel store do not buy on that visit. Without
 * an address, that traffic is bought once and lost; with one it can be brought
 * back at no further acquisition cost. This is the endpoint behind that.
 *
 * Like the teamwear handler, this validates properly and then stops at a marked
 * delivery boundary — nothing is stored or sent, and the response says so, so
 * the UI can tell the truth (brief 53).
 *
 * To make it live, set MAILING_LIST_ENDPOINT to a provider's ingest URL and
 * replace the marked block with the forwarding call.
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

  // ---- DELIVERY BOUNDARY ---------------------------------------------------
  // Nothing is stored. Replace with the real list provider, e.g.
  //   await fetch(process.env.MAILING_LIST_ENDPOINT!, { ... })
  // Until then this build must not claim the address was kept.
  // --------------------------------------------------------------------------
  const delivered = false;

  return NextResponse.json({ delivered, source }, { status: 200 });
}
