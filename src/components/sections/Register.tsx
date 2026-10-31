import Image from "next/image";
import { event } from "@/config/event";
import { Magnetic } from "@/components/fx/Magnetic";
import { Arena } from "@/components/fx/Scenes";
import { Breach } from "./Breach";

type Partner = { name: string; url: string; logo: string; width: number; height: number; dark?: boolean };

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${partner.name}`}
      className={`flex h-24 w-full items-center justify-center border border-line p-5 hover:border-ember sm:w-56 ${
        partner.dark ? "bg-ash" : "bg-bone"
      }`}
    >
      <Image
        src={partner.logo}
        alt={partner.name}
        width={partner.width}
        height={partner.height}
        className="max-h-14 w-auto object-contain"
      />
    </a>
  );
}

export function Register() {
  const { poweredBy, supportedBy } = event.partners;
  return (
    <section id="register">
      <div className="px-5 py-12 md:px-12">
        <p className="font-mono text-sm text-ember">{"// BACKED BY"}</p>
        <div className="mt-4 flex flex-wrap gap-10">
          <div>
            <p className="mb-3 font-mono text-sm text-smoke">Powered by</p>
            <div className="flex flex-wrap gap-4">
              {poweredBy.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <p className="mb-3 font-mono text-sm text-smoke">Supported by</p>
            <div className="flex flex-wrap gap-4">
              {supportedBy.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
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
