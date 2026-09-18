import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { COLLECTIONS, getCollection } from "@/data/collections";
import { productsInCollection } from "@/data/products";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};

  return {
    title: collection.name,
    description: collection.tagline,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = productsInCollection(collection.slug);

  return (
    <>
      <PageHeader
        kicker={`Collection — ${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
        title={collection.tagline}
        lede={collection.description}
      />
      <ProductGrid products={products} />
    </>
  );
}
