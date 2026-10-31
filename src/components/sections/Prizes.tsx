"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { event } from "@/config/event";
import { Weapon } from "@/components/fx/Scenes";
import { useScrollScene, type Layout } from "@/components/fx/useScrollScene";
import { Heading } from "./Section";

// Each perk unlocks in turn as the visitor scrolls past the relic.
function buildPrizes(root: HTMLElement, { wide }: Layout) {
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: wide
        ? { trigger: root, start: "top top", end: "+=120%", pin: true, scrub: 0.5 }
        : { trigger: root, start: "top 70%", end: "bottom 80%", scrub: 0.5 },
    })
    .fromTo("[data-perk]", { x: -50, opacity: 0 }, { x: 0, opacity: 1, stagger: 1.2, duration: 1 });
}

export function Prizes() {
  const root = useRef<HTMLElement>(null);
  useScrollScene(root, buildPrizes);

  return (
    <section
      ref={root}
      id="prizes"
      className="flex flex-col justify-center px-5 py-24 md:px-12 md:py-32 pinned:min-h-svh pinned:pt-24 pinned:pb-8"
    >
      <Heading kicker="04 THE SPOILS">Claim the relics</Heading>
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:pr-16">
        <ol className="border-t border-line">
          {event.perks.map((perk, i) => (
            <li key={perk.title} data-perk className="flex gap-6 border-b border-line py-4">
              <span className="pt-1.5 font-mono text-sm text-ember">0{i + 1}</span>
              <div>
                <p className="font-display text-3xl leading-none font-black uppercase md:text-4xl">{perk.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-smoke">{perk.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Weapon shape={6} className="order-first mx-auto aspect-square w-full max-w-[240px] lg:order-none lg:max-w-[min(380px,44vh)]" />
      </div>
    </section>
  );
}
