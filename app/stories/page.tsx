import type { Metadata } from "next";
import { NotBuilt } from "@/components/layout/NotBuilt";

export const metadata: Metadata = { title: "Stories" };

export default function Page() {
  return <NotBuilt title="Stories" note="The journal is planned as a cultural layer — training in Pakistan, what makes a good jersey, how fabric actually works. No articles have been written, and none have been invented to fill the space." />;
}
