"use client";

import { useMemo, useState } from "react";

type Point = { d: string; views: number; visitors: number; clicks: number };

const W = 720;
const H = 240;
const PAD = { l: 36, r: 12, t: 12, b: 26 };

/** Smooth path through points (monotone-ish cubic). */
function smooth(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

const nice = (n: number) => {
  if (n <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / p) * p;
};

export function TrafficChart({ series }: { series: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const { max, x, y, views, visitors } = useMemo(() => {
    const max = nice(Math.max(...series.map((s) => s.views), 1));
    const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, series.length - 1);
    const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
    return {
      max,
      x,
      y,
      views: series.map((s, i) => [x(i), y(s.views)] as [number, number]),
      visitors: series.map((s, i) => [x(i), y(s.visitors)] as [number, number]),
    };
  }, [series]);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const every = Math.ceil(series.length / 7);
  const label = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const h = hover !== null ? series[hover] : null;

  return (
    <div className="ad-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (series.length - 1));
          setHover(Math.min(series.length - 1, Math.max(0, i)));
        }}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Daily page views and visitors"
      >
        <defs>
          <linearGradient id="adFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="ad-chart__grid" />
            <text x={PAD.l - 8} y={y(t) + 4} className="ad-chart__axis" textAnchor="end">
              {t >= 1000 ? `${(t / 1000).toFixed(1)}k` : t}
            </text>
          </g>
        ))}
        {series.map((s, i) =>
          i % every === 0 ? (
            <text key={s.d} x={x(i)} y={H - 6} className="ad-chart__axis" textAnchor="middle">
              {label(s.d)}
            </text>
          ) : null,
        )}
        <path d={`${smooth(views)} L${x(series.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#adFill)" />
        <path d={smooth(views)} className="ad-chart__line" />
        <path d={smooth(visitors)} className="ad-chart__line ad-chart__line--2" />
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} className="ad-chart__cross" />
            <circle cx={x(hover)} cy={y(h.views)} r="4.5" className="ad-chart__dot" />
            <circle cx={x(hover)} cy={y(h.visitors)} r="4" className="ad-chart__dot ad-chart__dot--2" />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div className="ad-tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <b>{new Date(h.d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</b>
          <span>
            <i className="v" />
            {h.views} views
          </span>
          <span>
            <i className="u" />
            {h.visitors} visitors
          </span>
          <span>
            <i className="c" />
            {h.clicks} clicks
          </span>
        </div>
      )}
    </div>
  );
}
