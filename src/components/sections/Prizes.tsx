"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { event } from "@/config/event";
import { Weapon } from "@/components/fx/Scenes";
import { useScrollScene, type Layout } from "@/components/fx/useScrollScene";
import { Heading } from "./Section";

// Relics unlock from third place up, saving first place for last.
function buildPrizes(root: HTMLElement, { wide }: Layout) {
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: wide
      ? { trigger: root, start: "top top", end: "+=120%", pin: true, scrub: 0.5 }
      : { trigger: root, start: "top 70%", end: "bottom 80%", scrub: 0.5 },
  });
  ["03", "02", "01"].forEach((rank) => {
    timeline.fromTo(`[data-rank="${rank}"]`, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "+=0.15");
  });
}

export function Prizes() {
  const root = useRef<HTMLElement>(null);
  useScrollScene(root, buildPrizes);

  return (
    <section
      ref={root}
      id="prizes"
      className="flex flex-col justify-center px-5 py-24 md:px-12 md:py-32 lg:min-h-svh lg:pt-24 lg:pb-8"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end lg:pr-16">
        <Heading kicker="04 THE SPOILS">Claim the relics</Heading>
        <p className="font-display text-6xl leading-[0.9] font-black text-blood md:text-8xl">{event.prizePool}</p>
      </div>
      <div className="mt-8 grid items-end gap-8 text-center md:grid-cols-3">
        {event.prizes.map((prize) => {
          const first = prize.rank === "01";
          return (
            <div key={prize.rank} data-rank={prize.rank} className={first ? "order-first md:order-none" : ""}>
              <Weapon
                shape={prize.shape}
                className={`mx-auto aspect-square w-full ${
                  first ? "max-w-[340px] lg:max-w-[min(340px,40vh)]" : "max-w-[260px] lg:max-w-[min(260px,30vh)]"
                }`}
              />
              <p className="font-mono text-sm text-ember">RANK {prize.rank}</p>
              <p className={`font-display font-black ${first ? "text-7xl text-blood" : "text-5xl"}`}>{prize.amount}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
