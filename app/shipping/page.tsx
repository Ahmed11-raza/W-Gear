import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Delivery windows, charges and how returns work.",
};

const SHIPPING = [
  { region: "Islamabad & Rawalpindi", window: "1 to 2 working days", cost: "PKR 250" },
  { region: "Lahore, Karachi, Peshawar", window: "2 to 4 working days", cost: "PKR 350" },
  { region: "Rest of Pakistan", window: "3 to 6 working days", cost: "PKR 450" },
  { region: "Orders above PKR 15,000", window: "As above", cost: "Free" },
];

const FAQ = [
  {
    q: "How long do I have to return something?",
    a: "Fourteen days from delivery, unworn and with tags attached. Start the return by email or WhatsApp and we send a collection slip.",
  },
  {
    q: "Who pays for the return?",
    a: "We do, if the item is faulty or we sent the wrong thing. For a change of mind, return postage comes off the refund.",
  },
  {
    q: "Can I exchange for a different size?",
    a: "Yes, subject to stock. Exchanges are treated as a return and a new order, which is usually faster than holding the stock.",
  },
  {
    q: "What about custom teamwear?",
    a: "Custom pieces are made to your specification and cannot be returned for a change of mind. That is why the process includes a proof step before anything is cut — faults against an approved proof are ours to fix.",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        kicker="Shipping & returns"
        title="Where it goes and what it costs."
        lede="Delivery is by courier across Pakistan. Charges and windows are listed here rather than revealed at the last step of checkout."
      />

      <div className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <section aria-labelledby="rates-heading">
          <h2 id="rates-heading" className="text-spec text-muted">
            Delivery
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <thead>
                <tr className="border-y border-line-strong">
                  <th scope="col" className="text-spec py-4 pr-4 font-normal text-muted">
                    Region
                  </th>
                  <th scope="col" className="text-spec py-4 pr-4 font-normal text-muted">
                    Window
                  </th>
                  <th scope="col" className="text-spec py-4 font-normal text-muted">
                    Charge
                  </th>
                </tr>
              </thead>
              <tbody>
                {SHIPPING.map((row) => (
                  <tr key={row.region} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 text-left font-normal text-ink">
                      {row.region}
                    </th>
                    <td className="py-4 pr-4 text-muted">{row.window}</td>
                    <td className="py-4 text-ink">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="returns" aria-labelledby="returns-heading" className="mt-16 max-w-[68ch]">
          <h2 id="returns-heading" className="text-spec text-muted">
            Returns &bull; Easy Cash Back Policy
          </h2>

          {/* Easy Cash Back Policy Ribbon Box */}
          <div className="mt-6 p-5 bg-accent-muted/40 border border-accent/40 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-text" />
              <h3 className="font-display font-extrabold text-[1.125rem] text-ink uppercase tracking-tight">
                Easy Cash Back Policy Guarantee
              </h3>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed">
              We stand behind every garment engineered in our Sialkot atelier. If any piece does not fit your exact requirements or athletic standards, return it within <strong>7 days of delivery</strong> for an instant, full refund directly to your bank account or Raast ID. No complicated forms, no hidden deductions.
            </p>
          </div>

          <dl className="mt-8 border-t border-line">
            {FAQ.map((item) => (
              <div key={item.q} className="border-b border-line py-6">
                <dt className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em]">
                  {item.q}
                </dt>
                <dd className="mt-3 max-w-[58ch] text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 text-muted">
            Anything not covered here, ask us at{" "}
            <a
              href={`mailto:${BRAND.contact.email}`}
              className="text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-ink"
            >
              {BRAND.contact.email}
            </a>
            .
          </p>

          <p className="text-spec mt-10 border-t border-line pt-6 text-muted">
            Demonstration data. These rates, windows and terms are sample values
            and are not a policy anyone is bound by.
          </p>
        </section>
      </div>
    </>
  );
}
