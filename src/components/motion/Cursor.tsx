"use client";

import { useEffect, useRef } from "react";

const RING_EASE = 0.16;
const HOT = "a,button,input,summary,[role=button]";

function pad(n: number) {
  return String(Math.max(0, Math.round(n))).padStart(4, "0");
}

// Dot pinned to the pointer, plus a trailing ring that stretches with speed.
// Inside the hero it also draws crosshair lines and coordinates.
// The loop only runs while something is moving, so an idle page does no cursor work.
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const lineX = useRef<HTMLSpanElement>(null);
  const lineY = useRef<HTMLSpanElement>(null);
  const readX = useRef<HTMLSpanElement>(null);
  const readY = useRef<HTMLSpanElement>(null);
  const hud = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const pointer = { x: -200, y: -200 };
    const trail = { x: -200, y: -200 };
    let hot = false;
    let shown = false;
    let inHero = false;
    let heroStale = true;
    let pointerMoved = false;
    let frame = 0;
    let scale = 1;

    const tick = () => {
      frame = 0;
      if (heroStale) {
        heroStale = false;
        const heroBottom = document.getElementById("top")?.getBoundingClientRect().bottom ?? 0;
        const next = pointer.y < heroBottom && !document.querySelector("[role=dialog]");
        if (next !== inHero) {
          inHero = next;
          if (hud.current) hud.current.style.opacity = inHero ? "1" : "0";
        }
      }

      if (pointerMoved) {
        pointerMoved = false;
        if (dot.current) dot.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
        if (inHero) {
          if (lineX.current) lineX.current.style.transform = `translate3d(${pointer.x}px, 0, 0)`;
          if (lineY.current) lineY.current.style.transform = `translate3d(0, ${pointer.y}px, 0)`;
          if (readX.current) {
            readX.current.textContent = `X ${pad(pointer.x)}`;
            readX.current.style.transform = `translate3d(${pointer.x + 8}px, 0, 0)`;
          }
          if (readY.current) {
            readY.current.textContent = `Y ${pad(pointer.y)}`;
            readY.current.style.transform = `translate3d(0, ${pointer.y + 6}px, 0)`;
          }
        }
      }

      const dx = pointer.x - trail.x;
      const dy = pointer.y - trail.y;
      const speed = Math.hypot(dx, dy);
      trail.x += still ? dx : dx * RING_EASE;
      trail.y += still ? dy : dy * RING_EASE;
      const target = hot ? 1.7 : 1;
      scale += (target - scale) * 0.18;
      const stretch = still ? 0 : Math.min(speed / 260, 0.6);
      if (ring.current) {
        ring.current.style.transform =
          `translate3d(${trail.x}px, ${trail.y}px, 0) rotate(${Math.atan2(dy, dx)}rad) ` +
          `scale(${scale * (1 + stretch)}, ${scale * (1 - stretch * 0.5)})`;
      }
      if (speed > 0.2 || Math.abs(target - scale) > 0.01) wake();
    };

    function wake() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    const move = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointerMoved = true;
      heroStale = true;
      hot = Boolean((e.target as Element).closest?.(HOT));
      if (!shown) {
        shown = true;
        trail.x = pointer.x;
        trail.y = pointer.y;
        root.current?.classList.remove("opacity-0");
      }
      wake();
    };
    const scroll = () => {
      heroStale = true;
      wake();
    };
    const leave = () => {
      shown = false;
      root.current?.classList.add("opacity-0");
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    html.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      html.removeEventListener("pointerleave", leave);
      html.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] opacity-0">
      <div ref={hud} className="absolute inset-0 font-mono text-xs text-smoke opacity-0">
        <span ref={lineX} className="absolute inset-y-0 left-0 w-px bg-bone/20 will-change-transform" />
        <span ref={lineY} className="absolute inset-x-0 top-0 h-px bg-bone/20 will-change-transform" />
        <span ref={readX} className="absolute bottom-16 left-0 will-change-transform" />
        <span ref={readY} className="absolute top-0 left-3 will-change-transform" />
      </div>
      <span
        ref={ring}
        className="absolute top-0 left-0 -mt-[17px] -ml-[17px] size-[34px] rounded-full bg-ember/75 will-change-transform"
      />
      <span
        ref={dot}
        className="absolute top-0 left-0 -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-white will-change-transform"
      />
    </div>
  );
}
