import { NextResponse } from "next/server";
import { verifyPassword, createSession, sessionCookieOptions, SESSION_COOKIE, authConfigured } from "@/lib/auth";

/**
 * Sign in.
 *
 * Failures are deliberately slow and vague: a fixed delay on every wrong
 * attempt blunts online guessing, and a single generic message avoids
 * confirming whether the panel is configured to an attacker probing it.
 */
const FAILURE_DELAY_MS = 600;

export async function POST(request: Request) {
  const fail = async () => {
    await new Promise((r) => setTimeout(r, FAILURE_DELAY_MS));
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  };

  if (!authConfigured()) return fail();

  let password: string;
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? "");
  } catch {
    return fail();
  }

  const ok = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!);
  if (!ok) return fail();

  const token = await createSession("admin");
  if (!token) return fail();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
