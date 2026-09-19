import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { PageTitle, btnGhost } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) notFound();

  const [product] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, numeric))
    .limit(1);

  if (!product) notFound();

  return (
    <>
      <PageTitle
        title={product.name}
        action={
          <Link href={`/shop/${product.slug}`} target="_blank" className={btnGhost}>
            View on site
          </Link>
        }
      />
      <ProductForm product={product} />
    </>
  );
}
