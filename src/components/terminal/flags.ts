// SHA-256 of each flag, so the answers are not in the bundle. This is a game, not security.
export const FLAG_HASHES = [
  "dd0e25ef43726a1db7ab6a18bca76a528a97745ab2915ee917a18a16f08b1a42",
  "cb91cb8dbe05bde4ba03c1129f198b04fd98f10a252ceecc3a98f8cb7412a5f9",
  "c09d8a5e2401067341cc87c58c56a028d0eaa44a96e08cfefa42c1ecbb4689d6",
];

export const CONSOLE_CLUE = "736c61797b636f6e736f6c655f636f77626f797d";
export const SCAN_CLUE = "fynl{pber_pbagrfgrq}";

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
