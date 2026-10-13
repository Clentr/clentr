import type { SiteContent } from "@/content/cms";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import { GenericScene } from "./GenericScene";
import { SERVICE_SCENES } from "./ServiceScenes";

export function Services({ c }: { c: SiteContent["services"] }) {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead id="services-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead} />
        <div className="services">
          {c.items.map((s, i) => {
            const Scene = SERVICE_SCENES[s.key as keyof typeof SERVICE_SCENES];
            return (
              <Reveal
                as="article"
                key={`${s.key}-${i}`}
                className="service card"
                delay={(i % 4) * 60}
              >
                <div className="service__stage" aria-hidden="true">
                  {s.image ? <GenericScene image={s.image} icon={s.icon} /> : Scene ? <Scene /> : <GenericScene icon={s.icon} />}
                </div>
                <div className="service__row">
                  <span className="icon-tile">
                    <Icon name={s.icon} />
                  </span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
