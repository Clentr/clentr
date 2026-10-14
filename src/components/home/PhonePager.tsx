"use client";

import { useRef, useState, type ReactNode } from "react";

/** Home-screen pages you swipe through, with iOS page dots. The phone keeps its size however many apps there are. */
export function PhonePager({ pages }: { pages: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const onScroll = () => {
    const el = track.current;
    if (el) setAt(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" });
  return (
    <>
      <div className="phonehome__pages" ref={track} onScroll={onScroll}>
        {pages.map((p, i) => (
          <div key={i} className="phonehome__page" aria-hidden={i !== at} inert={i !== at}>
            {p}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div className="phonehome__dots" role="tablist" aria-label="Home screen pages">
          {pages.map((_, i) => (
            <button key={i} role="tab" aria-selected={i === at} aria-label={`Page ${i + 1}`} onClick={() => goTo(i)} />
          ))}
        </div>
      )}
    </>
  );
}
