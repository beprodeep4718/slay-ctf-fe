import { event } from "@/config/event";

export function Footer() {
  return (
    <footer className="flex flex-col justify-between gap-2 border-t border-line px-5 py-8 font-mono text-sm text-smoke md:flex-row md:px-12">
      <span>{event.name}</span>
      <span>{event.host}</span>
    </footer>
  );
}
