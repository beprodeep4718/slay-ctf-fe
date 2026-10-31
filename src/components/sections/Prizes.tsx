import { event } from "@/config/event";
import { Weapon } from "@/components/fx/Scenes";
import { Heading, Reveal } from "./Section";

export function Prizes() {
  return (
    <section id="prizes" className="px-5 py-24 md:px-12 md:py-32">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <Heading kicker="04 THE SPOILS">Claim the relics</Heading>
        <p className="font-display text-6xl leading-[0.9] font-black text-blood md:text-8xl">{event.prizePool}</p>
      </div>
      <div className="mt-8 grid items-end gap-8 text-center md:grid-cols-3">
        {event.prizes.map((prize, i) => {
          const first = prize.rank === "01";
          return (
            <Reveal key={prize.rank} delay={i * 0.1} className={first ? "order-first md:order-none" : ""}>
              <Weapon
                shape={prize.shape}
                className={`mx-auto aspect-square w-full ${first ? "max-w-[340px]" : "max-w-[260px]"}`}
              />
              <p className="font-mono text-sm text-ember">RANK {prize.rank}</p>
              <p className={`font-display font-black ${first ? "text-7xl text-blood" : "text-5xl"}`}>{prize.amount}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
