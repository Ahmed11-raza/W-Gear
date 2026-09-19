import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { PageTitle, Table, Empty } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { setLeadStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

/**
 * Where teamwear demand lands.
 *
 * Both the quote form and the configurator previously validated a request and
 * then discarded it at a marked delivery boundary. This is that boundary's
 * destination — the reason those forms are now worth filling in.
 */
export default async function LeadsPage() {
  const rows = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));

  return (
    <>
      <PageTitle title="Teamwear leads" />

      {rows.length === 0 ? (
        <Empty message="No leads yet. Quote requests and configurator submissions land here." />
      ) : (
        <Table head={["Reference", "Who", "Wants", "Contact", "Source", "Status"]}>
          {rows.map((l) => (
            <tr key={l.id} className="border-b border-white/5 align-top last:border-0">
              <td className="px-4 py-3">
                <span className="font-mono text-[0.8125rem]">{l.reference}</span>
                <span className="block text-[0.75rem] text-white/40">
                  {l.createdAt.toLocaleString("en-GB")}
                </span>
              </td>
              <td className="px-4 py-3">
                {l.name}
                {l.organisation ? (
                  <span className="block text-[0.75rem] text-white/45">{l.organisation}</span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/70">
                {l.quantity ?? "?"} &times; {l.garment ?? "—"}
                <span className="block text-white/45">{l.sport ?? ""}</span>
                {l.notes ? (
                  <span className="mt-1 block text-[0.75rem] text-white/40">{l.notes}</span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[0.8125rem]">
                {l.whatsapp ? (
                  <a
                    href={`https://wa.me/${l.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 hover:underline"
                  >
                    {l.whatsapp}
                  </a>
                ) : null}
                {l.email ? (
                  <a href={`mailto:${l.email}`} className="block text-white/60 hover:underline">
                    {l.email}
                  </a>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[0.75rem] text-white/45">{l.source}</td>
              <td className="px-4 py-3">
                <StatusSelect id={l.id} value={l.status} options={STATUSES} action={setLeadStatus} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
