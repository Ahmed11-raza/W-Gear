import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Table, Empty } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { setOrderStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

export default async function OrdersPage() {
  const rows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));

  return (
    <>
      <PageTitle title="Orders" />

      {rows.length === 0 ? (
        <Empty message="No orders recorded yet. Orders placed at checkout appear here." />
      ) : (
        <Table head={["Reference", "Customer", "Items", "Payment", "Total", "Status", ""]}>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-white/5 align-top last:border-0">
              <td className="px-4 py-3">
                <Link href={`/admin/orders/${o.id}`} className="font-mono text-[0.8125rem] text-white hover:underline">
                  {o.reference}
                </Link>
                <span className="block text-[0.75rem] text-white/40">
                  {o.createdAt.toLocaleString("en-GB")}
                </span>
              </td>
              <td className="px-4 py-3">
                {o.customerName}
                <span className="block text-[0.75rem] text-white/45">{o.phone}</span>
                <span className="block text-[0.75rem] text-white/45">
                  {[o.sector, o.city].filter(Boolean).join(", ")}
                </span>
              </td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/70">
                {o.lines.map((l, i) => (
                  <span key={i} className="block">
                    {l.quantity}&times; {l.name} <span className="text-white/40">{l.size}</span>
                  </span>
                ))}
              </td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/70">
                {o.paymentMethod}
                {o.discountCode ? (
                  <span className="block text-[0.75rem] text-emerald-300">
                    {o.discountCode} &minus;{formatPrice(o.discountAmount)}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
              <td className="px-4 py-3">
                <StatusSelect
                  id={o.id}
                  value={o.status}
                  options={STATUSES}
                  action={setOrderStatus}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="text-[0.75rem] text-[#C4F319] hover:underline"
                >
                  View &rarr;
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
