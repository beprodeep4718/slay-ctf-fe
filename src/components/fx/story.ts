"use client";

import { useSyncExternalStore } from "react";

export const CHAPTERS = [
  { id: "top", label: "Drop" },
  { id: "about", label: "Mission" },
  { id: "tracks", label: "Loadout" },
  { id: "timeline", label: "Battle plan" },
  { id: "prizes", label: "Spoils" },
  { id: "intel", label: "Field intel" },
  { id: "rules", label: "Rules" },
  { id: "register", label: "Final strike" },
];

// Read every frame by the 3D camera, so it stays outside React state.
export const story = { dive: 0 };

export const STRIKE_EVENT = "slay:strike";

export function strikeCore(count: number) {
  window.dispatchEvent(new CustomEvent(STRIKE_EVENT, { detail: count }));
}

const KEY = "slay-loadout";

type State = { loadout: number | null; breached: boolean };

const SERVER_STATE: State = { loadout: null, breached: false };
let state: State | null = null;
const listeners = new Set<() => void>();

function current() {
  if (state) return state;
  let loadout: number | null = null;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) loadout = Number(saved);
  } catch {}
  state = { loadout, breached: false };
  return state;
}

function update(next: Partial<State>) {
  state = { ...current(), ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStory() {
  return useSyncExternalStore(subscribe, current, () => SERVER_STATE);
}

export function armWeapon(index: number) {
  update({ loadout: index });
  try {
    localStorage.setItem(KEY, String(index));
  } catch {}
}

export function breachCore() {
  update({ breached: true });
  strikeCore(6);
}
