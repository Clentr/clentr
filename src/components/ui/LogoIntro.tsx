"use client";

import { useEffect, useRef } from "react";
import { Mark } from "./Logo";

const SCALE = 3.4; // start size relative to the nav logo
const DRAW_MS = 1500; // handwriting + wordmark before the glide
const GLIDE_MS = 1100;

/**
 * Page-load intro: the full "c clentr" logo is handwritten large in the centre, then the page
 * fades in underneath while the logo glides up-left and shrinks into the nav logo slot.
 * Runs on every load; skipped with reduced motion. Shown only while <html data-intro> is set.
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
    // Pin the intro logo exactly over the nav logo, scaled up and centred on screen (no visible jump).
    const target = document.querySelector(".nav .lockup")?.getBoundingClientRect();
    if (target) {
      Object.assign(el.style, { left: `${target.left}px`, top: `${target.top}px`, width: `${target.width}px`, height: `${target.height}px` });
      const dx = window.innerWidth / 2 - (target.left + target.width / 2);
      const dy = window.innerHeight / 2 - (target.top + target.height / 2);
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${SCALE})`;
      el.classList.add("is-pinned");
    }
    timers.push(
      window.setTimeout(() => {
        veil.current?.classList.add("is-out");
        el.classList.add("is-gliding");
        el.style.transform = "none";
      }, DRAW_MS),
    );
    timers.push(window.setTimeout(finish, DRAW_MS + GLIDE_MS + 50));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="intro" aria-hidden="true" onClick={() => document.documentElement.removeAttribute("data-intro")}>
      <div ref={veil} className="intro__veil" />
      <div ref={logo} className="intro__logo lockup">
        <Mark />
        <span className="intro__word">clentr</span>
      </div>
    </div>
  );
}
