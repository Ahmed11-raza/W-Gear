import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Table, Badge, Empty, Card } from "@/components/admin/ui";
import { DiscountForm } from "@/components/admin/DiscountForm";
import { DiscountRowActions } from "@/components/admin/DiscountRowActions";

export const dynamic = "force-dynamic";

function windowLabel(row: { startsAt: Date | null; endsAt: Date | null }) {
  const f = (d: Date) => d.toLocaleDateString("en-GB");
  if (row.startsAt && row.endsAt) return `${f(row.startsAt)} – ${f(row.endsAt)}`;
  if (row.endsAt) return `until ${f(row.endsAt)}`;
  if (row.startsAt) return `from ${f(row.startsAt)}`;
  return "always";
}

/**
 * Read once per request rather than during render, so every row is judged
 * against the same instant and the render stays idempotent.
 */
async function requestTime(): Promise<number> {
  return Date.now();
}

export default async function DiscountsPage() {
  const rows = await db.select().from(schema.discounts).orderBy(desc(schema.discounts.createdAt));
  const now = await requestTime();

  return (
    <>
      <PageTitle title="Offers" />

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section>
          {rows.length === 0 ? (
            <Empty message="No discount codes yet. Create one on the right." />
          ) : (
            <Table head={["Code", "Discount", "Minimum", "Window", "Used", "Status", ""]}>
              {rows.map((d) => {
                const expired = d.endsAt ? d.endsAt.getTime() < now : false;
                const exhausted =
                  d.maxRedemptions !== null && d.timesUsed >= d.maxRedemptions;
                const live = d.active && !expired && !exhausted;

                return (
                  <tr key={d.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold">{d.code}</span>
                      {d.description ? (
                        <span className="block text-[0.75rem] text-white/45">{d.description}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {d.type === "percentage" ? `${d.value}%` : formatPrice(d.value)}
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {d.minSubtotal > 0 ? formatPrice(d.minSubtotal) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[0.8125rem] text-white/60">{windowLabel(d)}</td>
                    <td className="px-4 py-3 text-white/70">
                      {d.timesUsed}
                      {d.maxRedemptions !== null ? ` / ${d.maxRedemptions}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {live ? (
                        <Badge tone="good">live</Badge>
                      ) : expired ? (
                        <Badge tone="bad">expired</Badge>
                      ) : exhausted ? (
                        <Badge tone="bad">used up</Badge>
                      ) : (
                        <Badge tone="warn">off</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DiscountRowActions id={d.id} active={d.active} code={d.code} />
                    </td>
                  </tr>
                );
              })}
            </Table>
          )}
        </section>

        <aside>
          <Card>
            <h2 className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
              New code
            </h2>
            <DiscountForm />
          </Card>

          <p className="mt-4 text-[0.75rem] leading-[1.6] text-white/40">
            Codes are applied at checkout against the order subtotal, before delivery. A code that
            is switched off, past its end date, or at its redemption limit stops working
            immediately — no need to delete it.
          </p>
        </aside>
      </div>
    </>
  );
}
