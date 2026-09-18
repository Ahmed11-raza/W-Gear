import { Hero } from "@/components/sections/Hero";
import { BrandSplit } from "@/components/sections/BrandSplit";
import { BrandImage } from "@/components/ui/BrandImage";
import { resolveSlot } from "@/lib/images";

/**
 * Home.
 *
 * Image slots are resolved here, on the server, and passed into the client
 * sections as rendered children — so the filesystem check stays server-side
 * and the sections stay unaware of where their media came from.
 */
export default function HomePage() {
  const hero = resolveSlot("hero-primary");
  const everyday = resolveSlot("split-everyday");
  const teamwear = resolveSlot("split-teamwear");

  return (
    <>
      <Hero
        image={
          <BrandImage
            slot={hero}
            sizes="100vw"
            className="h-full w-full"
            showBrief={false}
          />
        }
      />

      <BrandSplit
        everyday={
          <BrandImage
            slot={everyday}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full"
            showBrief={false}
          />
        }
        teamwear={
          <BrandImage
            slot={teamwear}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full"
            showBrief={false}
          />
        }
      />
    </>
  );
}
