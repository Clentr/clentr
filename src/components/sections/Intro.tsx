"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "../ui/Reveal";

const STATEMENT =
  "We build software end to end — design, engineering and everything between. We care as much about the empty state, the error message and the slow network as we do about the launch screen.";

const COLUMNS = [
  {
    k: "What we do",
    v: "Design, engineer and ship mobile apps, web platforms, desktop tools and AI-powered products.",
  },
  {
    k: "Who we work with",
    v: "Founders and teams who need a product built properly — the first version and the ones after it.",
  },
  {
    k: "How we differ",
    v: "Design and engineering in the same hands, so nothing gets lost between the mockup and the build.",
  },
];

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span className="w" style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

export function Intro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = STATEMENT.split(" ");

  return (
    <section className="section intro" aria-labelledby="intro-label">
      <div className="container">
        <div className="section-head__meta" style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
          <span className="label label--accent" id="intro-label">
            01 — Studio
          </span>
          <span className="label">Design × Engineering</span>
        </div>
        <p ref={ref} className="intro__statement">
          {reduce
            ? STATEMENT
            : words.map((w, i) => (
                <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
              ))}
        </p>
        <div className="intro__grid">
          {COLUMNS.map((c, i) => (
            <Reveal key={c.k} className="intro__col" delay={i * 0.08}>
              <span className="label">0{i + 1}</span>
              <h3>{c.k}</h3>
              <p className="body">{c.v}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
