"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scrolling; skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      autoRaf: true,
      anchors: { offset: -88 },
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
