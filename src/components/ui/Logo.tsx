import Link from "next/link";
import { useId } from "react";

/**
 * The Clentr mark: a handwritten lowercase "c" drawn in one stroke, finishing in a
 * signature flourish. `pathLength` is normalised so the stroke can be drawn on.
 */
export const MARK_PATH = "M36 15 C30 8 11 9 10 24 C9 38 24 42 33 33 C37 29 41 33 44 30";

export function Mark({ className, ink, width = 6.5 }: { className?: string; ink?: string; lit?: string; width?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      {!ink && (
        <defs>
          <linearGradient id={`m${id}`} x1="0.1" y1="0.1" x2="0.9" y2="0.9">
            <stop offset="0" style={{ stopColor: "var(--brand-a, #2d46ff)" }} />
            <stop offset="1" style={{ stopColor: "var(--brand-b, #3fa2ff)" }} />
          </linearGradient>
        </defs>
      )}
      <path
        d={MARK_PATH}
        pathLength={1}
        stroke={ink ?? `url(#m${id})`}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Lockup({ href = "/", label = "Clentr — home" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="lockup" aria-label={label}>
      <Mark />
      clentr
    </Link>
  );
}
