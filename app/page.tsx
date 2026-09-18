import { Hero } from "@/components/sections/Hero";
import { BrandSplit } from "@/components/sections/BrandSplit";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { MaterialStory } from "@/components/sections/MaterialStory";
import { MakingStory } from "@/components/sections/MakingStory";
import { TeamwearIntro } from "@/components/sections/TeamwearIntro";
import { JournalRail } from "@/components/sections/JournalRail";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { BrandImage } from "@/components/ui/BrandImage";
import { resolveSlot } from "@/lib/images";
import { featuredProducts } from "@/data/products";
import { storiesByDate } from "@/data/stories";

/**
 * Home — the narrative set out in brief 11.
 *
 * Hero, brand split, featured edit, the fabric-and-human signature, how it is
 * made, teamwear, journal, close. Community and social proof (brief 11 §10) is
 * deliberately absent: no teams or partners have been confirmed, and brief 20
 * and 53 both forbid inventing them.
 *
 * Image slots are resolved here, on the server, and passed into the client
 * sections as rendered children — so the filesystem check stays server-side and
 * the sections stay unaware of where their media came from.
 */
export default function HomePage() {
  const hero = resolveSlot("hero-primary");
  const everyday = resolveSlot("split-everyday");
  const teamwear = resolveSlot("split-teamwear");
  const movement = resolveSlot("movement-editorial");

  return (
    <>
      <Hero
        image={
          <BrandImage
            slot={hero}
            sizes="100vw"
            className="h-full w-full"
            showBrief={false}
            underHeader
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

      <FeaturedCollection products={featuredProducts()} />

      <MaterialStory
        human={
          <BrandImage
            slot={movement}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full"
            showBrief={false}
          />
        }
      />

      <MakingStory />

      <TeamwearIntro />

      <JournalRail stories={storiesByDate()} />

      <ClosingCTA />
    </>
  );
}
