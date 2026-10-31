"use client";

import { useEffect, useRef } from "react";
import { event } from "@/config/event";
import { breachCore, useStory } from "@/components/fx/story";

const HOLD_SECONDS = 1.6;

// The finale: hold to charge the last strike. Registering never depends on this.
export function Breach() {
  const { loadout, breached } = useStory();
  const fill = useRef<HTMLSpanElement>(null);
  const holding = useRef(false);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function run() {
    let charge = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      charge += (holding.current ? dt / HOLD_SECONDS : -dt) as number;
      charge = Math.max(0, charge);
      if (fill.current) fill.current.style.transform = `scaleX(${Math.min(charge, 1)})`;
      if (charge >= 1) {
        breachCore();
        return;
      }
      if (holding.current || charge > 0) frame.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(tick);
  }

  const press = () => {
    if (breached || holding.current) return;
    holding.current = true;
    run();
  };
  const release = () => {
    holding.current = false;
  };

  const weapon = loadout === null ? null : event.tracks[loadout]?.name;

  return (
    <div className="flex flex-col items-start gap-3 font-mono text-sm">
      <p className="text-smoke">
        {weapon ? (
          <>
            ARMED: <span className="text-ember">{weapon.toUpperCase()}</span>
          </>
        ) : (
          <a href="#tracks" className="underline underline-offset-4 hover:text-ember">
            No weapon armed. Go back and pick one.
          </a>
        )}
      </p>
      <button
        type="button"
        disabled={breached}
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            press();
          }
        }}
        onKeyUp={release}
        onBlur={release}
        className="relative h-12 touch-none overflow-hidden border border-ember px-6 text-ember select-none disabled:border-blood disabled:bg-blood disabled:text-white"
      >
        <span ref={fill} aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-blood/60" />
        <span className="relative">{breached ? "CORE BREACHED. THE ARENA IS YOURS." : "HOLD TO BREACH THE CORE"}</span>
      </button>
    </div>
  );
}
