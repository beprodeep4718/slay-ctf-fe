import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { BootSequence } from "@/features/story/BootSequence";
import { StoryHud } from "@/features/story/StoryHud";
import { Terminal } from "@/features/terminal/Terminal";
import { About } from "@/sections/About";
import { Hero } from "@/sections/Hero";
import { Intel } from "@/sections/Intel";
import { Prizes } from "@/sections/Prizes";
import { Register } from "@/sections/Register";
import { Rules } from "@/sections/Rules";
import { Simulator } from "@/sections/Simulator";
import { Timeline } from "@/sections/Timeline";
import { Tracks } from "@/sections/Tracks";

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
        <Intel />
        <Rules />
        <Simulator />
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
