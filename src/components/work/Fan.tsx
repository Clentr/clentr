"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Screen } from "@/content/projects";

/**
 * Featured screens arranged as a fan: the centre screen in front, the others
 * tilted behind it. As the panel scrolls through, the sides open slightly.
 */
export function Fan({ screens }: { screens: Screen[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], ["14%", "0%", "-5%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.5, 1], ["-14%", "0%", "5%"]);
  const lift = useTransform(scrollYProgress, [0, 1], [36, -36]);

  const motionStyle = (style: Record<string, unknown>) => (reduce ? undefined : style);

  if (screens.length >= 3) {
    const [a, b, c] = screens;
    return (
      <div ref={ref} className="fan fan--trio">
        <motion.div className="fan__shot fan__shot--left" style={motionStyle({ x: leftX })}>
          <Shot screen={a} sizes="(max-width: 900px) 30vw, 230px" />
        </motion.div>
        <motion.div className="fan__shot fan__shot--right" style={motionStyle({ x: rightX })}>
          <Shot screen={c} sizes="(max-width: 900px) 30vw, 230px" />
        </motion.div>
        <motion.div className="fan__shot fan__shot--center" style={motionStyle({ y: lift })}>
          <Shot screen={b} sizes="(max-width: 900px) 38vw, 290px" />
        </motion.div>
      </div>
    );
  }

  const [front, back] = screens;
  return (
    <div ref={ref} className="fan fan--duo">
      <motion.div className="fan__shot fan__shot--back" style={motionStyle({ x: rightX })}>
        <Shot screen={back} sizes="(max-width: 900px) 36vw, 260px" />
      </motion.div>
      <motion.div className="fan__shot fan__shot--front" style={motionStyle({ y: lift })}>
        <Shot screen={front} sizes="(max-width: 900px) 40vw, 290px" />
      </motion.div>
    </div>
  );
}

function Shot({ screen, sizes }: { screen: Screen; sizes: string }) {
  return (
    <div className="screen">
      <Image src={screen.src} alt={screen.alt} fill sizes={sizes} />
    </div>
  );
}
