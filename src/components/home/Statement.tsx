"use client";

import { useEffect, useRef } from "react";
import { tools } from "@/content/site";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";

// The first clause is always lit; the rest lights up as the paragraph scrolls by.
const LEAD = 9;
const TEXT =
  "We design and build software end to end, with the same care for empty states, error messages and slow networks as for the launch screen. Design and engineering stay in the same hands.";

/** Tools marquee, then a statement whose words light up as it scrolls through. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = TEXT.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll("span"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      spans.forEach((s) => s.classList.add("on"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("on", i < Math.max(LEAD, lit)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="container">
      <div className="tools">
        <span className="tools__label">
          <Icon name="code-xml" />
          TOOLS WE TRUST IN PRODUCTION
        </span>
        <div className="tools__rail">
          <div className="tools__track">
            {[...tools, ...tools].map((t, i) => (
              <Art key={`${t}-${i}`} name={`tool-${t}`} themed alt={i < tools.length ? t : ""} sizes="64px" />
            ))}
          </div>
        </div>
      </div>
      <p className="statement" ref={ref}>
        {words.map((w, i) => (
          <span key={i} className={i < LEAD ? "on" : undefined}>
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
