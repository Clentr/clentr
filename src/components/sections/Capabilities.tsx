"use client";

import type { ReactNode } from "react";
import { services } from "@/content/site";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

const GLYPHS: Record<(typeof services)[number]["id"], ReactNode> = {
  mobile: (
    <>
      <rect x="13" y="4" width="18" height="36" rx="4" />
      <path d="M19 9h6" />
      <circle cx="22" cy="34" r="1.5" />
    </>
  ),
  web: (
    <>
      <rect x="4" y="8" width="36" height="28" rx="3" />
      <path d="M4 15h36M9 11.5h1M13 11.5h1M10 22h14M10 27h22" />
    </>
  ),
  ai: (
    <>
      <circle cx="22" cy="22" r="6" />
      <circle cx="8" cy="10" r="2.5" />
      <circle cx="36" cy="10" r="2.5" />
      <circle cx="8" cy="34" r="2.5" />
      <circle cx="36" cy="34" r="2.5" />
      <path d="M10 12l7.5 6M34 12l-7.5 6M10 32l7.5-6M34 32l-7.5-6" />
    </>
  ),
  vision: (
    <>
      <path d="M3 22s7-12 19-12 19 12 19 12-7 12-19 12S3 22 3 22Z" />
      <circle cx="22" cy="22" r="6" />
      <path d="M4 6h6M4 6v6M40 6h-6M40 6v6M4 38h6M4 38v-6M40 38h-6M40 38v-6" />
    </>
  ),
  desktop: (
    <>
      <rect x="4" y="6" width="36" height="24" rx="3" />
      <path d="M16 38h12M22 30v8M10 13l5 4-5 4M19 21h8" />
    </>
  ),
  backend: (
    <>
      <ellipse cx="22" cy="9" rx="15" ry="5" />
      <path d="M7 9v13c0 2.8 6.7 5 15 5s15-2.2 15-5V9M7 22v13c0 2.8 6.7 5 15 5s15-2.2 15-5V22" />
    </>
  ),
};

// Feeds the card's spotlight position; the overlay sits inside the card, so write to its parent.
function onMove(e: React.PointerEvent<HTMLElement>) {
  const card = e.currentTarget.parentElement;
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Capabilities() {
  return (
    <section className="section" id="capabilities" aria-labelledby="capabilities-title">
      <div className="container">
        <SectionHead
          id="capabilities-title"
          index="02"
          label="Capabilities"
          aside={`${services.length} disciplines`}
          title={["One team, from", <span key="2"><span className="serif">interface</span> to infrastructure.</span>]}
          lead="Everything listed here is backed by something we have built and shipped — the work below is the evidence."
        />
        <div className="caps">
          {services.map((s, i) => (
            <Reveal key={s.id} className="cap" delay={(i % 3) * 0.06} as="article">
              <div onPointerMove={onMove} style={{ position: "absolute", inset: 0, zIndex: 1 }} aria-hidden="true" />
              <div className="cap__top">
                <svg className="cap__glyph" viewBox="0 0 44 44" aria-hidden="true">
                  {GLYPHS[s.id]}
                </svg>
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="cap__body">
                <h3 className="h3">{s.title}</h3>
                <p>{s.body}</p>
                <ul className="tags" aria-label={`${s.title} technologies`}>
                  {s.tags.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
