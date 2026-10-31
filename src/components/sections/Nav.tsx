"use client";

import { event } from "@/config/event";
import { openTerminal } from "@/components/terminal/flags";

const LINKS = ["tracks", "timeline", "prizes", "rules"];

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between bg-void/60 px-5 font-mono text-sm backdrop-blur-sm md:px-12"
    >
      <a href="#top" className="font-display text-3xl font-black tracking-wide">
        SLAY<span className="text-ember">_</span>CTF
      </a>
      <span className="hidden text-smoke xl:block">
        SECTOR {event.location.split(",")[0].toUpperCase()} {"//"} {event.coordinates}
      </span>
      <div className="flex items-center gap-8">
        {LINKS.map((link) => (
          <a key={link} href={`#${link}`} className="hidden hover:text-ember md:block">
            /{link}
          </a>
        ))}
        <button
          type="button"
          onClick={openTerminal}
          aria-label="Open terminal"
          className="h-11 border border-ember px-4 text-ember hover:bg-ember hover:text-void"
        >
          &gt;_<span className="hidden md:inline"> terminal</span>
        </button>
      </div>
    </nav>
  );
}
