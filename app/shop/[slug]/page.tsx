import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { PRODUCTS, getProduct, relatedProducts } from "@/data/products";
import { getCollection } from "@/data/collections";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    openGraph: { title: product.name, description: product.summary },
  };
}

const FIT_NOTE: Record<string, string> = {
  regular: "True to size with room to move. Take your usual size.",
  athletic: "Cut close through the chest and waist. Size up for a looser fit.",
  relaxed: "Deliberately roomy. Size down if you want it closer.",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product);

  return (
    <article className="pt-[clamp(6rem,12vw,9rem)]">
      <nav aria-label="Breadcrumb" className="gutter pb-8">
        <ol className="text-spec flex flex-wrap items-center gap-2 text-muted">
          <li>
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="gutter">
        <ProductPurchase product={product} />
      </div>

      <div className="gutter mt-[clamp(4rem,9vw,7rem)]">
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2 className="text-spec text-muted">The piece</h2>
            <div className="mt-6 flex flex-col gap-5">
              {product.description.map((paragraph) => (
                <p key={paragraph} className="max-w-[58ch] text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="text-spec mt-12 text-muted">Detail</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-4 text-ink-soft">
                  <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-line-strong" />
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="text-spec text-muted">Specification</h2>
            {/* brief 53: prototype data is never presented as measured fact. */}
            <p className="mt-3 max-w-[40ch] text-[0.8125rem] leading-[1.5] text-muted">
              Placeholder values. Not yet measured against a production sample.
            </p>
            <dl className="mt-6 border-t border-line">
              {product.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                >
                  <dt className="text-spec text-muted">{spec.label}</dt>
                  <dd className="text-right text-[0.9375rem] text-ink">{spec.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                <dt className="text-spec text-muted">Fit</dt>
                <dd className="max-w-[28ch] text-right text-[0.9375rem] text-ink">
                  {FIT_NOTE[product.fit]}
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-2">
              {product.collections.map((c) => {
                const collection = getCollection(c);
                if (!collection) return null;
                return (
                  <Link
                    key={c}
                    href={`/collections/${c}`}
                    className="text-spec border border-line-strong px-3 py-2 text-ink transition-colors duration-[180ms] hover:border-ink"
                  >
                    {collection.name}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="gutter mt-[clamp(5rem,11vw,9rem)] border-t border-line pt-[clamp(3rem,6vw,5rem)] pb-[clamp(4rem,9vw,8rem)]"
        >
          <h2 id="related-heading" className="text-spec text-muted">
            Goes with
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-3 lg:gap-x-8">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
