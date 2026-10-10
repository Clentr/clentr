"use client";

import { useEffect, useRef, useState } from "react";
import { aiCapabilities } from "@/content/site";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";

const CYCLE_MS = 7000;

/** Six AI capabilities. Auto-advances while visible; pick one to stop. */
export function AiShowcase() {
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

  useEffect(() => {
    if (!auto || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => (v + 1) % aiCapabilities.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [i, auto, visible]);

  return (
    <section className="section" id="ai" aria-labelledby="ai-title">
      <div className="container">
        <SectionHead
          id="ai-title"
          chip="Applied AI"
          icon="sparkles"
          title="AI that does"
          dim="real work."
          lead="Six things we build for teams right now. Pick one — or let it play."
        />
        <div ref={ref} className={`ai card ${auto && visible ? "" : "ai--paused"}`}>
          <div className="ai__tabs" role="tablist" aria-label="AI capabilities">
            {aiCapabilities.map((c, k) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                id={`ai-tab-${c.key}`}
                aria-selected={k === i}
                aria-controls="ai-stage"
                className="ai__tab"
                onClick={() => {
                  setI(k);
                  setAuto(false);
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
          <div className="ai__stage invert-dark" id="ai-stage" role="tabpanel" aria-labelledby={`ai-tab-${aiCapabilities[i].key}`}>
            {aiCapabilities.map((c, k) => (
              <Art
                key={c.key}
                name={`ai-${c.key}`}
                alt={k === i ? `${c.title}: ${c.head}` : ""}
                className={k === i ? "is-on" : undefined}
                sizes="(max-width: 1024px) 90vw, 640px"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
