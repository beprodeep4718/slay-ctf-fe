"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type StageInfo = { running: boolean; still: boolean; lite: boolean };

function supportsWebGL() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

// Mounts a 3D scene only near the viewport, and pauses it when off screen.
export function Stage({
  className,
  render,
  fallback,
}: {
  className?: string;
  render: (info: StageInfo) => ReactNode;
  fallback?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ near: false, running: false });
  const [env, setEnv] = useState<{ webgl: boolean; still: boolean; lite: boolean } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const frame = requestAnimationFrame(() =>
      setEnv({
        webgl: supportsWebGL(),
        still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        lite: window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4,
      }),
    );
    const observer = new IntersectionObserver(
      ([entry]) =>
        setState((s) => ({ near: s.near || entry.isIntersecting, running: entry.isIntersecting })),
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {env && !env.webgl
        ? fallback
        : env && state.near && render({ running: state.running, still: env.still, lite: env.lite })}
    </div>
  );
}
