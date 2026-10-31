import { event } from "@/config/event";
import { Magnetic } from "@/components/motion/Magnetic";
import { Arena } from "@/features/arena/Scenes";
import { Breach } from "@/features/story/Breach";

export function Register() {
  return (
    <section id="register">
      <div className="relative h-[680px] overflow-hidden">
        <Arena className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-void from-40% to-transparent md:w-3/5"
        />
        <div className="absolute top-14 left-5 flex flex-col items-start gap-5 md:left-12">
          <h2 className="font-display text-7xl leading-[0.88] font-black md:text-[124px]">
            THE ARENA
            <br />
            <span className="text-blood">AWAITS</span>
          </h2>
          <p className="font-mono text-sm text-smoke">
            {event.teamSize} · {event.duration} · {event.format} · {event.dateLabel}
          </p>
          <Magnetic>
            <a
              href={event.registerUrl}
              className="flex h-[60px] items-center bg-blood px-9 font-mono font-bold text-white hover:bg-ember"
            >
              ENTER THE ARENA -&gt;
            </a>
          </Magnetic>
          <Breach />
        </div>
      </div>
    </section>
  );
}
