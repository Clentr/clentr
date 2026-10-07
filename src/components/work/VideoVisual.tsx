"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Muted loop that only plays while on screen. Reduced motion shows the poster with controls. */
export function VideoVisual({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div className="video-frame zoom">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        controls={!!reduce}
        aria-label={alt}
      />
    </div>
  );
}
