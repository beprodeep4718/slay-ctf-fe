import { event } from "@/config/event";
import { Arena } from "@/components/fx/Scenes";
import { Countdown } from "./Countdown";

const TICKER = [event.dateLabel, event.prizePool, event.teamSize, event.location.toUpperCase()];

export function Hero() {
  return (
    <section id="top" className="relative h-svh min-h-[720px] overflow-hidden">
      <h1 className="absolute inset-x-5 top-24 flex justify-between font-display text-[27vw] leading-none font-black text-blood md:inset-x-12 md:top-[11vh] md:text-[26.4vw]">
        <span>SLAY</span>
        <span className="text-bone">CTF</span>
      </h1>
      <Arena className="absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-transparent to-void to-55% md:h-2/5 md:to-70%"
      />
      <div className="absolute inset-x-5 bottom-20 flex flex-col gap-6 md:inset-x-12 md:bottom-[84px] md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-4">
          <p className="font-mono text-sm text-ember">
            {"// "}{event.level.toUpperCase()} · {event.mode.toUpperCase()} BATTLEGROUND
          </p>
          <p className="max-w-[540px] text-base leading-normal md:text-xl">
            Teams enter the arena. One holds the core. Hosted at {event.host}.
          </p>
          <a
            href={event.registerUrl}
            className="flex h-14 items-center bg-blood px-9 font-mono text-base font-bold text-white hover:bg-ember md:h-[60px]"
          >
            ENTER THE ARENA -&gt;
          </a>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <p className="hidden font-mono text-sm text-smoke md:block">CLICK THE ARENA TO STRIKE</p>
          <Countdown />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-[52px] items-center overflow-hidden bg-blood font-mono text-sm font-bold whitespace-nowrap text-white">
        <div className="flex shrink-0 animate-marquee gap-12 pl-12">
          {[0, 1, 2, 3, 4, 5, 6, 7].flatMap((copy) =>
            TICKER.flatMap((item) => [
              <span key={`${copy}-${item}`}>{item}</span>,
              <span key={`${copy}-${item}-mark`}>{"///"}</span>,
            ]),
          )}
        </div>
      </div>
    </section>
  );
}
