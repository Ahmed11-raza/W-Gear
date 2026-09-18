import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { storiesByDate, formatStoryDate } from "@/data/stories";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Training in Pakistan, how fabric actually works, and what separates kit that lasts from kit that does not.",
};

export default function Page() {
  const stories = storiesByDate();

  return (
    <>
      <PageHeader
        kicker="Journal"
        title="How this stuff actually works."
        lede="Material, construction and training, written for people who want the mechanism rather than the marketing."
      />

      <div className="gutter pb-[clamp(4rem,9vw,8rem)]">
        <Reveal stagger as="ul" className="flex flex-col border-t border-line">
          {stories.map((story) => (
            <li key={story.slug} className="border-b border-line">
              <Link
                href={`/stories/${story.slug}`}
                className="group grid gap-x-8 gap-y-3 py-8 md:grid-cols-[10rem_1fr_6rem] md:items-baseline"
              >
                <div className="text-spec text-muted">
                  <time dateTime={story.date}>{formatStoryDate(story.date)}</time>
                  <p className="mt-2 text-accent-text">{story.category}</p>
                </div>

                <div>
                  <h2 className="font-display text-title font-extrabold tracking-[-0.02em] transition-colors duration-[180ms] group-hover:text-accent-text">
                    {story.title}
                  </h2>
                  <p className="mt-3 max-w-[58ch] text-muted">{story.standfirst}</p>
                </div>

                <p className="text-spec text-muted md:text-right">
                  {story.readingMinutes} min
                </p>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </>
  );
}
