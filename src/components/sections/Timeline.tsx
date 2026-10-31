"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { event } from "@/config/event";
import { useScrollScene, type Layout } from "@/components/fx/useScrollScene";
import { Heading } from "./Section";

// Wide screens travel sideways through the phases; the path line tracks progress.
function buildTimeline(root: HTMLElement, { wide }: Layout) {
  if (!wide) {
    gsap.fromTo(
      "[data-path]",
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 70%", scrub: true } },
    );
    return;
  }

  const track = root.querySelector<HTMLElement>("[data-track]");
  if (!track) return;
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 144);

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    })
    .fromTo("[data-path]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
    .to(track, { x: () => -distance(), duration: 1 }, 0);
}

export function Timeline() {
  const root = useRef<HTMLElement>(null);
  useScrollScene(root, buildTimeline);

  return (
    <section
      ref={root}
      id="timeline"
      className="flex flex-col justify-center overflow-hidden px-5 py-24 md:px-12 md:py-32 pinned:h-svh pinned:py-20"
    >
      <Heading kicker="03 BATTLE PLAN">Four phases to the core</Heading>
      <div className="mt-10 h-[3px] bg-line">
        <div data-path className="h-full origin-left bg-blood" />
      </div>
      <ol data-track className="mt-4 flex flex-col gap-4 pinned:w-max pinned:flex-row">
        {event.phases.map((phase, i) => (
          <li
            key={phase.word}
            className="flex h-52 flex-col justify-between border border-line bg-ash p-5 pinned:h-[44vh] pinned:w-[46vw] pinned:p-8"
          >
            <p className="font-mono text-sm text-ember">PHASE 0{i + 1}</p>
            <div>
              <p className="font-display text-5xl leading-none font-black uppercase pinned:text-8xl">{phase.word}</p>
              <p className="mt-2 text-smoke">{phase.title}</p>
              <p className="mt-1 font-mono text-sm">{phase.when}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
