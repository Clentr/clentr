"use client";

import { useEffect, useRef } from "react";
import { Mark } from "./Logo";

const DRAW_MS = 1500; // handwriting + wordmark before the glide
const GLIDE_MS = 1100;

/**
 * Page-load intro: the full "c clentr" logo is handwritten in the centre, then the page fades in
 * underneath while the logo glides up-left into the nav logo slot. The logo is drawn at its large
 * size and only ever scaled *down*, so it stays sharp. Runs on every load; skipped with reduced motion.
 */
export function LogoIntro() {
  const veil = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = logo.current;
    if (!root.dataset.intro || !el) return;
    const timers: number[] = [];
    const finish = () => {
      timers.forEach(clearTimeout);
      delete root.dataset.intro;
    };
    timers.push(
      window.setTimeout(() => {
        const target = document.querySelector(".nav .lockup")?.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        // Pin it where it is (px instead of centred %), then animate only the transform.
        Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, right: "auto", bottom: "auto", margin: "0", transformOrigin: "0 0" });
        void el.offsetWidth;
        if (target && r.width) {
          const k = target.width / r.width;
          const dx = target.left - r.left;
          const dy = target.top + target.height / 2 - (r.top + (r.height * k) / 2);
          el.style.transform = `translate(${dx}px, ${dy}px) scale(${k})`;
        }
        el.classList.add("is-gliding");
        veil.current?.classList.add("is-out");
      }, DRAW_MS),
    );
    timers.push(window.setTimeout(finish, DRAW_MS + GLIDE_MS + 50));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="intro" aria-hidden="true" onClick={() => document.documentElement.removeAttribute("data-intro")}>
      <div ref={veil} className="intro__veil" />
      <div ref={logo} className="intro__logo">
        <Mark />
        <span className="intro__word">clentr</span>
      </div>
    </div>
  );
}
