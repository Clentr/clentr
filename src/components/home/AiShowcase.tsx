"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/content/cms";
import { AI_SCENES } from "./AiScenes";
import { GenericScene } from "./GenericScene";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";

const CYCLE_MS = 5500;

/** Six AI capabilities. Auto-advances while visible; pick one to stop. */
export function AiShowcase({ c }: { c: SiteContent["ai"] }) {
  const aiCapabilities = c.items;
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the active chip in view on phones as it auto-advances.
  useEffect(() => {
    const tab = document.getElementById(`ai-tab-${i}`);
    const row = tab?.parentElement;
    if (tab && row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: tab.offsetLeft - 12, behavior: "smooth" });
  }, [i]);

  useEffect(() => {
    if (!auto || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => (v + 1) % aiCapabilities.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [i, auto, visible, aiCapabilities.length]);

  return (
    <section className="section" id="ai" aria-labelledby="ai-title">
      <div className="container">
        <SectionHead id="ai-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead} />
        <div ref={ref} className={`ai card ${auto && visible ? "" : "ai--paused"}`}>
          <div className="ai__tabs" role="tablist" aria-label="AI capabilities">
            {aiCapabilities.map((c, k) => (
              <button
                key={`${c.key}-${k}`}
                type="button"
                role="tab"
                id={`ai-tab-${k}`}
                aria-selected={k === i}
                aria-controls="ai-stage"
                className="ai__tab"
                onMouseEnter={() => {
                  if (!window.matchMedia("(hover: hover)").matches) return;
                  setI(k);
                  setAuto(false);
                }}
                onClick={() => {
                  setI(k);
                  // On phones a tap jumps to that system and the showcase keeps playing.
                  if (window.matchMedia("(hover: hover)").matches) setAuto(false);
                }}
              >
                <span className="ai__tab-row">
                  <span className="icon-tile">
                    <Icon name={c.icon} />
                  </span>
                  <span className="ai__tab-title">{c.title}</span>
                  <span className="ai__tab-n">{String(k + 1).padStart(2, "0")}</span>
                </span>
                <span className="ai__body" aria-hidden={k !== i}>
                  <span className="ai__inner">
                    <span className="ai__head">{c.head}</span>
                    <span className="ai__text">{c.body}</span>
                    <span className="ai__tags">
                      {c.tags.map((t) => (
                        <span key={t}>
                          <Icon name="check" />
                          {t}
                        </span>
                      ))}
                    </span>
                    {k === i && auto && (
                      <span className="ai__progress" aria-hidden="true">
                        <i key={i} />
                      </span>
                    )}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="ai__stage" id="ai-stage" role="tabpanel" aria-labelledby={`ai-tab-${i}`}>
            {aiCapabilities.map((c, k) => {
              const Scene = AI_SCENES[c.key as keyof typeof AI_SCENES];
              return (
                <div
                  key={`${c.key}-${k}`}
                  className={`ai__scene ${k === i ? "is-on" : ""}`}
                  role="img"
                  aria-label={`${c.title}: ${c.head}`}
                  aria-hidden={k !== i}
                >
                  {c.image ? <GenericScene image={c.image} icon={c.icon} sizes="640px" /> : Scene ? <Scene /> : <GenericScene icon={c.icon} />}
                </div>
              );
            })}
          </div>
          <div className="ai__mcopy" aria-hidden="true">
            <b>{aiCapabilities[i]?.head}</b>
            <p>{aiCapabilities[i]?.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
