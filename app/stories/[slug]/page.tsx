import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatStoryDate } from "@/data/stories";
import { getStories, getStory } from "@/lib/store";

export async function generateStaticParams() {
  return (await getStories()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};

  return {
    title: story.title,
    description: story.standfirst,
    openGraph: {
      type: "article",
      title: story.title,
      description: story.standfirst,
      publishedTime: story.date,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const more = (await getStories()).filter((s) => s.slug !== story.slug).slice(0, 2);

  return (
    <article className="pt-[clamp(7rem,14vw,11rem)]">
      <header className="gutter">
        <div className="text-spec flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
          <Link href="/stories" className="hover:text-ink">
            Journal
          </Link>
          <span aria-hidden>/</span>
          <span className="text-accent-text">{story.category}</span>
          <span aria-hidden>/</span>
          <time dateTime={story.date}>{formatStoryDate(story.date)}</time>
          <span aria-hidden>/</span>
          <span>{story.readingMinutes} min read</span>
        </div>

        <h1
          className="mt-6 max-w-[20ch] font-display"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
            letterSpacing: "var(--text-display--letter-spacing)",
          }}
        >
          {story.title}
        </h1>

        <p
          className="mt-8 max-w-[56ch] text-ink-soft"
          style={{ fontSize: "var(--text-lede)" }}
        >
          {story.standfirst}
        </p>

        <div aria-hidden className="mt-12 h-px w-full bg-line" />
      </header>

      <div className="gutter">
        <div className="mt-12 flex max-w-[62ch] flex-col gap-6">
          {story.body.map((block) =>
            block.startsWith("## ") ? (
              <h2
                key={block}
                className="mt-8 font-display text-title font-extrabold tracking-[-0.02em]"
              >
                {block.slice(3)}
              </h2>
            ) : (
              <p key={block} className="text-ink-soft" style={{ fontSize: "var(--text-lede)" }}>
                {block}
              </p>
            ),
          )}
        </div>

        <p className="text-spec mt-16 max-w-[62ch] border-t border-line pt-6 text-muted">
          Demonstration content. Written in the brand voice and technically
          plausible, but not reviewed editorial and not a claim about any
          particular product.
        </p>
      </div>

      <section
        aria-labelledby="more-heading"
        className="gutter mt-[clamp(4rem,9vw,7rem)] border-t border-line pt-[clamp(3rem,6vw,4rem)] pb-[clamp(4rem,9vw,8rem)]"
      >
        <h2 id="more-heading" className="text-spec text-muted">
          Read next
        </h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-2">
          {more.map((s) => (
            <li key={s.slug}>
              <Link href={`/stories/${s.slug}`} className="group block">
                <p className="text-spec text-accent-text">{s.category}</p>
                <h3 className="mt-3 font-display text-[1.375rem] font-extrabold tracking-[-0.02em] transition-colors duration-[180ms] group-hover:text-accent-text">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[46ch] text-small text-muted">{s.standfirst}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
