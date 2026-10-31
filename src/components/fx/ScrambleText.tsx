"use client";

import { useEffect, useState } from "react";
import { useInView } from "motion/react";
import { useRef } from "react";

const GLYPHS = "#$%&/<>01X";

function scramble(text: string, progress: number) {
  const shown = Math.floor(text.length * progress);
  return text
    .split("")
    .map((c, i) => (i < shown || c === " " ? c : GLYPHS[(i * 7 + shown) % GLYPHS.length]))
    .join("");
}

// Characters settle into the final text whenever it changes or scrolls into view.
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [frame, setFrame] = useState({ text, progress: 1 });

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(1, progress + 0.1);
      setFrame({ text, progress });
      if (progress >= 1) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, text]);

  const visible = frame.text === text ? scramble(text, frame.progress) : text;

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{visible}</span>
    </span>
  );
}
