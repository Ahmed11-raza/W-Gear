import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Stat, Card, Table, Badge, Empty } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [[products], [drafts], [orders], [leads], [subs], [revenue]] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(schema.products),
    db
      .select({ n: sql<number>`count(*)` })
      .from(schema.products)
      .where(eq(schema.products.status, "draft")),
    db.select({ n: sql<number>`count(*)` }).from(schema.orders),
    db
      .select({ n: sql<number>`count(*)` })
      .from(schema.leads)
      .where(eq(schema.leads.status, "new")),
    db.select({ n: sql<number>`count(*)` }).from(schema.subscribers),
    db.select({ total: sql<number>`coalesce(sum(total), 0)` }).from(schema.orders),
  ]);

  const recentOrders = await db
    .select()
    .from(schema.orders)
    .orderBy(desc(schema.orders.createdAt))
    .limit(5);

  const recentLeads = await db
    .select()
    .from(schema.leads)
    .orderBy(desc(schema.leads.createdAt))
    .limit(5);

  const activity = await db
    .select()
    .from(schema.activityLog)
    .orderBy(desc(schema.activityLog.createdAt))
    .limit(8);

  return (
    <>
      <PageTitle title="Overview" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Products" value={products.n} href="/admin/products" />
        <Stat label="Drafts" value={drafts.n} href="/admin/products?status=draft" />
        <Stat label="Orders" value={orders.n} href="/admin/orders" />
        <Stat label="New leads" value={leads.n} href="/admin/leads" />
        <Stat label="Subscribers" value={subs.n} href="/admin/subscribers" />
      </div>

      <div className="mt-3">
        <Stat label="Order value recorded" value={formatPrice(revenue.total ?? 0)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
            Recent orders
          </h2>
          {recentOrders.length === 0 ? (
            <Empty message="No orders yet." />
          ) : (
            <Table head={["Reference", "Customer", "Total", "Status"]}>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-[0.8125rem]">{o.reference}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={o.status === "cancelled" ? "bad" : o.status === "pending" ? "warn" : "good"}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
            Recent teamwear leads
          </h2>
          {recentLeads.length === 0 ? (
            <Empty message="No leads yet." />
          ) : (
            <Table head={["Reference", "Who", "Qty", "Status"]}>
              {recentLeads.map((l) => (
                <tr key={l.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-[0.8125rem]">{l.reference}</td>
                  <td className="px-4 py-3">
                    {l.name}
                    {l.organisation ? (
                      <span className="block text-[0.75rem] text-white/45">{l.organisation}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{l.quantity ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={l.status === "new" ? "warn" : l.status === "won" ? "good" : "neutral"}>
                      {l.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
          Activity
        </h2>
        <Card>
          {activity.length === 0 ? (
            <p className="text-[0.875rem] text-white/45">Nothing recorded yet.</p>
          ) : (
            <ul className="space-y-2 text-[0.8125rem]">
              {activity.map((a) => (
                <li key={a.id} className="flex items-baseline justify-between gap-4">
                  <span>
                    <span className="text-white/45">{a.actor}</span> {a.action}{" "}
                    <span className="text-white/70">{a.entity}</span>
                    {a.detail ? <span className="text-white/45"> · {a.detail}</span> : null}
                  </span>
                  <time className="shrink-0 font-mono text-[0.75rem] text-white/35">
                    {a.createdAt.toLocaleString("en-GB")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <p className="mt-8 text-[0.8125rem] text-white/40">
        Saving writes to the database immediately.{" "}
        <Link href="/" target="_blank" className="underline hover:text-white">
          The storefront
        </Link>{" "}
        reads through a cache, so use <strong className="text-white/70">Publish changes</strong> to
        make edits visible to visitors.
      </p>
    </>
  );
}
