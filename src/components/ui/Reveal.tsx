"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";

/** Fades content up the first time it scrolls into view. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0, ...rest }: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}
