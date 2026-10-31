"use client";

import { useEffect, useRef, useState } from "react";
import { strikeCore } from "@/features/story/story";
import { openTerminal } from "@/features/terminal/flags";
import {
  GRID_SIZE,
  LEVEL_COUNT,
  createLevel,
  formatTime,
  hasTarget,
  isOpen,
  rewardFlag,
  type Cell,
  type Level,
} from "./breach";

type Phase = "idle" | "playing" | "cleared" | "failed" | "won";

const KEY = "slay-breach-best";

const now = () => performance.now();

function saveBest(ms: number) {
  try {
    const saved = Number(localStorage.getItem(KEY));
    const best = saved > 0 ? Math.min(saved, ms) : ms;
    localStorage.setItem(KEY, String(best));
    return best;
  } catch {
    return ms;
  }
}

export function BreachGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);
  const [picks, setPicks] = useState<Cell[]>([]);
  const [left, setLeft] = useState(0);
  const [reason, setReason] = useState("");
  const [best, setBest] = useState(0);
  const [runTime, setRunTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const deadline = useRef(0);
  const spent = useRef(0);

  const ticking = phase === "playing" && picks.length > 0;

  useEffect(() => {
    if (!ticking) return;
    const timer = setInterval(() => {
      const remaining = deadline.current - now();
      setLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        setReason("Trace complete. The clock ran out.");
        setPhase("failed");
      }
    }, 100);
    return () => clearInterval(timer);
  }, [ticking]);

  function begin(index: number) {
    const next = createLevel(index);
    if (index === 0) spent.current = 0;
    setStage(index);
    setLevel(next);
    setPicks([]);
    setLeft(next.seconds * 1000);
    setCopied(false);
    setPhase("playing");
  }

  function choose(cell: Cell) {
    if (!level || phase !== "playing") return;
    if (!picks.length) deadline.current = now() + level.seconds * 1000;
    const next = [...picks, cell];
    setPicks(next);

    const buffer = next.map(({ row, col }) => level.grid[row][col]);
    if (hasTarget(buffer, level.target)) {
      spent.current += level.seconds * 1000 - Math.max(0, deadline.current - now());
      strikeCore(stage + 1);
      if (stage + 1 === LEVEL_COUNT) {
        setRunTime(spent.current);
        setBest(saveBest(spent.current));
        setPhase("won");
      } else {
        setPhase("cleared");
      }
    } else if (next.length === level.bufferSize) {
      setReason("Buffer full. The sequence never landed.");
      setPhase("failed");
    }
  }

  async function copyFlag() {
    try {
      await navigator.clipboard.writeText(rewardFlag());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const buffer = level ? picks.map(({ row, col }) => level.grid[row][col]) : [];
  const total = (level?.seconds ?? 1) * 1000;

  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14 lg:pr-16">
      <div
        role="group"
        aria-label="Hex matrix"
        className="mx-auto grid w-full max-w-[420px] gap-2 border border-line bg-ash p-3 lg:w-[420px]"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const cell = { row: Math.floor(i / GRID_SIZE), col: i % GRID_SIZE };
          const code = level?.grid[cell.row][cell.col] ?? "--";
          const used = picks.some((p) => p.row === cell.row && p.col === cell.col);
          const open = phase === "playing" && Boolean(level) && isOpen(picks, cell);
          return (
            <button
              key={i}
              type="button"
              disabled={!open}
              data-code={code}
              data-open={open || undefined}
              onClick={() => choose(cell)}
              aria-label={`Row ${cell.row + 1}, column ${cell.col + 1}, code ${code}${used ? ", used" : ""}`}
              className={`aspect-square font-mono text-lg font-bold transition-colors md:text-xl ${
                used
                  ? "bg-blood/30 text-smoke/50"
                  : open
                    ? "border border-ember bg-blood/15 text-bone hover:bg-blood hover:text-white"
                    : "border border-transparent text-smoke/70"
              }`}
            >
              {used ? "··" : code}
            </button>
          );
        })}
      </div>

      <div className="order-first flex flex-col gap-5 font-mono text-sm lg:order-none" aria-live="polite">
        <p className="text-smoke">
          LEVEL {stage + 1}/{LEVEL_COUNT}
          {level && ` · ${formatTime(left)}s`}
        </p>
        <div className="h-1 bg-line">
          <div className="h-full origin-left bg-blood" style={{ transform: `scaleX(${level ? left / total : 1})` }} />
        </div>

        <div>
          <p className="mb-2 text-ember">TARGET SEQUENCE</p>
          <div className="flex min-h-11 flex-wrap gap-1.5 md:gap-2" data-target>
            {(level?.target ?? ["--", "--", "--"]).map((code, i) => (
              <span key={i} className="flex size-10 items-center justify-center border border-ember text-sm font-bold md:size-11 md:text-base">
                {code}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-ember">BUFFER</p>
          <div className="flex min-h-11 flex-wrap gap-1.5 md:gap-2" data-buffer>
            {Array.from({ length: level?.bufferSize ?? 5 }, (_, i) => (
              <span
                key={i}
                className={`flex size-10 items-center justify-center border text-sm font-bold md:size-11 md:text-base ${
                  buffer[i] ? "border-blood bg-blood text-white" : "border-dashed border-line text-smoke"
                }`}
              >
                {buffer[i] ?? ""}
              </span>
            ))}
          </div>
        </div>

        {phase === "idle" && (
          <div className="flex flex-col items-start gap-4">
            <p className="max-w-md leading-relaxed text-smoke">
              Pick codes from the lit row, then the lit column, switching each time. Land the target sequence in order
              before the buffer fills. The clock starts on your first pick.
            </p>
            <button type="button" onClick={() => begin(0)} className="h-12 bg-blood px-6 font-bold text-white hover:bg-ember">
              START BREACH -&gt;
            </button>
          </div>
        )}

        {phase === "playing" && (
          <p className="max-w-md text-smoke">
            {picks.length % 2 === 0 ? "Pick from the lit row." : "Pick from the lit column."}
          </p>
        )}

        {phase === "cleared" && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-ember">SEQUENCE LANDED. Firewall {stage + 1} is down.</p>
            <button type="button" onClick={() => begin(stage + 1)} className="h-12 bg-blood px-6 font-bold text-white hover:bg-ember">
              NEXT LEVEL -&gt;
            </button>
          </div>
        )}

        {phase === "failed" && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-ember">{reason}</p>
            <button type="button" onClick={() => begin(stage)} className="h-12 border border-ember px-6 text-ember hover:bg-ember hover:text-void">
              RETRY LEVEL {stage + 1}
            </button>
          </div>
        )}

        {phase === "won" && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-ember">
              MATRIX BREACHED in {formatTime(runTime)}s · best {formatTime(best)}s
            </p>
            <p data-reward className="border border-ember bg-ash px-4 py-3 text-base font-bold break-all text-bone">
              {rewardFlag()}
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={copyFlag} className="h-11 border border-ember px-4 text-ember hover:bg-ember hover:text-void">
                {copied ? "COPIED" : "COPY FLAG"}
              </button>
              <button type="button" onClick={openTerminal} className="h-11 border border-ember px-4 text-ember hover:bg-ember hover:text-void">
                &gt;_ SUBMIT IN TERMINAL
              </button>
              <button type="button" onClick={() => begin(0)} className="h-11 px-4 text-smoke hover:text-bone">
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
