"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persisted-store";

/**
 * Says what this build is.
 *
 * The catalogue, prices, stock figures and contact details are sample data, and
 * the cart does not reach an order system. The site is otherwise complete and
 * navigable, which is exactly the condition under which someone might assume
 * they can buy something. This is the notice that stops that assumption.
 *
 * Dismissible, and the dismissal is remembered — it is a disclosure, not a
 * cookie wall, and it should not be in the way on the second page view. It
 * renders nothing until storage has been read, so the server markup and the
 * hydrating render agree.
 */
const store = createPersistedStore<boolean>("iwear.demo-notice.dismissed", true, (raw) =>
  raw === true,
);

export function DemoNotice() {
  const dismissed = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const bar = useRef<HTMLElement>(null);

  /**
   * A fixed bar sits over whatever is at the bottom of the viewport — on the
   * homepage that is the hero’s call to action (brief 37: sticky controls must
   * not obscure content). Publishing the bar’s height as a custom property lets
   * the page reserve exactly that much space wherever it matters.
   */
  useEffect(() => {
    if (dismissed || !bar.current) return;

    const apply = () => {
      const height = bar.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--demo-bar", `${height}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bar.current);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--demo-bar");
    };
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <aside
      ref={bar}
      aria-label="Demonstration notice"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-canvas/15 bg-ink text-inverse"
    >
      <div className="gutter flex items-center justify-between gap-4 py-3">
        <p className="text-[0.8125rem] leading-[1.45] text-canvas/85">
          <span className="text-spec mr-2 text-canvas">Demo</span>
          Sample data throughout. Nothing can be bought and no order is placed.
        </p>
        <button
          type="button"
          onClick={() => store.set(true)}
          className="inline-flex min-h-[44px] shrink-0 items-center border border-canvas/40 px-4 text-[0.75rem] uppercase tracking-[0.1em] transition-colors duration-[180ms] hover:bg-canvas hover:text-ink"
        >
          Got it
        </button>
      </div>
    </aside>
  );
}
