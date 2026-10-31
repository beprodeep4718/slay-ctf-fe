import { event } from "@/config/event";
import { Heading, Reveal } from "@/components/ui/Section";

export function Intel() {
  return (
    <section id="intel" className="px-5 py-24 md:px-12 md:py-32">
      <Heading kicker="05 FIELD INTEL">Know the battlefield</Heading>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:pr-16">
        {event.intel.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.06} className="border border-line bg-ash p-5">
            <p className="font-mono text-sm text-ember">{item.label}</p>
            <p className="mt-3 font-display text-3xl leading-none font-black md:text-4xl">{item.value}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
