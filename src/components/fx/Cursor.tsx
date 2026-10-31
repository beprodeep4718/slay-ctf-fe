"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function Cursor() {
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      setActive(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!active) return null;

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed top-0 left-0 z-[60] -mt-5 -ml-5 size-10 text-ember"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5" />
        <path d="M20 15v10M15 20h10" />
      </g>
    </motion.svg>
  );
}
