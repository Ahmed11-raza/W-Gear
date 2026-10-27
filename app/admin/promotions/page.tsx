import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Card, Badge, Empty, btn, btnGhost } from "@/components/admin/ui";
import { PromotionActions } from "@/components/admin/PromotionActions";
import {
  Flame,
  Percent,
  Tag,
  ArrowRight,
  Package,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const allProducts = await db
    .select()
    .from(schema.products)
    .orderBy(asc(schema.products.sortOrder), asc(schema.products.id));

  const discounts = await db
    .select()
    .from(schema.discounts)
    .orderBy(desc(schema.discounts.createdAt));

  const onSale = allProducts.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.price,
  );
  const withCampaign = allProducts.filter((p) => Boolean(p.campaignName));
  const activeDiscountCodes = discounts.filter((d) => d.active);

  // Get unique categories from products
  const categories = [
    ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  ] as string[];

  return (
    <>
      <PageTitle
        title="Promotions & Sales"
        action={
          <Link href="/admin/discounts" className={btnGhost}>
            <Tag className="mr-1.5 h-3.5 w-3.5" />
            Manage Coupon Codes
          </Link>
        }
      />

      {/* Campaign Stats */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Card className="flex items-start gap-3">
          <div className="rounded bg-orange-500/10 p-2">
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              Products On Sale
            </p>
            <p className="mt-1 text-2xl font-black text-white">{onSale.length}</p>
            <p className="text-[0.6875rem] text-white/50">
              of {allProducts.length} total
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <div className="rounded bg-[#C4F319]/10 p-2">
            <Sparkles className="h-4 w-4 text-[#C4F319]" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              Active Campaigns
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {[...new Set(withCampaign.map((p) => p.campaignName))].length}
            </p>
            <p className="text-[0.6875rem] text-white/50">
              {withCampaign.length} items tagged
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <div className="rounded bg-emerald-500/10 p-2">
            <Percent className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              Active Coupon Codes
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {activeDiscountCodes.length}
            </p>
            <Link
              href="/admin/discounts"
              className="mt-1 flex items-center gap-1 text-[0.6875rem] text-[#C4F319] hover:underline"
            >
              Manage codes <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Product-Level Sale Controls */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Product Sale Controls
          </h2>
          <p className="text-[0.6875rem] text-white/40">
            Set compare-at prices, campaign names, and sale percentages per
            product
          </p>
        </div>

        {allProducts.length === 0 ? (
          <Empty message="No products in catalogue. Add products first." />
        ) : (
          <div className="overflow-x-auto rounded border border-white/10">
            <table className="w-full min-w-[60rem] border-collapse text-left text-[0.875rem]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    Product
                  </th>
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    Category
                  </th>
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    Current Price
                  </th>
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    Compare-At
                  </th>
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    Savings
                  </th>
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    Campaign Name
                  </th>
                  <th className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => {
                  const isOnSale =
                    p.compareAtPrice && p.compareAtPrice > p.price;
                  const savings = isOnSale
                    ? p.compareAtPrice! - p.price
                    : 0;
                  const pctOff = isOnSale
                    ? Math.round((savings / p.compareAtPrice!) * 100)
                    : 0;

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="font-medium text-white hover:underline"
                        >
                          {p.name}
                        </Link>
                        <span className="block font-mono text-[0.75rem] text-white/40">
                          {p.slug}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 capitalize">
                        {p.category || p.line}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-white">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3">
                        {isOnSale ? (
                          <span className="font-mono text-white/50 line-through">
                            {formatPrice(p.compareAtPrice!)}
                          </span>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isOnSale ? (
                          <div>
                            <Badge tone="good">
                              {pctOff}% OFF
                            </Badge>
                            <span className="ml-2 font-mono text-[0.75rem] text-emerald-300">
                              Save {formatPrice(savings)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {p.campaignName ? (
                          <span className="inline-flex items-center gap-1.5 rounded bg-[#C4F319]/10 px-2 py-0.5 text-[0.75rem] font-bold text-[#C4F319]">
                            <Flame className="h-3 w-3" />
                            {p.campaignName}
                          </span>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <PromotionActions
                          productId={p.id}
                          currentPrice={p.price}
                          compareAtPrice={p.compareAtPrice}
                          campaignName={p.campaignName}
                          salePercent={p.salePercent}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Active Campaigns Summary */}
      {withCampaign.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
            Active Campaign Groups
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...new Set(withCampaign.map((p) => p.campaignName))].map(
              (campaignName) => {
                const items = withCampaign.filter(
                  (p) => p.campaignName === campaignName,
                );
                return (
                  <Card key={campaignName}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-bold text-white">
                        <Flame className="h-4 w-4 text-orange-400" />
                        {campaignName}
                      </span>
                      <Badge tone="good">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1">
                      {items.slice(0, 4).map((item) => (
                        <p
                          key={item.id}
                          className="text-[0.75rem] text-white/60"
                        >
                          {item.name}{" "}
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <span className="text-emerald-300">
                              {Math.round(
                                ((item.compareAtPrice - item.price) /
                                  item.compareAtPrice) *
                                  100,
                              )}
                              % off
                            </span>
                          )}
                        </p>
                      ))}
                      {items.length > 4 && (
                        <p className="text-[0.6875rem] text-white/40">
                          +{items.length - 4} more
                        </p>
                      )}
                    </div>
                  </Card>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/discounts"
          className="inline-flex items-center gap-2 rounded border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          <Tag className="h-3.5 w-3.5" />
          Manage Discount Codes
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          <Package className="h-3.5 w-3.5" />
          Product Catalogue
        </Link>
      </div>
    </>
  );
}
