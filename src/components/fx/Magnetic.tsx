"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

// Pulls its child toward the pointer while the pointer is nearby.
export function Magnetic({ children }: { children: ReactNode }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const x = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3" });
    const y = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3" });
    const move = (e: PointerEvent) => {
      const box = element.getBoundingClientRect();
      x((e.clientX - box.left - box.width / 2) * 0.28);
      y((e.clientY - box.top - box.height / 2) * 0.28);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span ref={root} className="inline-block">
      {children}
    </span>
  );
}
