"use client";

import { useCallback, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { event } from "@/config/event";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { Weapon } from "@/features/arena/Scenes";
import { armWeapon, useStory } from "@/features/story/story";
import { useScrollScene, type Layout } from "@/features/story/useScrollScene";
import { Heading } from "@/components/ui/Section";

const COUNT = event.tracks.length;

export function Tracks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { loadout } = useStory();

  // While pinned, each stretch of scroll inspects the next weapon.
  const build = useCallback((element: HTMLElement, { wide }: Layout) => {
    if (!wide) return;
    ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: () => `+=${window.innerHeight * 2.4}`,
      pin: true,
      onUpdate: (self) => setActive(Math.min(COUNT - 1, Math.floor(self.progress * COUNT))),
    });
  }, []);
  useScrollScene(root, build);

  return (
    <section
      ref={root}
      id="tracks"
      className="flex flex-col justify-center px-5 py-24 md:px-12 md:py-32 lg:h-svh lg:pt-24 lg:pb-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 lg:pr-16">
        <Heading kicker="02 LOADOUT">
          Pick your <span className="text-blood">weapon</span>
        </Heading>
        <p className="font-mono text-sm text-smoke">
          WEAPON {active + 1}/{COUNT} · CLICK TO ARM
        </p>
      </div>
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="border-t border-line" role="group" aria-label="Challenge tracks">
          {event.tracks.map((track, i) => {
            const on = i === active;
            const armed = i === loadout;
            return (
              <button
                key={track.name}
                type="button"
                aria-pressed={armed}
                onClick={() => {
                  setActive(i);
                  armWeapon(i);
                }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`flex h-16 w-full items-center gap-4 border-b border-line px-4 text-left md:h-[72px] md:gap-6 md:px-6 ${
                  on ? "bg-blood text-white" : ""
                }`}
              >
                <span className="hidden font-mono text-sm sm:inline">SLOT {i + 1}</span>
                <span className="font-display text-3xl font-black uppercase md:text-[52px]">{track.name}</span>
                {armed && <span className="ml-auto font-mono text-xs md:text-sm">ARMED</span>}
              </button>
            );
          })}
        </div>
        <div className="order-first text-center lg:order-none">
          <Weapon shape={active} className="mx-auto aspect-square w-full max-w-[240px] lg:max-w-[min(380px,46vh)]" />
          <p aria-live="polite" className="font-mono text-ember">
            <ScrambleText text={event.tracks[active].blurb} />
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2 font-mono text-xs text-smoke">
            {event.tracks[active].tools.map((tool) => (
              <li key={tool} className="border border-line px-2 py-1">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
