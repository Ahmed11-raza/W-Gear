import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { getCollections, getProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Collections",
  description: "Four ways into the range, grouped by what the pieces are for.",
};

export default async function Page() {
  // Fetched once and filtered in memory — a query per collection inside the
  // map would be four round trips for data already in hand.
  const collections = await getCollections();
  const products = await getProducts();

  return (
    <>
      <PageHeader
        kicker="Collections"
        title="Four ways in."
        lede="The range is grouped by the problem each piece solves rather than by season, because a garment built for humid heat is still built for humid heat in November."
      />

      <div className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <Reveal stagger className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {collections.map((collection) => {
            const inCollection = products.filter((p) =>
              p.collections.includes(collection.slug),
            );
            const lead = inCollection[0];

            return (
              <article key={collection.slug} className="group relative flex flex-col">
                <Link
                  href={`/collections/${collection.slug}`}
                  className="relative overflow-hidden bg-surface after:absolute after:inset-0 after:content-['']"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1"
                    style={{ backgroundColor: collection.accentHex }}
                  />
                  {lead && (
                    <span className="absolute inset-0 flex items-center justify-center p-[10%] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
                      <GarmentRender
                        silhouette={lead.silhouette}
                        hex={lead.colorways[0].hex}
                        accentHex={lead.colorways[0].accentHex}
                        uid={`collection-${collection.slug}`}
                      />
                    </span>
                  )}
                </Link>

                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-title font-extrabold tracking-[-0.02em]">
                    {collection.name}
                  </h2>
                  <p className="text-spec shrink-0 text-muted">
                    {inCollection.length} {inCollection.length === 1 ? "piece" : "pieces"}
                  </p>
                </div>

                <p className="mt-3 max-w-[44ch] text-muted">{collection.tagline}</p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </>
  );
}
