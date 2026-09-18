import type { Metadata } from "next";
import { NotBuilt } from "@/components/layout/NotBuilt";

export const metadata: Metadata = { title: "Collections" };

export default function Page() {
  return <NotBuilt title="Collections" note="Collection pages are architected and not yet built. The product type, variant and specification model they will read from already exists." />;
}
