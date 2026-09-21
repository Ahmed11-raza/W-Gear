import type { Metadata } from "next";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopCategoryTiles } from "@/components/shop/ShopCategoryTiles";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Storefront & Catalog",
  description:
    "Complete 12-piece performance sportswear and teamwear catalog. Engineered for Pakistan's urban climate, manufactured in Sialkot, Punjab.",
};

export default async function Page() {
  const products = await getProducts();
  return (
    <>
      <ShopHero />
      <ShopCategoryTiles />
      <ProductGrid products={products} />
    </>
  );
}
