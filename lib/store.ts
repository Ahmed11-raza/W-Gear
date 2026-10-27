import "server-only";
import { unstable_cache, updateTag } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { PRODUCTS } from "@/data/products";
import { COLLECTIONS } from "@/data/collections";
import { STORIES } from "@/data/stories";
import type { Product, Collection, Story } from "@/types";
import type { ProductRow, CollectionRow, StoryRow } from "@/db/schema";

/**
 * STOREFRONT READ LAYER
 *
 * The replacement for the static adapters in `data/`, returning the exact same
 * domain shapes so no component changes. Every read is wrapped in a tagged
 * cache, which is what makes publishing instant: the admin panel calls
 * `revalidateStorefront()` and the next request rebuilds from the database,
 * with no redeploy and no rebuild.
 *
 * Drafts never leave this file. Only `published` rows are returned.
 */

export const TAGS = {
  products: "products",
  collections: "collections",
  stories: "stories",
  settings: "settings",
} as const;

/* ------------------------------------------------------------------ mapping */

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    line: row.line,
    silhouette: row.silhouette,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    currency: row.currency as Product["currency"],
    category: row.category ?? undefined,
    campaignName: row.campaignName ?? undefined,
    salePercent: row.salePercent ?? undefined,
    imagePath: row.imagePath ?? undefined,
    images: row.images ?? undefined,
    summary: row.summary,
    description: row.description,
    fit: row.fit,
    specifications: row.specifications,
    features: row.features,
    colorways: row.colorways,
    variants: row.variants,
    collections: row.collections,
    featured: row.featured,
  };
}

const toCollection = (row: CollectionRow): Collection => ({
  slug: row.slug,
  name: row.name,
  tagline: row.tagline,
  description: row.description,
  accentHex: row.accentHex,
});

const toStory = (row: StoryRow): Story => ({
  slug: row.slug,
  title: row.title,
  date: row.date,
  category: row.category,
  standfirst: row.standfirst,
  readingMinutes: row.readingMinutes,
  body: row.body,
});

/* ----------------------------------------------------------------- products */

export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const rows = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.status, "published"))
        .orderBy(asc(schema.products.sortOrder), asc(schema.products.id));
      if (rows && rows.length > 0) return rows.map(toProduct);
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  },
  ["products:published"],
  { tags: [TAGS.products] },
);

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function productsInCollection(slug: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.collections.includes(slug));
}

export async function featuredProducts(): Promise<Product[]> {
  const all = await getProducts();
  const picked = all.filter((p) => p.featured);
  return picked.length > 0 ? picked : all.slice(0, 3);
}

export async function relatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.slug !== product.slug && p.line === product.line).slice(0, limit);
}

/* -------------------------------------------------------------- collections */

export const getCollections = unstable_cache(
  async (): Promise<Collection[]> => {
    try {
      const rows = await db
        .select()
        .from(schema.collections)
        .where(eq(schema.collections.status, "published"))
        .orderBy(asc(schema.collections.sortOrder), asc(schema.collections.id));
      if (rows && rows.length > 0) return rows.map(toCollection);
      return COLLECTIONS;
    } catch {
      return COLLECTIONS;
    }
  },
  ["collections:published"],
  { tags: [TAGS.collections] },
);

export async function getCollection(slug: string): Promise<Collection | undefined> {
  const all = await getCollections();
  return all.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ stories */

export const getStories = unstable_cache(
  async (): Promise<Story[]> => {
    try {
      const rows = await db
        .select()
        .from(schema.stories)
        .where(eq(schema.stories.status, "published"));
      if (rows && rows.length > 0) {
        return rows
          .map(toStory)
          .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
      }
      return STORIES;
    } catch {
      return STORIES;
    }
  },
  ["stories:published"],
  { tags: [TAGS.stories] },
);

export async function getStory(slug: string): Promise<Story | undefined> {
  const all = await getStories();
  return all.find((s) => s.slug === slug);
}

/* ----------------------------------------------------------------- settings */

export const getSettings = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const rows = await db.select().from(schema.settings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
  ["settings:all"],
  { tags: [TAGS.settings] },
);

/* --------------------------------------------------------------- publishing */

/**
 * Called by the admin panel after a write.
 *
 * Uses `updateTag` rather than `revalidateTag` because this always runs inside
 * a server action, and it gives read-your-own-writes: the editor sees the
 * change on the very next render instead of one request later.
 */
export function revalidateStorefront() {
  for (const tag of Object.values(TAGS)) updateTag(tag);
}
