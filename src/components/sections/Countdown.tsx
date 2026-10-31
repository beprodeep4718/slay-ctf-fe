"use client";

import { useEffect, useState } from "react";
import { event } from "@/config/event";

const LABELS = ["DAYS", "HRS", "MIN", "SEC"];

function parts(now: number | null) {
  if (now === null || !event.startsAt) return LABELS.map(() => "--");
  const left = Math.max(0, new Date(event.startsAt).getTime() - now);
  const seconds = Math.floor(left / 1000);
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ].map((n) => String(n).padStart(2, "0"));
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!event.startsAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const values = parts(now);

  return (
    <div className="grid grid-cols-4 gap-2 font-mono md:flex md:gap-7" role="timer" aria-label="Time until the event">
      {LABELS.map((label, i) => (
        <div key={label}>
          <div className="text-2xl leading-none font-bold tabular-nums md:text-[56px]">{values[i]}</div>
          <div className="mt-1 text-xs text-smoke">{label}</div>
        </div>
      ))}
    </div>
  );
}
