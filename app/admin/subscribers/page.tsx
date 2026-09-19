import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { PageTitle, Table, Empty, btnGhost } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const rows = await db
    .select()
    .from(schema.subscribers)
    .orderBy(desc(schema.subscribers.createdAt));

  // At this size a data-URI export is enough, and it needs no third party.
  const csv =
    "email,source,joined\n" +
    rows.map((r) => `${r.email},${r.source},${r.createdAt.toISOString()}`).join("\n");
  const csvHref = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

  return (
    <>
      <PageTitle
        title={`Subscribers (${rows.length})`}
        action={
          rows.length > 0 ? (
            <a href={csvHref} download="iwear-subscribers.csv" className={btnGhost}>
              Export CSV
            </a>
          ) : undefined
        }
      />

      {rows.length === 0 ? (
        <Empty message="Nobody has signed up yet." />
      ) : (
        <Table head={["Email", "Source", "Joined"]}>
          {rows.map((s) => (
            <tr key={s.id} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3">{s.email}</td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/45">{s.source}</td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/60">
                {s.createdAt.toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
