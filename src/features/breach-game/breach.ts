// Puzzle rules for the breach simulator, kept free of React so they stay easy to reason about.

const CODES = ["1C", "55", "7A", "BD", "E9", "FF"];
export const GRID_SIZE = 5;

const LEVELS = [
  { target: 3, slack: 2, seconds: 30 },
  { target: 4, slack: 2, seconds: 30 },
  { target: 5, slack: 2, seconds: 35 },
];
export const LEVEL_COUNT = LEVELS.length;

// Reversed base64, so the reward is not sitting in the bundle as plain text.
const REWARD = "==QfyVWehx2cfhXayRXYttXWBx0U";

export function rewardFlag() {
  return atob(REWARD.split("").reverse().join(""));
}

export type Cell = { row: number; col: number };
export type Level = { grid: string[][]; target: string[]; bufferSize: number; seconds: number };

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const same = (a: Cell, b: Cell) => a.row === b.row && a.col === b.col;
const indexes = Array.from({ length: GRID_SIZE }, (_, i) => i);

export function lineCells(picks: Cell[]): Cell[] {
  const last = picks.at(-1);
  // The first pick comes from the top row, then each pick switches row and column.
  if (!last) return indexes.map((col) => ({ row: 0, col }));
  return picks.length % 2 === 1
    ? indexes.map((row) => ({ row, col: last.col }))
    : indexes.map((col) => ({ row: last.row, col }));
}

export function isOpen(picks: Cell[], cell: Cell) {
  return lineCells(picks).some((c) => same(c, cell)) && !picks.some((c) => same(c, cell));
}

// Walks a legal route first and writes the target along it, so every level is solvable.
function walkRoute(length: number): Cell[] {
  const route: Cell[] = [];
  while (route.length < length) {
    const options = lineCells(route).filter((cell) => isOpen(route, cell));
    if (!options.length) return walkRoute(length);
    route.push(pick(options));
  }
  return route;
}

export function createLevel(index: number): Level {
  const { target, slack, seconds } = LEVELS[index];
  const grid = indexes.map(() => indexes.map(() => pick(CODES)));
  const route = walkRoute(target + slack);
  route.forEach(({ row, col }) => {
    grid[row][col] = pick(CODES);
  });
  const start = Math.floor(Math.random() * (slack + 1));
  return {
    grid,
    target: route.slice(start, start + target).map(({ row, col }) => grid[row][col]),
    bufferSize: target + slack,
    seconds,
  };
}

export function hasTarget(buffer: string[], target: string[]) {
  return buffer.join(" ").includes(target.join(" "));
}

export function formatTime(ms: number) {
  return (Math.max(0, ms) / 1000).toFixed(1);
}
