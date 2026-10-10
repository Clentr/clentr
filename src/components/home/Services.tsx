import { services } from "@/content/site";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          id="services-title"
          chip="What we deliver"
          icon="layers"
          title="Everything it takes to"
          dim="ship."
          lead="Eight capabilities, one team. Design and engineering stay in the same hands from first sketch to launch."
        />
        <div className="services">
          {services.map((s, i) => (
            <Reveal as="article" key={s.key} className="service card" delay={(i % 4) * 60}>
              <div className="service__stage">
                <Art name={`svc-${s.key}`} themed alt="" sizes="(max-width: 560px) 90vw, 288px" />
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
          ))}
        </div>
      </div>
    </section>
  );
}
