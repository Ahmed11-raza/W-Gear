import type { Metadata } from "next";
import { NotBuilt } from "@/components/layout/NotBuilt";

export const metadata: Metadata = { title: "Custom teamwear" };

export default function Page() {
  return <NotBuilt title="Custom teamwear" note="The teamwear landing page is not built in this pass — but the thing it would introduce is. Go straight to the builder." />;
}
