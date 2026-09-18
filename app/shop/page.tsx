import type { Metadata } from "next";
import { NotBuilt } from "@/components/layout/NotBuilt";

export const metadata: Metadata = { title: "Shop" };

export default function Page() {
  return <NotBuilt title="Shop" note="The storefront — collection grid, product pages, cart and checkout — is designed in the data model but not built in this pass. This build covers the design foundation and the three moments that carry the brand: the hero, the split between everyday and teamwear, and the team builder." />;
}
