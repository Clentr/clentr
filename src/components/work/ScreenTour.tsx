"use client";

import { useRef, useState, type ReactNode } from "react";
import { Icon } from "../ui/Icon";

/** Many screens: a row of iPhones or windows you swipe (or arrow) through, instead of a wall of them. */
export function ShotRow({ children, name, kind }: { children: ReactNode; name: string; kind: "phone" | "wide" }) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<"start" | "mid" | "end">("start");
  const onScroll = () => {
    const r = row.current;
    if (!r) return;
    setEdge(r.scrollLeft < 8 ? "start" : r.scrollLeft + r.clientWidth >= r.scrollWidth - 8 ? "end" : "mid");
  };
  const step = (d: 1 | -1) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className={`prow prow--${kind}`} role="region" aria-label={kind === "phone" ? `${name} phone screens` : `${name} screens`}>
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
