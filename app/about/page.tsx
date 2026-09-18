import type { Metadata } from "next";
import { NotBuilt } from "@/components/layout/NotBuilt";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <NotBuilt title="About" note="The brand story page is not built in this pass. What the brand stands for is expressed on the home page instead, where it does commercial work." />;
}
