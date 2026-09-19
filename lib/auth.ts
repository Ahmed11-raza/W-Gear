import { SignJWT, jwtVerify } from "jose";

/**
 * ADMIN AUTHENTICATION
 *
 * A single-operator panel, so there is no user table — the credential lives in
 * the environment and the session is a signed JWT in an httpOnly cookie.
 *
 * Required environment:
 *   ADMIN_PASSWORD_HASH   scrypt hash, generate with `pnpm admin:hash`
 *   ADMIN_SESSION_SECRET  32+ random characters
 *
 * There is deliberately no default password and no fallback secret. If either
 * variable is missing the panel refuses every login rather than falling back
 * to something guessable — an admin panel that ships with a known credential
 * is worse than no admin panel, because it looks protected.
 *
 * Verification uses Web Crypto so the same code runs in middleware (edge) and
 * in route handlers (node).
 */

const COOKIE = "iwear_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

export const SESSION_COOKIE = COOKIE;

function secret(): Uint8Array | null {
  const raw = process.env.ADMIN_SESSION_SECRET;
  if (!raw || raw.length < 32) return null;
  return new TextEncoder().encode(raw);
}

/** True when the panel has been given the configuration it needs to be safe. */
export function authConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH) && secret() !== null;
}

/* ---------------------------------------------------------------- password */

/**
 * scrypt, via Web Crypto's PBKDF2 equivalent is not available, so this uses
 * node:crypto — it only ever runs in a route handler, never in middleware.
 */
export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const { scrypt, randomBytes } = await import("node:crypto");
  const salt = saltHex ? Buffer.from(saltHex, "hex") : randomBytes(16);

  const derived: Buffer = await new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });

  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

/** Constant-time comparison — a plain === leaks the password byte by byte. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;

  const { timingSafeEqual } = await import("node:crypto");
  const candidate = await hashPassword(password, saltHex);
  const a = Buffer.from(candidate.split(":")[1], "hex");
  const b = Buffer.from(keyHex, "hex");

  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/* ----------------------------------------------------------------- session */

export async function createSession(actor = "admin"): Promise<string | null> {
  const key = secret();
  if (!key) return null;

  return new SignJWT({ actor })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .setSubject("admin")
    .sign(key);
}

export async function readSession(token: string | undefined): Promise<{ actor: string } | null> {
  if (!token) return null;
  const key = secret();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, { subject: "admin" });
    return { actor: typeof payload.actor === "string" ? payload.actor : "admin" };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
