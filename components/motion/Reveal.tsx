"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, MEDIA, EASE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  /** Stagger children instead of moving the wrapper as one block. */
  stagger?: boolean;
  /** Seconds to hold before starting. */
  delay?: number;
  /** Travel distance in px. Kept small so it reads as a fade, not a slide. */
  y?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Level 3 scroll reveal.
 *
 * Under `prefers-reduced-motion: reduce` the matchMedia branch never runs, so
 * the element keeps its natural rendered state — visible, in flow, readable by
 * crawlers. Nothing is opacity-0 by default in CSS, which means no content is
 * ever trapped invisible if JavaScript fails.
 */
export function Reveal({
  children,
  stagger = false,
  delay = 0,
  y = 14,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const el = ref.current;
        if (!el) return;

        const targets = stagger ? Array.from(el.children) : el;

        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.62,
          ease: EASE.out,
          delay,
          stagger: stagger ? 0.07 : 0,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
