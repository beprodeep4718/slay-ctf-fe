"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MOTION = "(prefers-reduced-motion: no-preference)";
// Pinned scenes need room, so short or narrow screens get plain scrubbed reveals.
const WIDE = `(min-width: 1024px) and (min-height: 700px) and ${MOTION}`;
const NARROW = `(max-width: 1023px) and ${MOTION}, (max-height: 699px) and ${MOTION}`;

export type Layout = { wide: boolean };

// Builds a scroll scene for each layout, and reverts it when the layout changes.
// With reduced motion neither query matches, so every section stays static.
export function useScrollScene<T extends HTMLElement>(
  root: RefObject<T | null>,
  build: (element: T, layout: Layout) => void,
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(element);
    media.add({ wide: WIDE, narrow: NARROW }, (context) => {
      build(element, { wide: Boolean(context.conditions?.wide) });
    });
    return () => media.revert();
  }, [root, build]);
}
