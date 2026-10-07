"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { process } from "@/content/site";
import { ease } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = process[active];

  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead
          id="process-title"
          index="06"
          label="Process"
          aside="Four stages"
          title={["From a rough idea", <span key="2">to a <span className="serif">live product.</span></span>]}
        />
        <div className="process__layout">
          <div className="process__sticky" aria-hidden="true">
            <div className="hero__panel-row">
              <span className="label label--accent">Stage</span>
              <span className="label">{step.title}</span>
            </div>
            <div className="process__big">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={step.n}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.7, ease }}
                >
                  {step.n}
                </motion.span>
              </AnimatePresence>
            </div>
            <div>
              <ul className="tags" style={{ marginBottom: 20 }}>
                {step.out.map((o) => (
                  <li key={o} className="tag">
                    {o}
                  </li>
                ))}
              </ul>
              <div className="process__progress">
                <motion.i style={{ scaleX: scrollYProgress }} />
              </div>
            </div>
          </div>

          <ol ref={listRef} className="process__steps">
            {process.map((s, i) => (
              <li key={s.n} data-step={i} className={`step ${i === active ? "is-active" : ""}`}>
                <span className="label label--accent">{s.n}</span>
                <h3 className="step__title">{s.title}</h3>
                <p className="lead">{s.body}</p>
                <ul className="tags">
                  {s.out.map((o) => (
                    <li key={o} className="tag">
                      {o}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
