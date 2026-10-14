"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "../ui/Icon";

/**
 * Many web screens, one window: the current screen large, numbered chapters underneath.
 * Arrows, the chapter strip or ←/→ move through it. Only nearby screens are mounted.
 */
export function ScreenTour({ slides, thumbs, captions, name }: { slides: ReactNode[]; thumbs: ReactNode[]; captions: (string | undefined)[]; name: string }) {
  const [at, setAt] = useState(0);
  const strip = useRef<HTMLOListElement>(null);
  const n = slides.length;
  const go = (i: number) => setAt((i + n) % n);

  // Keep the active chapter in view inside the strip (without scrolling the page).
  useEffect(() => {
    const el = strip.current?.children[at] as HTMLElement | undefined;
    const s = strip.current;
    if (el && s) s.scrollTo({ left: el.offsetLeft - (s.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  }, [at]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(at + 1);
    else if (e.key === "ArrowLeft") go(at - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="tour" role="region" aria-roledescription="carousel" aria-label={`${name} screens`} onKeyDown={onKey}>
      <div className="tour__stage">
        {slides.map((s, i) =>
          Math.abs(i - at) <= 1 || (at === 0 && i === n - 1) || (at === n - 1 && i === 0) ? (
            <div key={i} className={`tour__slide ${i === at ? "is-on" : ""}`} aria-hidden={i !== at}>
              {s}
            </div>
          ) : null,
        )}
        <button type="button" className="tour__nav tour__nav--prev" onClick={() => go(at - 1)} aria-label="Previous screen">
          <Icon name="arrow-left" />
        </button>
        <button type="button" className="tour__nav tour__nav--next" onClick={() => go(at + 1)} aria-label="Next screen">
          <Icon name="arrow-right" />
        </button>
      </div>
      <div className="tour__now" aria-live="polite">
        <span className="tour__count">
          {String(at + 1).padStart(2, "0")} <i>/ {String(n).padStart(2, "0")}</i>
        </span>
        <b>{captions[at] ?? `Screen ${at + 1}`}</b>
      </div>
      <ol className="tour__strip" ref={strip}>
        {thumbs.map((t, i) => (
          <li key={i}>
            <button type="button" aria-current={i === at ? "true" : undefined} onClick={() => setAt(i)} aria-label={`Screen ${i + 1}${captions[i] ? `: ${captions[i]}` : ""}`}>
              <span className="tour__thumb">{t}</span>
              <span className="tour__label">
                <em>{String(i + 1).padStart(2, "0")}</em>
                {captions[i] ?? `Screen ${i + 1}`}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Many phone screens: a row of iPhones you swipe (or arrow) through, instead of a wall of them. */
export function PhoneRow({ children, name }: { children: ReactNode; name: string }) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<"start" | "mid" | "end">("start");
  const onScroll = () => {
    const r = row.current;
    if (!r) return;
    setEdge(r.scrollLeft < 8 ? "start" : r.scrollLeft + r.clientWidth >= r.scrollWidth - 8 ? "end" : "mid");
  };
  const step = (d: 1 | -1) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="prow" role="region" aria-label={`${name} phone screens`}>
      <div className="prow__track" ref={row} onScroll={onScroll}>
        {children}
      </div>
      <div className="prow__ctrl">
        <button type="button" className="tour__nav" onClick={() => step(-1)} disabled={edge === "start"} aria-label="Previous screens">
          <Icon name="arrow-left" />
        </button>
        <button type="button" className="tour__nav" onClick={() => step(1)} disabled={edge === "end"} aria-label="More screens">
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}
