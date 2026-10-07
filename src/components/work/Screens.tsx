"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

type Shot = { src: string; alt: string };

// Each device drifts at its own rate, so the set reads as layered depth while scrolling.
const OFFSETS = [
  [60, -30],
  [-10, 30],
  [80, -50],
  [10, 40],
] as const;

function Device({ shot, i, progress, sizes, tall }: { shot: Shot; i: number; progress: MotionValue<number>; sizes: string; tall: boolean }) {
  const [from, to] = OFFSETS[i % OFFSETS.length];
  const y = useTransform(progress, [0, 1], [from, to]);
  return (
    <motion.div className="device" style={{ y }}>
      <Image src={shot.src} alt={shot.alt} width={tall ? 780 : 390} height={tall ? 1695 : 844} sizes={sizes} />
    </motion.div>
  );
}

export function Screens({ images, variant }: { images: Shot[]; variant: "feature" | "tall" | "phone" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useTransform(scrollYProgress, () => 0);
  const sizes = variant === "feature" ? "(max-width: 760px) 30vw, 260px" : "(max-width: 760px) 30vw, 230px";

  return (
    <div ref={ref} className={`screens screens--${variant} zoom`}>
      {images.map((shot, i) => (
        <Device key={shot.src} shot={shot} i={i} progress={reduce ? still : scrollYProgress} sizes={sizes} tall={variant === "tall"} />
      ))}
    </div>
  );
}
