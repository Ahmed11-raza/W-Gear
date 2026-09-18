import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SIZE_ORDER } from "@/data/products";

export const metadata: Metadata = {
  title: "Size guide",
  description: "Body measurements and how the three fits differ.",
};

/** DEMO measurements, centimetres. Not verified against a real size set. */
const TOPS: Record<string, number[]> = {
  Chest: [88, 94, 100, 106, 114, 122],
  Waist: [74, 80, 86, 92, 100, 108],
  "Back length": [68, 70, 72, 74, 76, 78],
  "Sleeve (long)": [61, 62, 63, 64, 65, 66],
};

const BOTTOMS: Record<string, number[]> = {
  Waist: [74, 80, 86, 92, 100, 108],
  Hip: [88, 94, 100, 106, 114, 122],
  "Inseam (regular)": [76, 76, 76, 78, 78, 78],
};

const FITS = [
  {
    name: "Athletic",
    body: "Cut close through the chest and waist, with room engineered into the shoulder rather than the body. If you are between sizes or want a looser feel, size up.",
  },
  {
    name: "Regular",
    body: "True to the measurements below with a normal amount of ease. Take your usual size.",
  },
  {
    name: "Relaxed",
    body: "Deliberately roomy through the body, cut on a square block. Size down if you want it closer to the measurements.",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        kicker="Size guide"
        title="Measure once."
        lede="All measurements are body measurements in centimetres, not garment measurements. Measure yourself and match to the column — the ease is already built into the pattern."
      />

      <div className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <SizeTable caption="Tops" rows={TOPS} />
        <SizeTable caption="Bottoms" rows={BOTTOMS} className="mt-16" />

        <section aria-labelledby="fits-heading" className="mt-16">
          <h2 id="fits-heading" className="text-spec text-muted">
            The three fits
          </h2>
          <dl className="mt-8 grid gap-x-8 gap-y-8 border-t border-line pt-8 md:grid-cols-3">
            {FITS.map((fit) => (
              <div key={fit.name}>
                <dt className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em]">
                  {fit.name}
                </dt>
                <dd className="mt-3 max-w-[40ch] text-muted">{fit.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="how-heading" className="mt-16 max-w-[62ch]">
          <h2 id="how-heading" className="text-spec text-muted">
            How to measure
          </h2>
          <ul className="mt-8 flex flex-col gap-4 border-t border-line pt-8">
            <li className="text-ink-soft">
              <strong className="font-medium text-ink">Chest.</strong> Around the
              fullest part, under the arms, tape level and not pulled tight.
            </li>
            <li className="text-ink-soft">
              <strong className="font-medium text-ink">Waist.</strong> At the
              natural waist, which is above the hip bone and below the ribs.
            </li>
            <li className="text-ink-soft">
              <strong className="font-medium text-ink">Inseam.</strong> From the
              crotch seam of a pair that fits, down the inside leg to the hem.
            </li>
          </ul>
        </section>

        <p className="text-spec mt-16 max-w-[64ch] border-t border-line pt-6 text-muted">
          Demonstration data. This size set has not been graded against real
          patterns and should not be used to order anything.
        </p>
      </div>
    </>
  );
}

function SizeTable({
  caption,
  rows,
  className,
}: {
  caption: string;
  rows: Record<string, number[]>;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="text-spec pb-6 text-left text-muted">
            {caption} &mdash; body measurements, centimetres
          </caption>
          <thead>
            <tr className="border-y border-line-strong">
              <th scope="col" className="text-spec py-4 pr-4 font-normal text-muted">
                Measurement
              </th>
              {SIZE_ORDER.map((size) => (
                <th key={size} scope="col" className="text-spec py-4 pr-4 font-normal text-ink">
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(rows).map(([label, values]) => (
              <tr key={label} className="border-b border-line">
                <th scope="row" className="py-4 pr-4 text-left font-normal text-muted">
                  {label}
                </th>
                {values.map((value, i) => (
                  <td key={SIZE_ORDER[i]} className="py-4 pr-4 text-ink">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
