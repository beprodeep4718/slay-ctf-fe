"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { event } from "@/config/event";
import { Magnetic } from "@/components/motion/Magnetic";
import { Arena } from "@/features/arena/Scenes";
import { story } from "@/features/story/story";
import { useScrollScene, type Layout } from "@/features/story/useScrollScene";
import { Countdown } from "./Countdown";

const TICKER = [event.dateLabel, `${event.duration} sprint`.toUpperCase(), `${event.format} ${event.mode}`.toUpperCase(), `TEAMS: ${event.teamSize}`.toUpperCase(), `FLAG: ${event.flagFormat}`];

// Scrolling drives the camera at the core while the title splits around it.
function buildHero(root: HTMLElement, { wide }: Layout) {
  const trackDive = (self: ScrollTrigger) => {
    story.dive = self.progress;
  };

  if (!wide) {
    ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom top", scrub: true, onUpdate: trackDive });
    gsap.to("[data-hero-title]", {
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "50% top", scrub: true },
    });
    return;
  }

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=130%",
        pin: true,
        scrub: 0.5,
        onUpdate: trackDive,
      },
    })
    .to("[data-slay]", { xPercent: -40, opacity: 0, duration: 0.5 }, 0)
    .to("[data-ctf]", { xPercent: 40, opacity: 0, duration: 0.5 }, 0)
    .to("[data-hero-copy]", { y: 50, opacity: 0, duration: 0.25 }, 0)
    .fromTo("[data-hero-line]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.5)
    .to("[data-hero-line]", { y: -30, opacity: 0, duration: 0.15 }, 0.85);
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useScrollScene(root, buildHero);

  return (
    <section ref={root} id="top" className="relative h-svh min-h-[620px] overflow-hidden md:min-h-[720px]">
      <h1
        data-hero-title
        className="absolute inset-x-5 top-[92px] z-10 flex justify-between font-display text-[27vw] leading-none font-black text-blood md:inset-x-12 md:top-[11vh] md:z-0 md:text-[26.4vw]"
      >
        <span data-slay>SLAY</span>
        <span data-ctf className="text-bone">
          CTF
        </span>
      </h1>
      <Arena dive className="absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/5 bg-gradient-to-b from-transparent to-void to-70% md:block"
      />
      <p
        data-hero-line
        className="pointer-events-none absolute inset-x-5 bottom-[18%] text-center font-display text-5xl leading-none font-black uppercase opacity-0 md:text-7xl"
      >
        The flag sits behind that core.
        <br />
        <span className="text-blood">Your team has to take it.</span>
      </p>
      <div
        data-hero-copy
        className="absolute inset-x-5 bottom-[60px] z-[1] flex flex-col gap-3 before:pointer-events-none before:absolute before:-inset-x-5 before:-top-14 before:-bottom-[60px] before:-z-10 before:bg-gradient-to-b before:from-transparent before:to-void before:to-[72px] md:inset-x-12 md:before:hidden md:bottom-[84px] md:flex-row md:items-end md:justify-between md:gap-6"
      >
        <div className="contents md:flex md:flex-col md:items-start md:gap-4">
          <p className="font-mono text-xs text-ember md:text-sm">
            {"// "}
            {event.level.toUpperCase()} · {event.mode.toUpperCase()} {event.format.toUpperCase()}
          </p>
          <p className="max-w-[540px] text-sm leading-relaxed md:text-base">
            Annual 3-hour online jeopardy cybersecurity tournament.{" "}
            <span className="hidden md:inline">Teams enter the arena, one holds the core. </span>
            Organized by {event.organizer}, {event.hostShort}.
          </p>
          <Magnetic className="order-last block md:order-none md:inline-block">
            <a
              href={event.registerUrl}
              className="flex h-14 items-center justify-center bg-blood px-9 font-mono text-base font-bold text-white hover:bg-ember md:h-[60px]"
            >
              ENTER THE ARENA -&gt;
            </a>
          </Magnetic>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <p className="hidden font-mono text-sm text-smoke md:block">SCROLL TO ATTACK · CLICK TO STRIKE</p>
          <Countdown />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[2] flex h-11 items-center overflow-hidden bg-blood font-mono text-xs font-bold md:h-[52px] md:text-sm whitespace-nowrap text-white">
        <div className="flex shrink-0 animate-marquee gap-12 pl-12">
          {[0, 1, 2, 3, 4, 5, 6, 7].flatMap((copy) =>
            TICKER.flatMap((item) => [
              <span key={`${copy}-${item}`}>{item}</span>,
              <span key={`${copy}-${item}-mark`}>{"///"}</span>,
            ]),
          )}
        </div>
      </div>
    </section>
  );
}
