import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <PageHeader kicker="Cart" title="Your selection." />
      <div className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <CartView />
      </div>
    </>
  );
}
