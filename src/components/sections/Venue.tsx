import { event } from "@/config/event";
import { Heading, Reveal } from "./Section";

export function Venue() {
  const cards = [
    { label: "WHERE", value: `${event.host}, ${event.venue.address}` },
    { label: "GETTING THERE", value: event.venue.travel },
    { label: "STAY", value: event.venue.stay },
  ];

  return (
    <section id="venue" className="px-5 py-24 md:px-12 md:py-32">
      <Heading kicker="05 DROP ZONE">{event.location.split(",")[0]}</Heading>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.label} delay={i * 0.06} className="border border-line bg-ash p-5">
            <p className="font-mono text-sm text-ember">{card.label}</p>
            <p className="mt-3 text-lg leading-relaxed">{card.value}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
