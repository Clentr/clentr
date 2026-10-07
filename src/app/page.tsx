import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Capabilities } from "@/components/sections/Capabilities";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Principles } from "@/components/sections/Principles";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <div className="rails" aria-hidden="true">
        <div className="container" />
      </div>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Intro />
        <Capabilities />
        <Work />
        <Stack />
        <Principles />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
