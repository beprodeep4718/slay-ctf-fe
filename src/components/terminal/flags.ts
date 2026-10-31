// SHA-256 of each flag, so the answers are not in the bundle. This is a game, not security.
export const FLAG_HASHES = [
  "ae053338e9828ea5e464348f76125903726aad21ca61dcf1161f1127d1d45566",
  "043181f7734badb728a20ff656574c27879d089a5450d54a01e77080945f299f",
  "ad86e6f96d8efaf5f0e1b4cf002f4369cbaf9889e3bc18b2ce713569bf178097",
  "3e4f2500ae0c23414504fc89db21cb89ce3d1fb31a658900900bd7a12e524389",
];

export const CONSOLE_CLUE = "534c41597b636f6e736f6c655f636f77626f797d";
export const SCAN_CLUE = "FYNL{pber_pbagrfgrq}";

const OPEN_EVENT = "slay:terminal";

export function openTerminal() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenTerminal(listener: () => void) {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}

export async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
