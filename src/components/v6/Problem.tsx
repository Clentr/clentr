import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/cms";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import { BookCall } from "../ui/BookCall";

/**
 * The three ways first products break. As each row scrolls in, the problem is struck
 * through and Clentr's answer slides in beside it.
 */
export function Problem({ c }: { c: SiteContent["problem"] }) {
  return (
    <section className="section problem7" aria-labelledby="problem-title">
      <div className="container">
        <SectionHead id="problem-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead || undefined} />
        <ol className="problem7__list">
          {c.items.map((it, i) => (
            <Reveal as="li" key={`${it.title}-${i}`} className="problem7__row" style={{ "--i": i } as CSSProperties}>
              <span className="problem7__n">0{i + 1}</span>
              <div className="problem7__issue">
                <h3>
                  <span>{it.title}</span>
                </h3>
                <p>{it.body}</p>
              </div>
              <span className="problem7__arrow" aria-hidden="true">
                <Icon name="arrow-right" />
              </span>
              <p className="problem7__fix">
                <span className="problem7__tick" aria-hidden="true">
                  <Icon name="check" strokeWidth={2.4} />
                </span>
                <span>
                  <small>With Clentr</small>
                  {(it as { fix?: string }).fix}
                </span>
              </p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="problem7__answer" delay={120}>
          <span className="problem7__mark" aria-hidden="true">
            <Mark />
          </span>
          <p>
            {c.resolve} <span>{c.resolveDim}</span>
          </p>
          <BookCall where="problem" className="btn btn--accent btn--sm">
            <Icon name="calendar" />
            Request a call
            <Icon name="arrow-up-right" className="arrow" />
          </BookCall>
        </Reveal>
      </div>
    </section>
  );
}
