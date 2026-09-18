import Link from "next/link";
import type { Product } from "@/types";
import { GarmentRender } from "@/components/ui/GarmentRender";
import { Reveal } from "@/components/motion/Reveal";
import { formatPrice } from "@/lib/brand";

/**
 * Featured collection (brief 11 §4, brief 12).
 *
 * Deliberately not the shop grid. Three pieces at three different scales in an
 * asymmetric composition — the lead piece takes the tall column and the other
 * two stack beside it, so the section reads as an edit someone made rather than
 * as the first row of a catalogue (brief 31: vary image sizes, avoid card-grid
 * monotony).
 *
 * Server-rendered. Nothing here needs state, so nothing here ships JavaScript
 * (brief 38).
 */
export function FeaturedCollection({ products }: { products: Product[] }) {
  const [lead, ...rest] = products.slice(0, 3);
  if (!lead) return null;

  return (
    <section aria-labelledby="featured-heading" className="gutter py-[var(--spacing-section)]">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-spec text-muted">Selected</p>
            <h2
              id="featured-heading"
              className="mt-5 max-w-[16ch] font-display"
              style={{
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
                letterSpacing: "var(--text-display--letter-spacing)",
              }}
            >
              Where to start.
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-[0.9375rem] text-ink underline decoration-line-strong underline-offset-[6px] transition-colors duration-[180ms] hover:decoration-ink"
          >
            All sportswear
          </Link>
        </div>

        <div aria-hidden className="mt-10 h-px w-full bg-line" />

        <Reveal className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-[1.25fr_1fr]">
          <FeaturedPiece product={lead} scale="lead" />

          <div className="flex flex-col gap-12">
            {rest.map((product) => (
              <FeaturedPiece key={product.slug} product={product} scale="support" />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedPiece({
  product,
  scale,
}: {
  product: Product;
  scale: "lead" | "support";
}) {
  const colorway = product.colorways[0];
  const isLead = scale === "lead";

  return (
    <article className="group relative flex flex-col">
      <div
        className="relative overflow-hidden bg-surface"
        style={{ aspectRatio: isLead ? "4 / 5" : "3 / 2" }}
      >
        <div
          className={
            "absolute inset-0 flex items-center justify-center transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] " +
            (isLead ? "p-[10%]" : "p-[5%]")
          }
        >
          <GarmentRender
            silhouette={product.silhouette}
            hex={colorway.hex}
            accentHex={colorway.accentHex}
            uid={`featured-${product.slug}`}
          />
        </div>

        <p className="text-spec absolute top-5 left-5 text-muted">{product.line}</p>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-6">
        <h3
          className={
            "font-display font-extrabold tracking-[-0.02em] " +
            (isLead ? "text-title" : "text-[1.25rem]")
          }
        >
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors duration-[180ms] group-hover:text-accent-text after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-spec shrink-0 text-ink">{formatPrice(product.price)}</p>
      </div>

      <p className="mt-3 max-w-[44ch] text-muted">{product.summary}</p>
    </article>
  );
}
