import { db, schema } from "@/db";
import { BRAND } from "@/lib/brand";
import { PageTitle, Card } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

/**
 * The values the audit flagged as demo placeholders live here, so they can be
 * replaced without a code change or a deploy.
 */
export default async function SettingsPage() {
  const rows = await db.select().from(schema.settings);
  const saved = Object.fromEntries(rows.map((r) => [r.key, String(r.value ?? "")]));

  const current = {
    whatsapp: saved.whatsapp ?? BRAND.contact.whatsapp,
    email: saved.email ?? BRAND.contact.email,
    city: saved.city ?? BRAND.contact.city,
    manufacturingHub: saved.manufacturingHub ?? BRAND.contact.manufacturingHub,
    hours: saved.hours ?? BRAND.contact.hours,
    teamwearLeadTime: saved.teamwearLeadTime ?? "",
  };

  const stillDemo = current.whatsapp === BRAND.contact.whatsapp;

  return (
    <>
      <PageTitle title="Settings" />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <Card>
          <SettingsForm current={current} />
        </Card>

        <aside className="space-y-4">
          {stillDemo && (
            <div className="rounded border border-amber-500/40 bg-amber-500/10 p-4 text-[0.8125rem] leading-[1.6] text-amber-200">
              <p className="font-semibold">The WhatsApp number is still the demo value.</p>
              <p className="mt-2 text-amber-200/80">
                It is a plausible Pakistani mobile format, so every &ldquo;Ask on WhatsApp&rdquo;
                button on the live site currently opens a chat with whoever really owns it. Replace
                it before showing this to anyone outside the team.
              </p>
            </div>
          )}

          <p className="text-[0.75rem] leading-[1.6] text-white/40">
            Teamwear lead time is the answer to the question every team buyer asks and the site
            cannot currently answer. Leaving it blank hides the line rather than guessing at it.
          </p>
        </aside>
      </div>
    </>
  );
}
