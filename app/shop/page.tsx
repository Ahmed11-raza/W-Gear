import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Everyday performance wear and match-weight kit, cut and finished to one standard.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        kicker="Everything"
        title="One cloth. Many movements."
        lede="Twelve pieces across three lines. Everyday wear that performs, training pieces built around heat and range, and match kit you can order one at a time or by the side."
      />
      <ProductGrid products={PRODUCTS} />
    </>
  );
}
