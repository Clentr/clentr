"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { SiteContent } from "@/content/cms";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { GenericScene } from "./GenericScene";
import { PROCESS_SCENES } from "./ProcessScenes";

// The four built-in stages keep their animations, matched by their original titles.
const SCENES: Record<string, (typeof PROCESS_SCENES)[number]> = {
  discover: PROCESS_SCENES[0],
  design: PROCESS_SCENES[1],
  build: PROCESS_SCENES[2],
  launch: PROCESS_SCENES[3],
};

function Scene({ s }: { s: SiteContent["process"]["items"][number] }) {
  const S = SCENES[s.title.trim().toLowerCase()];
  if (s.image || !S) return <GenericScene image={s.image || undefined} icon={s.icon} sizes="300px" />;
  return <S />;
}

const STAGE_MS = 5000;

/** Four stages that play through on their own; the open one shows the artefact it produces. */
export function Process({ c }: { c: SiteContent["process"] }) {
  const process = c.items;
  const [open, setOpen] = useState(0);
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Plays through the stages on its own while the section is on screen; hovering or clicking jumps ahead.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setOpen((o) => (o + 1) % process.length), STAGE_MS);
    return () => clearTimeout(t);
  }, [open, live, process.length]);

  return (
    <section ref={ref} className="section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead} />
        <div className={`rail rail--steps ${live ? "is-live" : ""}`} style={{ "--n": process.length, "--ms": `${STAGE_MS}ms` } as CSSProperties}>
          {process.map((s, i) => (
            <button
              type="button"
              key={`${s.n}-${i}`}
              className={i < open ? "is-done" : i === open ? "is-on" : ""}
              aria-label={`Show ${s.title}`}
              aria-pressed={i === open}
              onClick={() => setOpen(i)}
            >
              <i key={i === open ? `on-${open}` : "off"} />
              <em>{s.title}</em>
            </button>
          ))}
        </div>
        <div className="process">
          {process.map((s, i) => (
            <div
              key={`${s.n}-${i}`}
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
                {open === i && <Scene s={s} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
