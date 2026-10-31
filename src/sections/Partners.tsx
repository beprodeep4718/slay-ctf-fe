import Image from "next/image";
import { Heading, Reveal } from "@/components/ui/Section";
import { event } from "@/config/event";

type Partner = (typeof event.partners.supportedBy)[number];

function PartnerCard({ partner, featured = false }: { partner: Partner; featured?: boolean }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${partner.name}`}
      className="group block border border-line bg-ash transition duration-300 hover:-translate-y-1 hover:border-ember"
    >
      {/* Each panel matches its logo's own background, so no box shows around the mark. */}
      <span
        className={`flex h-36 items-center justify-center p-8 md:h-44 ${partner.dark ? "bg-black" : "bg-white"}`}
      >
        <Image
          src={partner.logo}
          alt={partner.name}
          width={partner.width}
          height={partner.height}
          sizes="280px"
          className={`w-auto max-w-full object-contain ${featured ? "max-h-20" : "max-h-14"}`}
        />
      </span>
      <span className="flex items-center justify-between gap-4 px-4 py-3 font-mono text-sm">
        <span className="font-bold text-bone">{partner.name}</span>
        <span className="text-smoke transition-colors group-hover:text-ember">
          {new URL(partner.url).hostname} -&gt;
        </span>
      </span>
    </a>
  );
}

export function Partners() {
  const { poweredBy, supportedBy, tagline } = event.partners;
  return (
    <section id="partners" className="px-5 py-24 md:px-12 md:py-32">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end lg:pr-16">
        <Heading kicker="08 ALLIANCES">Backed by</Heading>
        <p className="max-w-sm text-sm leading-relaxed text-smoke">{tagline}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:pr-16">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-ember">POWERED BY</p>
          {poweredBy.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} featured />
          ))}
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <p className="mb-3 font-mono text-sm text-ember">SUPPORTED BY</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {supportedBy.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-10 flex flex-col justify-between gap-4 border-t border-line pt-6 font-mono text-sm sm:flex-row sm:items-center lg:mr-16">
        <p className="text-smoke">Want your brand in the arena?</p>
        <a href={`mailto:${event.contact.email}`} className="font-bold text-ember hover:text-bone">
          PARTNER WITH US -&gt;
        </a>
      </div>
    </section>
  );
}
