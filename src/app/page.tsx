import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { ContactCta } from "@/components/ui/ContactCta";
import { Hero } from "@/components/home/Hero";
import { Finder } from "@/components/home/Finder";
import { Statement } from "@/components/home/Statement";
import { Services } from "@/components/home/Services";
import { AiShowcase } from "@/components/home/AiShowcase";
import { Trust } from "@/components/home/Trust";
import { Principles } from "@/components/home/Principles";
import { Process } from "@/components/home/Process";
import { Faq } from "@/components/home/Faq";

export default function Home() {
  return (
    <div className="page">
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Finder />
        <Statement />
        <Services />
        <AiShowcase />
        <Trust />
        <Principles />
        <Process />
        <Faq />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
