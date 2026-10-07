"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Screen } from "@/content/projects";

const DESKTOP = "(min-width: 900px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * A product's screens in the order a user meets them.
 * Desktop: the strip glides sideways as the section scrolls past.
 * Touch / narrow: a native horizontal swipe with snapping.
 */
export function Flow({ screens, name }: { screens: Screen[]; name: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [overflow, setOverflow] = useState(0);
  const reduce = useReducedMotion();
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP).matches, () => true);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const measure = () => setOverflow(Math.max(0, track.scrollWidth - wrap.clientWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 65%", "end 25%"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);
  const glide = desktop && !reduce && overflow > 0;

  return (
    <div
      ref={wrapRef}
      className={`flow ${glide ? "flow--glide" : "flow--swipe"} ${overflow === 0 ? "flow--fit" : ""}`}
      role="region"
      aria-label={`${name} screens`}
      tabIndex={glide ? undefined : 0}
    >
      <motion.ol ref={trackRef} className="flow__track" style={glide ? { x } : undefined}>
        {screens.map((sc, i) => (
          <li key={sc.src} className="shot">
            <div className="shot__screen">
              <Image src={sc.src} alt={sc.alt} fill sizes="(max-width: 900px) 64vw, 280px" />
            </div>
            <p className="shot__caption">
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              {sc.caption}
            </p>
          </li>
        ))}
      </motion.ol>
    </div>
  );
}
