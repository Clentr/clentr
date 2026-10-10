"use client";

import { useState } from "react";
import { process } from "@/content/site";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";

/** Four stages; the selected one opens up with its artefact. */
export function Process() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead
          id="process-title"
          chip="Process"
          icon="git-pull-request"
          title="From first sketch to"
          dim="shipped."
          lead="Four stages, small visible increments, no surprises. Each stage opens up as we get there."
        />
        <div className="rail" aria-hidden="true">
          <i style={{ left: `${open * 25}%` }} />
        </div>
        <div className="process">
          {process.map((s, i) => (
            <div
              key={s.n}
              className="stage card"
              role="button"
              tabIndex={0}
              aria-expanded={open === i}
              aria-label={`${s.title}, ${s.when}`}
              onClick={() => setOpen(i)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(i))}
            >
              <div className="stage__info">
                <span className="icon-tile">
                  <Icon name={s.icon} />
                </span>
                <span className="stage__when">
                  {s.n} &nbsp;·&nbsp; {s.when}
                </span>
                <h3 className="stage__title">{s.title}</h3>
                <p className="stage__body">{s.body}</p>
                <ul className="stage__outputs">
                  {s.outputs.map((o) => (
                    <li key={o}>
                      <Icon name="circle-check" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="stage__visual" aria-hidden="true">
                <Art name={`process-${i}`} alt="" className="invert-dark" sizes="276px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
