// Single source for every event fact on the site.
export const event = {
  name: "Slay CTF",
  edition: "2026",
  host: "Jalpaiguri Government Engineering College",
  hostShort: "JGEC",
  hostDetails: [
    "Autonomous Premier Engineering Institute, Estd. 1961",
    "Govt. of West Bengal · MAKAUT Affiliated",
    "JGEC Campus, Jalpaiguri, WB 735102, India",
  ],
  hostUrl: "https://jgec.ac.in",
  organizer: "Zero Logon",
  organizerRole: "the official cybersecurity club of Jalpaiguri Government Engineering College",
  location: "Jalpaiguri, West Bengal",
  coordinates: "26.5447 N 88.7061 E",
  mode: "Online",
  level: "National level",
  format: "Jeopardy",
  duration: "3 hours",
  flagFormat: "SLAY{flag}",

  startsAt: "2026-11-19T10:00:00+05:30",
  dateLabel: "19 NOV 2026 · 10:00 IST",

  registerUrl: "http://172.105.253.47/#auth",

  teamSize: "1 to 3 members",

  perks: [
    {
      title: "Goodies & swags",
      text: "Custom retro hoodies, high-grade stickers and collectible metal lapel pins for podium squads.",
    },
    {
      title: "Certificates",
      text: "Official rank credentials and participation certificates validated by Zero Logon and JGEC.",
    },
    {
      title: "Exam vouchers",
      text: "Sponsored industry certification vouchers covering recognized cybersecurity exam tracks.",
    },
    {
      title: "Exclusive discounts",
      text: "Coupons across practical training labs and subscription tiers.",
    },
    {
      title: "Lots of fun",
      text: "High-octane 3-hour hackathon rush with live scoreboard swings.",
    },
  ],

  tracks: [
    {
      name: "Web Exploitation",
      blurb: "Web vulnerabilities, auth bypasses and injection flaws.",
      tools: ["Burp Suite", "Source Code", "DevTools", "SQLMap"],
    },
    {
      name: "Binary Exploitation",
      blurb: "Buffer overflows, memory corruption and ROP chain constructs.",
      tools: ["GDB-Pwndbg", "Pwntools", "Checksec", "ROPgadget"],
    },
    {
      name: "Cryptography",
      blurb: "Broken ciphers, key exchanges and mathematical flaws.",
      tools: ["CyberChef", "SageMath", "RsaCtfTool", "Hashcat"],
    },
    {
      name: "Forensics",
      blurb: "PCAP network streams, memory dumps and disk images.",
      tools: ["Wireshark", "Volatility", "Binwalk", "Exiftool"],
    },
    {
      name: "Reverse Engineering",
      blurb: "Disassembling compiled binaries, decompilers and bytecode inspection.",
      tools: ["Ghidra", "IDA Free", "Radare2", "Cutter"],
    },
    {
      name: "Much More",
      blurb: "OSINT investigation, cloud misconfigurations, hardware logic and wildcards.",
      tools: ["OSINT Recon", "Cloud IAM", "Steganography", "Logic Flaws"],
    },
  ],

  phases: [
    { word: "Recon", title: "Create your account", when: "REGISTRATION OPEN" },
    { word: "Assemble", title: "Set up or join a squad of 1 to 3", when: "BEFORE KICKOFF" },
    { word: "Breach", title: "Challenges go live", when: "19 NOV 2026 · 10:00 IST" },
    { word: "Slain", title: "3 hours later, the clock runs out", when: "19 NOV 2026 · 13:00 IST" },
  ],

  intel: [
    { label: "START", value: "19 November 2026" },
    { label: "DURATION", value: "3 hours" },
    { label: "FORMAT", value: "Jeopardy online" },
    { label: "TEAMS", value: "1 to 3 members" },
    { label: "FLAG", value: "SLAY{flag}" },
    { label: "NOTICE", value: "DoS attacks prohibited" },
  ],

  rules: [
    {
      title: "Infrastructure Immunity",
      text: "Do not attack CTF infrastructure. Denial of service brings disqualification.",
    },
    {
      title: "Flag Sharing Prohibited",
      text: "Flag sharing or collusion between teams is forbidden. Exchanging solutions causes removal.",
    },
    {
      title: "Team Composition Limits",
      text: "Teams consist of 1 to 3 individuals with single accounts.",
    },
    {
      title: "Flag Format Compliance",
      text: "Valid flags match format SLAY{flag}. Brute force is blocked.",
    },
    {
      title: "Container Lifecycle",
      text: "Challenge instances expire after 15 minutes of inactivity.",
    },
    {
      title: "Adjudication & Support",
      text: "Report challenge issues via organizer support tickets. Admin decisions are final.",
    },
  ],

  faq: [
    {
      q: "Is the event online?",
      a: "Yes. Slay CTF is an online jeopardy tournament, so you can compete from anywhere.",
    },
    { q: "How big can a team be?", a: "Teams consist of 1 to 3 individuals with single accounts." },
    { q: "How long does it run?", a: "3 hours, starting 19 November 2026 at 10:00 IST." },
    { q: "How do I get a team?", a: "After creating an account, you set up or join your squad." },
    { q: "Who do I contact?", a: "Email contact@zerologon.co.in, or use support tickets during the event." },
  ],

  partners: {
    poweredBy: [{ name: "Unstop", url: "https://unstop.com", logo: "/partners/unstop.png", width: 1024, height: 407 }],
    supportedBy: [
      { name: "PortSwigger", url: "https://portswigger.net", logo: "/partners/portswigger.png", width: 738, height: 159 },
      { name: "Hackviser", url: "https://hackviser.com", logo: "/partners/hackviser.png", width: 1024, height: 175, dark: true },
    ],
  },

  contact: {
    email: "contact@zerologon.co.in",
    linkedin: "https://www.linkedin.com/company/99856845",
    instagram: "https://www.instagram.com/cybercell.jgec/",
    instagramHandle: "@cybercell.jgec",
  },
};
