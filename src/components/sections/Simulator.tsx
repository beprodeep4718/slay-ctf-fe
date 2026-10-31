import { BreachGame } from "@/components/game/BreachGame";
import { Heading } from "./Section";

export function Simulator() {
  return (
    <section id="sim" className="px-5 py-24 md:px-12 md:py-32">
      <Heading kicker="07 LIVE FIRE">
        Breach the <span className="text-blood">matrix</span>
      </Heading>
      <p className="mt-4 max-w-2xl leading-relaxed text-smoke">
        Three firewalls stand between you and a hidden flag. Clear them all, then submit it in the terminal.
      </p>
      <BreachGame />
    </section>
  );
}
