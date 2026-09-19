import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Table, Badge, Empty, btn } from "@/components/admin/ui";
import { ProductRowActions } from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const all = await db
    .select()
    .from(schema.products)
    .orderBy(asc(schema.products.sortOrder), asc(schema.products.id));

  const rows = status ? all.filter((p) => p.status === status) : all;

  return (
    <>
      <PageTitle
        title="Products"
        action={
          <Link href="/admin/products/new" className={btn}>
            New product
          </Link>
        }
      />

      <div className="mb-4 flex gap-2">
        {[
          { label: `All (${all.length})`, href: "/admin/products", on: !status },
          {
            label: `Published (${all.filter((p) => p.status === "published").length})`,
            href: "/admin/products?status=published",
            on: status === "published",
          },
          {
            label: `Drafts (${all.filter((p) => p.status === "draft").length})`,
            href: "/admin/products?status=draft",
            on: status === "draft",
          },
        ].map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={
              "inline-flex h-8 items-center rounded px-3 text-[0.75rem] transition-colors " +
              (f.on ? "bg-white/10 text-white" : "text-white/50 hover:text-white")
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <Empty message="Nothing here." />
      ) : (
        <Table head={["Product", "Line", "Price", "Stock", "Status", ""]}>
          {rows.map((p) => {
            const stock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            return (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                  <span className="block font-mono text-[0.75rem] text-white/40">{p.slug}</span>
                </td>
                <td className="px-4 py-3 text-white/70">{p.line}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={stock === 0 ? "text-red-400" : "text-white/70"}>{stock}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={p.status === "published" ? "good" : "warn"}>{p.status}</Badge>
                  {p.featured ? <span className="ml-2 text-[0.6875rem] text-white/40">featured</span> : null}
                </td>
                <td className="px-4 py-3 text-right">
                  <ProductRowActions id={p.id} status={p.status} slug={p.slug} />
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
