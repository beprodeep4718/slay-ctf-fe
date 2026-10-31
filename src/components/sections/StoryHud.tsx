"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, useStory } from "@/components/fx/story";

// The story's thread: scrolling is the attack, so core integrity falls with progress.
export function StoryHud() {
  const { breached } = useStory();
  const [chapter, setChapter] = useState(0);
  const [visible, setVisible] = useState(false);
  const label = useRef<HTMLSpanElement>(null);
  const railBar = useRef<HTMLSpanElement>(null);
  const topBar = useRef<HTMLSpanElement>(null);
  const breachedRef = useRef(breached);

  useEffect(() => {
    breachedRef.current = breached;
    if (breached) {
      if (label.current) label.current.textContent = "0%";
      railBar.current?.style.setProperty("transform", "scaleY(0)");
      topBar.current?.style.setProperty("transform", "scaleX(0)");
    }
  }, [breached]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sections = CHAPTERS.map(({ id }) => document.getElementById(id));

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (!breachedRef.current) {
          // Scrolling alone never finishes the core; the last strike is the visitor's.
          const integrity = 1 - self.progress * 0.92;
          if (label.current) label.current.textContent = `${Math.round(integrity * 100)}%`;
          if (railBar.current) railBar.current.style.transform = `scaleY(${integrity})`;
          if (topBar.current) topBar.current.style.transform = `scaleX(${integrity})`;
        }
        const middle = window.innerHeight / 2;
        let index = 0;
        sections.forEach((section, i) => {
          if (section && section.getBoundingClientRect().top <= middle) index = i;
        });
        setChapter(index);
        setVisible(self.scroll() > window.innerHeight * 0.25);
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-20 z-30 h-0.5 bg-line/60 lg:hidden">
        <span ref={topBar} className="block h-full origin-left bg-blood" />
      </div>
      <nav
        aria-label="Chapters"
        className={`fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 font-mono text-xs transition-opacity duration-300 lg:flex ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mb-2 flex items-center gap-2 bg-void/80 px-2 py-1">
          <span className="text-smoke">{breached ? "BREACHED" : "CORE"}</span>
          <span ref={label} className="w-9 text-right text-ember tabular-nums">
            100%
          </span>
          <span className="h-10 w-1 bg-line">
            <span ref={railBar} className="block h-full origin-bottom bg-blood" />
          </span>
        </div>
        {CHAPTERS.map(({ id, label: name }, i) => {
          const on = i === chapter;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={on ? "step" : undefined}
              className="group flex h-6 items-center gap-2"
            >
              <span
                className={`bg-void/80 px-2 py-0.5 transition-opacity ${
                  on ? "text-ember opacity-100" : "text-bone opacity-0 group-hover:opacity-100"
                }`}
              >
                {name}
              </span>
              <span className={`h-px transition-all ${on ? "w-6 bg-ember" : "w-3 bg-smoke group-hover:w-5"}`} />
            </a>
          );
        })}
      </nav>
    </>
  );
}
