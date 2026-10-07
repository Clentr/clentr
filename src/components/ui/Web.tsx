/**
 * A spider web anchored in one corner: radial threads plus sagging rings.
 * Pure SVG, generated once; colour comes from `currentColor`.
 */
const SPOKES = 11;
const RINGS = 9;
const R = 980;

function build() {
  const angles = Array.from({ length: SPOKES }, (_, i) => Math.PI / 2 + (i / (SPOKES - 1)) * (Math.PI / 2));
  const pt = (a: number, r: number) => [1000 + Math.cos(a) * r, Math.sin(a) * r] as const;
  let d = "";
  for (const a of angles) {
    const [x, y] = pt(a, R);
    d += `M1000 0L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  for (let k = 1; k <= RINGS; k++) {
    const r = (k / RINGS) ** 1.25 * R;
    for (let i = 0; i < angles.length - 1; i++) {
      const [x1, y1] = pt(angles[i], r);
      const [x2, y2] = pt(angles[i + 1], r);
      // Threads sag toward the centre between spokes.
      const [cx, cy] = pt((angles[i] + angles[i + 1]) / 2, r * 0.9);
      d += `${i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)}` : ""}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }
  }
  return d;
}

const D = build();

export function Web({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 1000"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d={D} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
