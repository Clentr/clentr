import { Fragment, type ReactNode } from "react";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { MobileCta } from "@/components/ui/MobileCta";
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
import { CustomSection } from "@/components/home/CustomSection";
import { getSite } from "@/lib/content";
import { getWork } from "@/lib/projects";
import { Problem } from "@/components/v6/Problem";
import { OwnProducts } from "@/components/v6/OwnProducts";
import { Offers } from "@/components/v6/Offers";
import { ResourceHandoff } from "@/components/resources/ResourceHandoff";

/** The home page, in the order and with the sections chosen in the admin panel. */
export default async function Home() {
  const { content: c, layout, sections } = await getSite();
  // Clentr's own live products (DealsAmor and NDA work are client projects).
  const ownApps = (await getWork()).mobileApps.filter((p) => p.slug !== "dealsamor" && !p.nda);
  const builtIn: Record<string, () => ReactNode> = {
    hero: () => <Hero c={c.hero} />,
    problem: () => <Problem c={c.problem} />,
    own: () => <OwnProducts c={c.own} apps={ownApps} />,
    offers: () => <Offers c={c.offers} />,
    work: () => <Finder c={c.work} email={c.contact.email} />,
    statement: () => <Statement c={c.statement} />,
    services: () => <Services c={c.services} />,
    ai: () => <AiShowcase c={c.ai} />,
    trust: () => <Trust c={c.trust} />,
    principles: () => <Principles c={c.principles} />,
    process: () => <Process c={c.process} />,
    faq: () => <Faq c={c.faq} email={c.contact.email} />,
    cta: () => <ContactCta c={c.cta} />,
  };
  const custom = new Map(sections.map((s) => [`s:${s.id}`, s]));

  return (
    <div className="page">
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main>
        {layout.order
          .filter((id) => !layout.hidden.includes(id))
          .map((id) => {
            const s = custom.get(id);
            if (s) return <CustomSection key={id} s={s} />;
            const render = builtIn[id];
            return render ? <Fragment key={id}>{render()}</Fragment> : null;
          })}
      </main>
      <Footer />
      <MobileCta />
      <ResourceHandoff />
    </div>
  );
}
