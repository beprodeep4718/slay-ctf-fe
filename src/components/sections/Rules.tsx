import { event } from "@/config/event";
import { Heading } from "./Section";

export function Rules() {
  return (
    <section id="rules" className="px-5 py-24 md:px-12 md:py-32">
      <Heading kicker="06 RULES OF ENGAGEMENT">Know the rules</Heading>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:pr-16">
        <ol className="flex flex-col gap-3">
          {event.rules.map((rule, i) => (
            <li key={rule.title} className="border border-line bg-ash p-5">
              <p className="font-mono text-ember">
                0{i + 1} {rule.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-smoke">{rule.text}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-3">
          {event.faq.map((item) => (
            <details key={item.q} className="group border border-line bg-ash">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 p-5 font-mono">
                {item.q}
                <span className="text-ember group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-smoke">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
