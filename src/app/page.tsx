import { BootSequence } from "@/components/fx/BootSequence";
import { Cursor } from "@/components/fx/Cursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import { Prizes } from "@/components/sections/Prizes";
import { Register } from "@/components/sections/Register";
import { Rules } from "@/components/sections/Rules";
import { StoryHud } from "@/components/sections/StoryHud";
import { Timeline } from "@/components/sections/Timeline";
import { Tracks } from "@/components/sections/Tracks";
import { Venue } from "@/components/sections/Venue";
import { Terminal } from "@/components/terminal/Terminal";

export default function Home() {
  return (
    <SmoothScroll>
      <BootSequence />
      <Nav />
      <main>
        <Hero />
        <About />
        <Tracks />
        <Timeline />
        <Prizes />
        <Venue />
        <Rules />
        <Register />
      </main>
      <Footer />
      <StoryHud />
      <Terminal />
      <Cursor />
      <div aria-hidden="true" className="scanlines pointer-events-none fixed inset-0 z-40" />
    </SmoothScroll>
  );
}
