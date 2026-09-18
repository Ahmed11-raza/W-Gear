import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Checkout } from "@/components/cart/Checkout";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <PageHeader kicker="Checkout" title="Confirm your order." />
      <div className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <Checkout />
      </div>
    </>
  );
}
