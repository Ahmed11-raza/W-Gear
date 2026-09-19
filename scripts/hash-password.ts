/**
 * Generates the two values the admin panel needs in .env.local.
 *
 *   pnpm admin:hash "your-password-here"
 *
 * The password itself is never stored — only the scrypt hash, which cannot be
 * reversed. Run this again to rotate.
 */
import { randomBytes, scrypt } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 10) {
  console.error("Usage: pnpm admin:hash \"a-password-of-at-least-10-characters\"");
  process.exit(1);
}

const salt = randomBytes(16);

scrypt(password, salt, 64, (error, key) => {
  if (error) throw error;

  console.log("\nAdd these to .env.local:\n");
  console.log(`ADMIN_PASSWORD_HASH="${salt.toString("hex")}:${key.toString("hex")}"`);
  console.log(`ADMIN_SESSION_SECRET="${randomBytes(32).toString("hex")}"`);
  console.log("");
});
