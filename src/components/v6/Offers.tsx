import type { ReactElement } from "react";
import type { SiteContent } from "@/content/cms";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import { BookCall } from "../ui/BookCall";

/* A small live diagram on each offer: the 8-week track, a pulse through an AI pipeline, a monthly release loop. */
function MvpTrack() {
  return (
    <div className="ovis ovis--mvp" aria-hidden="true">
      <div className="ovis__track">
        <span className="ovis__fill" />
        {["Discover", "Design", "Build", "Launch"].map((m, i) => (
          <span key={m} className="ovis__stop" style={{ ["--i" as string]: i }}>
            <i />
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
function AiPipe() {
  return (
    <div className="ovis ovis--ai" aria-hidden="true">
      {[["messages-square", "Ask"], ["brain-circuit", "Reason"], ["workflow", "Act"], ["shield-check", "Check"]].map(([ic, l], i) => (
        <span key={l} className="ovis__node" style={{ ["--i" as string]: i }}>
          <Icon name={ic} />
          <small>{l}</small>
        </span>
      ))}
      <span className="ovis__pulse" />
    </div>
  );
}
function PartnerLoop() {
  return (
    <div className="ovis ovis--partner" aria-hidden="true">
      {["v1.1", "v1.2", "v1.3", "v1.4"].map((v, i) => (
        <span key={v} className="ovis__rel" style={{ ["--i" as string]: i }}>
          <Icon name="rocket" />
          <b>{v}</b>
          <small>{["Fixes", "Onboarding", "Payments", "Growth"][i]}</small>
        </span>
      ))}
      <span className="ovis__loop">
        <Icon name="repeat" /> a release every week
      </span>
    </div>
  );
}
const VIS: Record<string, () => ReactElement> = { mvp: MvpTrack, ai: AiPipe, partner: PartnerLoop };

export function Offers({ c }: { c: SiteContent["offers"] }) {
  return (
    <section className="section offers6" id="how-we-work" aria-labelledby="offers-title">
      <div className="container">
        <SectionHead id="offers-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead} />
        <div className="offers6__grid">
          {c.items.map((o, i) => {
            const V = VIS[(o as { key?: string }).key ?? ""] ?? VIS[["mvp", "ai", "partner"][i]];
            return (
              <Reveal as="article" key={`${o.name}-${i}`} className="card offer6" delay={i * 90}>
                <div className="offer6__vis">{V && <V />}</div>
                <div className="offer6__head">
                  <h3>{o.name}</h3>
                  <span className="offer6__when">
                    <Icon name="clock" />
                    {o.when}
                  </span>
                </div>
                <p className="offer6__line">{o.tagline}</p>
                <p className="offer6__best">
                  <Icon name="users" />
                  <span>
                    <small>Best for</small>
                    {(o as { best?: string }).best}
                  </span>
                </p>
                <ul className="offer6__points">
                  {o.points.map((pt) => (
                    <li key={pt}>
                      <Icon name="check" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <BookCall where={`offer_${i}`} className="btn btn--sm btn--ghost offer6__cta">
                  Book a call
                  <Icon name="arrow-up-right" className="arrow" />
                </BookCall>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
