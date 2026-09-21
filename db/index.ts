import "server-only";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * DATABASE CLIENT
 *
 * One code path, two deployments. `@libsql/client` speaks to a local SQLite
 * file and to a hosted Turso database through the same interface, so the only
 * difference between a laptop and production is the connection string.
 *
 *   unset        -> file:.data/iwear.db   (local; the directory is gitignored)
 *   libsql://... -> Turso, with DATABASE_AUTH_TOKEN
 *
 * Connecting is deferred until the first query. A build machine legitimately
 * has no database, and throwing at import time would fail `next build` for
 * anyone who has not set Turso up yet — the wrong moment to complain. The
 * guard fires on first use instead.
 */

const FILE_FALLBACK = "file:.data/iwear.db";

let instance: LibSQLDatabase<typeof schema> | null = null;

function connect(): LibSQLDatabase<typeof schema> {
  if (instance) return instance;

  let url = process.env.DATABASE_URL ?? FILE_FALLBACK;

  // On Vercel without Turso DATABASE_URL, fall back to in-memory database to allow static prerender
  if (url.startsWith("file:") && process.env.VERCEL) {
    url = ":memory:";
  }

  instance = drizzle(createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN }), {
    schema,
  });
  return instance;
}

/**
 * Proxied so the connection opens on first property access. Callers use this
 * exactly as they would a normal Drizzle instance.
 */
export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, property, receiver) {
    return Reflect.get(connect(), property, receiver);
  },
});

export { schema };
