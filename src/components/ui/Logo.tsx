import Link from "next/link";

/**
 * The Clentr mark: eight cells on a 3×3 grid. The right-middle cell is
 * removed so the grid reads as a C; the centre cell — the client — is lit.
 */
const CELLS = [
  [0, 0], [10, 0], [20, 0],
  [0, 10], [10, 10],
  [0, 20], [10, 20], [20, 20],
];

export function Mark({ className, ink = "currentColor", lit = "var(--accent)" }: { className?: string; ink?: string; lit?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
      {CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="2.04" fill={x === 10 && y === 10 ? lit : ink} />
      ))}
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
