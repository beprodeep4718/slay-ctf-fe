import { event } from "@/config/event";

const LINK = "underline-offset-4 hover:text-ember hover:underline";

export function Footer() {
  const { contact } = event;
  return (
    <footer className="border-t border-line px-5 py-10 font-mono text-sm leading-relaxed text-smoke md:px-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-bold text-bone">
            {event.name.toUpperCase()} {event.edition}
          </p>
          <p className="mt-2">
            Organized by {event.organizer}, {event.organizerRole} ({event.hostShort}).
          </p>
        </div>
        <div>
          <p className="font-bold text-bone">Host institution</p>
          <p className="mt-2">{event.host}</p>
          {event.hostDetails.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <a href={event.hostUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
            jgec.ac.in
          </a>
        </div>
        <div className="flex flex-col items-start">
          <p className="font-bold text-bone">Connect &amp; support</p>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={`mt-2 ${LINK}`}>
            LinkedIn: {event.organizer}
          </a>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={LINK}>
            Instagram: {contact.instagramHandle}
          </a>
          <a href={`mailto:${contact.email}`} className={LINK}>
            {contact.email}
          </a>
        </div>
      </div>
      <p className="mt-8 border-t border-line pt-6">
        © {event.edition} {event.organizer} {"//"} {event.host} ({event.hostShort}) · Flag format: {event.flagFormat} ·
        Timezone: IST (UTC+05:30)
      </p>
    </footer>
  );
}
