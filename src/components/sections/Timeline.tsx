"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { event } from "@/config/event";
import { Heading } from "./Section";

export function Timeline() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 55%", scrub: true },
        },
      );
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section id="timeline" className="px-5 py-24 md:px-12 md:py-32">
      <Heading kicker="03 BATTLE PLAN">Four phases to the core</Heading>
      <div ref={root} className="mt-10">
        <div className="h-[3px] bg-line">
          <div ref={line} className="h-full origin-left bg-blood" />
        </div>
        <ol className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {event.phases.map((phase, i) => (
            <li key={phase.word} className="flex h-52 flex-col justify-between border border-line bg-ash p-5">
              <p className="font-mono text-sm text-ember">PHASE 0{i + 1}</p>
              <div>
                <p className="font-display text-5xl leading-none font-black uppercase">{phase.word}</p>
                <p className="mt-2 text-smoke">{phase.title}</p>
                <p className="mt-1 font-mono text-sm">{phase.when}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
