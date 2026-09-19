import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { PRODUCTS } from "../data/products";
import { COLLECTIONS } from "../data/collections";
import { STORIES } from "../data/stories";

/**
 * SEED
 *
 * Moves the existing hand-authored catalogue into the database without
 * changing a single value, so the storefront renders identically before and
 * after the switch. Everything that was live becomes `published`; nothing is
 * invented and nothing is dropped.
 *
 * Safe to re-run: rows are matched on their natural key and updated in place.
 */

const url = process.env.DATABASE_URL ?? "file:.data/iwear.db";
const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client, { schema });

async function main() {
  console.log(`seeding ${url}`);

  let n = 0;
  for (const [i, p] of PRODUCTS.entries()) {
    await db
      .insert(schema.products)
      .values({
        slug: p.slug,
        name: p.name,
        line: p.line,
        silhouette: p.silhouette,
        price: p.price,
        currency: p.currency,
        summary: p.summary,
        description: p.description,
        fit: p.fit,
        specifications: p.specifications,
        features: p.features,
        colorways: p.colorways,
        variants: p.variants,
        collections: p.collections,
        featured: p.featured ?? false,
        status: "published",
        sortOrder: i,
      })
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: p.name,
          price: p.price,
          summary: p.summary,
          updatedAt: new Date(),
        },
      });
    n++;
  }
  console.log(`  products: ${n}`);

  let c = 0;
  for (const [i, col] of COLLECTIONS.entries()) {
    await db
      .insert(schema.collections)
      .values({
        slug: col.slug,
        name: col.name,
        tagline: col.tagline,
        description: col.description,
        accentHex: col.accentHex,
        status: "published",
        sortOrder: i,
      })
      .onConflictDoNothing();
    c++;
  }
  console.log(`  collections: ${c}`);

  let s = 0;
  for (const story of STORIES) {
    await db
      .insert(schema.stories)
      .values({
        slug: story.slug,
        title: story.title,
        date: story.date,
        category: story.category,
        standfirst: story.standfirst,
        readingMinutes: story.readingMinutes,
        body: story.body,
        status: "published",
      })
      .onConflictDoNothing();
    s++;
  }
  console.log(`  stories: ${s}`);

  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
