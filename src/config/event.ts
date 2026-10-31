// Single source for every event fact on the site.
// Values in [BRACKETS] are placeholders waiting for the real details.
export const event = {
  name: "Slay CTF",
  host: "Jalpaiguri Government Engineering College",
  location: "Jalpaiguri, West Bengal",
  coordinates: "26.54 N 88.72 E",
  mode: "On site",
  level: "National level",

  // Set to an ISO date such as "2027-02-14T09:00:00+05:30" to start the countdown.
  startsAt: null as string | null,
  dateLabel: "[EVENT DATE]",

  // Replace "#register" with the external registration form URL.
  registerUrl: "#register",

  teamSize: "[TEAM SIZE]",
  eligibility: "[ELIGIBILITY]",
  entryFee: "[ENTRY FEE]",

  prizePool: "[PRIZE POOL]",
  prizes: [
    { rank: "02", amount: "[2ND PRIZE]", shape: 1 },
    { rank: "01", amount: "[1ST PRIZE]", shape: 6 },
    { rank: "03", amount: "[3RD PRIZE]", shape: 2 },
  ],

  tracks: [
    { name: "Web", blurb: "Break the apps everyone trusts." },
    { name: "Crypto", blurb: "Crack what was meant to stay secret." },
    { name: "Pwn", blurb: "Bend binaries to your will." },
    { name: "Reverse", blurb: "Read the machine backwards." },
    { name: "Forensics", blurb: "Pull the truth out of the wreckage." },
    { name: "OSINT", blurb: "Find what the internet forgot." },
  ],

  phases: [
    { word: "Recon", title: "Registration opens", when: "[REGISTRATION OPENS]" },
    { word: "Lockdown", title: "Team list closes", when: "[REGISTRATION CLOSES]" },
    { word: "Breach", title: "On-site CTF begins", when: "[EVENT START]" },
    { word: "Slain", title: "Winners announced", when: "[EVENT END]" },
  ],

  venue: {
    address: "[VENUE ADDRESS]",
    travel: "[TRAVEL DIRECTIONS]",
    stay: "[ACCOMMODATION DETAILS]",
  },

  rules: ["[RULE 1]", "[RULE 2]", "[RULE 3]"],

  faq: [
    { q: "Who can take part?", a: "[ELIGIBILITY]" },
    { q: "How big can a team be?", a: "[TEAM SIZE]" },
    { q: "Is there an entry fee?", a: "[ENTRY FEE]" },
    { q: "Is the event online?", a: "No. Slay CTF is held on site at Jalpaiguri Government Engineering College." },
  ],

  sponsors: ["[SPONSOR 1]", "[SPONSOR 2]", "[SPONSOR 3]", "[SPONSOR 4]"],
};
