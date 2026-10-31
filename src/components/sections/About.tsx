"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { event } from "@/config/event";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { useScrollScene, type Layout } from "@/components/fx/useScrollScene";
import { Heading } from "./Section";

const STATS = [
  { label: "FORMAT", value: event.format },
  { label: "DURATION", value: event.duration },
  { label: "TEAMS", value: event.teamSize },
  { label: "START", value: "19 Nov 2026" },
];

const BRIEFING = `${event.name} ${event.edition} is an annual 3-hour online jeopardy cybersecurity tournament, organized by ${event.organizer}, ${event.organizerRole}. Squads of 1 to 3 race through real offensive security challenges, and the scoreboard swings live.`;

// The briefing lights up word by word, then the mission facts lock in.
function buildAbout(root: HTMLElement, { wide }: Layout) {
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: wide
        ? { trigger: root, start: "top top", end: "+=140%", pin: true, scrub: 0.5 }
        : { trigger: root, start: "top 70%", end: "bottom 80%", scrub: 0.5 },
    })
    .fromTo("[data-word]", { opacity: 0.14 }, { opacity: 1, stagger: 0.1, duration: 0.3 })
    .fromTo("[data-stat]", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.25, duration: 0.8 });
}

export function About() {
  const root = useRef<HTMLElement>(null);
  useScrollScene(root, buildAbout);

  return (
    <section
      ref={root}
      id="about"
      className="flex flex-col justify-center px-5 py-24 md:px-12 md:py-32 lg:min-h-svh lg:py-24"
    >
      <Heading kicker="01 THE MISSION">
        One arena. <span className="text-blood">One core.</span>
      </Heading>
      <p className="mt-8 max-w-4xl text-lg leading-relaxed md:text-2xl">
        {BRIEFING.split(" ").map((word, i) => (
          <span key={i} data-word>
            {word}{" "}
          </span>
        ))}
      </p>
      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} data-stat className="border border-line bg-ash p-5">
            <p className="font-mono text-sm text-ember">{stat.label}</p>
            <ScrambleText
              text={stat.value}
              className="mt-3 block font-display text-3xl font-black uppercase md:text-4xl"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
