"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { event } from "@/config/event";
import { CONSOLE_CLUE, FLAG_HASHES, SCAN_CLUE, onOpenTerminal, sha256 } from "./flags";

const KEY = "slay-flags";

type Line = { text: string; tone?: "ember" | "smoke" };

const INTRO: Line[] = [
  { text: "Field link open. Type help for orders.", tone: "ember" },
  { text: "Three flags are hidden around this arena.", tone: "smoke" },
];

const HELP = [
  "help      list commands",
  "about     the event",
  "rules     how to compete",
  "register  open registration",
  "hint      where to look for flags",
  "scan      sweep the arena",
  "flag <x>  submit a flag",
  "clear     clear the screen",
];

function loadFound(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState(INTRO);
  const [found, setFound] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(`%cARENA SIGNAL %c${CONSOLE_CLUE}`, "color:#FF4B3E;font-weight:700", "color:inherit");
    const frame = requestAnimationFrame(() => setFound(loadFound()));
    const stop = onOpenTerminal(() => setOpen(true));
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as Element).closest?.("input,textarea");
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      stop();
      window.removeEventListener("keydown", key);
    };
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines]);

  async function submitFlag(flag: string) {
    const hash = await sha256(flag);
    if (!FLAG_HASHES.includes(hash)) return "Wrong flag. Keep hunting.";
    if (found.includes(hash)) return "Flag already captured.";
    const next = [...found, hash];
    setFound(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    return next.length === FLAG_HASHES.length
      ? "ALL FLAGS CAPTURED. The core is yours. See you in the arena."
      : `FLAG ACCEPTED. ${next.length}/${FLAG_HASHES.length} captured.`;
  }

  async function run(raw: string) {
    const command = raw.trim();
    const lower = command.toLowerCase();
    if (lower === "clear") {
      setLines([]);
      return;
    }
    let out: string[];
    if (!command) out = [];
    else if (lower === "help") out = HELP;
    else if (lower === "about") out = [`${event.name} ${event.edition}: ${event.duration}, ${event.mode.toLowerCase()} ${event.format.toLowerCase()}.`, `Organized by ${event.organizer}, ${event.hostShort}.`, `Starts ${event.dateLabel}.`];
    else if (lower === "rules") out = event.rules.map((rule) => rule.text);
    else if (lower === "register") {
      window.location.href = event.registerUrl;
      setOpen(false);
      out = ["Opening registration."];
    } else if (lower === "hint") out = ["One flag hides in the page source.", "One speaks in the browser console.", "One answers a scan, rotated."];
    else if (lower === "scan") out = [`Signal found: ${SCAN_CLUE}`];
    else if (lower.startsWith("flag ")) out = [await submitFlag(command.slice(5).trim())];
    else out = [`command not found: ${command}`];

    setLines((current) => [
      ...current,
      { text: `$ ${command}`, tone: "smoke" },
      ...out.map((text) => ({ text })),
    ]);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Field terminal"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-4 top-24 bottom-8 z-50 mx-auto flex max-w-3xl flex-col border border-blood bg-ash/95 font-mono backdrop-blur-sm"
          data-lenis-prevent
        >
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-line pl-4 text-sm">
            <span className="text-ember">FIELD TERMINAL // operator@arena</span>
            <span className="flex items-center gap-3">
              FLAGS {found.length}/{FLAG_HASHES.length}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close terminal" className="h-11 w-11 hover:text-ember">
                x
              </button>
            </span>
          </div>
          <div ref={log} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto p-4 leading-7 whitespace-pre-wrap">
            {lines.map((line, i) => (
              <p key={i} className={line.tone === "ember" ? "text-ember" : line.tone === "smoke" ? "text-smoke" : ""}>
                {line.text}
              </p>
            ))}
          </div>
          <form
            className="flex h-13 shrink-0 items-center gap-3 border-t border-line px-4"
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
              setValue("");
            }}
          >
            <span className="text-ember">$</span>
            <input
              ref={input}
              aria-label="Terminal command"
              autoComplete="off"
              spellCheck={false}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="try help"
              className="h-11 flex-1 bg-transparent outline-none placeholder:text-smoke"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
