"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { projects } from "@/content/projects";
import { Button } from "../ui/Button";
import { ArrowDown } from "../ui/Icons";
import { ease, LineReveal } from "../ui/Reveal";

// Concentric, slightly irregular rings — reads as topography / signal, never as a "blob".
const RINGS = Array.from({ length: 16 }, (_, i) => {
  const r = 70 + i * 26;
  const pts = Array.from({ length: 73 }, (_, k) => {
    const a = (k / 72) * Math.PI * 2;
    const w = Math.sin(a * 3 + i * 0.35) * (4 + i * 0.9) + Math.sin(a * 5 - i * 0.2) * (2 + i * 0.4);
    return `${(500 + Math.cos(a) * (r + w)).toFixed(1)},${(500 + Math.sin(a) * (r + w) * 0.86).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
});

const CYCLE_MS = 3600;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ringsY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const ringsRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  // The light follows the pointer lazily; written straight to CSS variables to avoid re-renders.
  useEffect(() => {
    if (reduce) return;
    const el = lightRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--lx", `${(e.clientX / window.innerWidth) * 100}%`);
        el.style.setProperty("--ly", `${(e.clientY / window.innerHeight) * 100}%`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % projects.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reduce]);

  const p = projects[current];

  return (
    <section ref={ref} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg">
        <div ref={lightRef} className="hero__light" />
        <motion.svg
          className="hero__contours"
          viewBox="0 0 1000 1000"
          style={reduce ? undefined : { y: ringsY, rotate: ringsRotate }}
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease }}
        >
          {RINGS.map((d, i) => (
            <path key={i} d={d} className={i === 6 ? "is-accent" : undefined} />
          ))}
        </motion.svg>
      </div>

      <div className="container">
        <motion.div
          className="hero__top"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="label label--accent">
            <span className="dot" style={{ marginRight: 12 }} />
            Software engineering studio
          </span>
          <span className="label hide-sm">Mobile · Web · Applied AI · Native</span>
        </motion.div>

        <motion.h1 id="hero-title" className="display hero__title" style={reduce ? undefined : { y: titleY }}>
          <LineReveal
            delay={0.15}
            lines={[
              "We design and",
              <span key="l2" className="hero__line--indent">
                engineer software
              </span>,
              <>
                people <span className="serif">actually use.</span>
              </>,
            ]}
          />
        </motion.h1>

        <motion.div
          className="hero__foot"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.75 }}
        >
          <div className="hero__intro">
            <p className="lead" style={{ maxWidth: "30em" }}>
              Clentr is a product engineering studio. We take ideas from first sketch to shipped software — mobile
              apps, web platforms, desktop tools and AI systems.
            </p>
            <div className="hero__ctas">
              <Button href="#contact" variant="primary">
                Start a project
              </Button>
              <Button href="#work" icon={<ArrowDown />}>
                Explore our work
              </Button>
            </div>
          </div>

          <a href="#work" className="hero__panel glass" aria-label="Browse selected work">
            <div className="hero__panel-row">
              <span className="label">Recently built</span>
              <span className="label">
                {String(current + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <div className="hero__panel-stack">
              <AnimatePresence initial={false}>
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, ease }}
                >
                  <p className="hero__panel-name">{p.name}</p>
                  <p className="hero__panel-meta">
                    {p.kicker} · {p.platform}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="hero__panel-bar" aria-hidden="true">
              {projects.map((pr, i) => (
                <span key={pr.slug}>
                  <motion.i
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: i <= current ? 1 : 0 }}
                    transition={{
                      duration: i === current && !reduce ? CYCLE_MS / 1000 : 0.3,
                      ease: i === current ? "linear" : ease,
                    }}
                  />
                </span>
              ))}
            </div>
          </a>
        </motion.div>

        <div className="hero__scroll label" aria-hidden="true" style={{ marginTop: 28 }}>
          <span className="hero__scroll-line" /> Scroll
        </div>
      </div>
    </section>
  );
}
