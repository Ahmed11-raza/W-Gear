import Link from "next/link";
import type { Story } from "@/types";
import { Reveal } from "@/components/motion/Reveal";
import { formatStoryDate } from "@/data/stories";

/**
 * Journal (brief 11 §11, brief 29).
 *
 * The cultural layer, kept restrained on the homepage — three headlines and a
 * route out. The journal earns attention on its own page; here it only has to
 * establish that the brand has something to say.
 */
export function JournalRail({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;

  return (
    <section aria-labelledby="journal-heading" className="bg-surface">
      <div className="gutter py-[var(--spacing-section)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-spec text-muted">Journal</p>
              <h2
                id="journal-heading"
                className="mt-5 max-w-[18ch] font-display"
                style={{
                  fontSize: "var(--text-display)",
                  lineHeight: "var(--text-display--line-height)",
                  letterSpacing: "var(--text-display--letter-spacing)",
                }}
              >
                How this stuff works.
              </h2>
            </div>

            <Link
              href="/stories"
              className="text-[0.9375rem] text-ink underline decoration-line-strong underline-offset-[6px] transition-colors duration-[180ms] hover:decoration-ink"
            >
              All stories
            </Link>
          </div>

          <Reveal stagger as="ul" className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {stories.slice(0, 3).map((story) => (
              <li key={story.slug} className="border-t border-line-strong pt-6">
                <Link href={`/stories/${story.slug}`} className="group block">
                  <div className="text-spec flex items-center gap-3 text-muted">
                    <span className="text-accent-text">{story.category}</span>
                    <span aria-hidden>/</span>
                    <time dateTime={story.date}>{formatStoryDate(story.date)}</time>
                  </div>

                  <h3 className="mt-5 font-display text-[1.375rem] leading-[1.15] font-extrabold tracking-[-0.02em] transition-colors duration-[180ms] group-hover:text-accent-text">
                    {story.title}
                  </h3>

                  <p className="mt-3 text-small text-muted">{story.standfirst}</p>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
