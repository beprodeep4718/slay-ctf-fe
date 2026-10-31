import { event } from "@/config/event";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { Heading, Reveal } from "./Section";

const STATS = [
  { label: "LEVEL", value: event.level },
  { label: "MODE", value: event.mode },
  { label: "TEAMS", value: event.teamSize },
  { label: "DATE", value: event.dateLabel },
];

export function About() {
  return (
    <section id="about" className="px-5 py-24 md:px-12 md:py-32">
      <Heading kicker="01 THE MISSION">
        One arena. <span className="text-blood">One core.</span>
      </Heading>
      <Reveal>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed md:text-2xl">
          {event.name} is a national level Capture The Flag competition held on site at {event.host}.
          Teams from across the country fight through security challenges in one room, for one title.
        </p>
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.06} className="border border-line bg-ash p-5">
            <p className="font-mono text-sm text-ember">{stat.label}</p>
            <ScrambleText
              text={stat.value}
              className="mt-3 block font-display text-3xl font-black uppercase md:text-4xl"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
