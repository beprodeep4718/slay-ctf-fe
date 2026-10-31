"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { event } from "@/config/event";

const KEY = "slay-boot-seen";
const LINES = [
  ["arena link", "LOCKED"],
  ["towers", "ONLINE"],
  ["core", "CONTESTED"],
];

function seenThisSession() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function BootSequence() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const instant =
      seenThisSession() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = instant
      ? [setTimeout(() => setOpen(false), 0)]
      : [
          ...LINES.map((_, i) => setTimeout(() => setStep(i + 1), 450 * (i + 1))),
          setTimeout(() => setOpen(false), 2500),
        ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (open) return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="boot"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-void/90 p-6 font-mono text-sm leading-8 md:p-10"
        >
          <noscript>
            <style>{`#boot{display:none}`}</style>
          </noscript>
          <div>
            <p className="text-ember">DROP SEQUENCE // SECTOR {event.location.split(",")[0].toUpperCase()}</p>
            {LINES.slice(0, step).map(([label, value]) => (
              <p key={label}>
                &gt; {label} <span className="text-ember">{value}</span>
              </p>
            ))}
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="min-w-0 flex-1">
              <p className="font-display text-6xl leading-none font-black text-blood md:text-9xl">
                DEPLOYING
              </p>
              <div className="mt-4 h-2.5 border border-line bg-ash">
                <motion.div
                  className="h-full origin-left bg-blood"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.3, ease: "linear" }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 shrink-0 border border-ember bg-void px-4"
            >
              skip drop
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
