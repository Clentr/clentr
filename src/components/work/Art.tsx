import type { ReactNode } from "react";

/*
 * Illustrations for products without public screenshots. Each one diagrams the
 * product's real mechanism (from its README/code) rather than faking a UI capture.
 * All colour comes from theme tokens via the .art classes in globals.css.
 */

type Kind = "atlas" | "siren" | "mask" | "edith" | "voice";

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="art zoom" role="img" aria-label={label}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        {children}
      </svg>
    </div>
  );
}

function Atlas() {
  const stops = [
    { x: 92, y: 196, d: "DAY 1" },
    { x: 168, y: 128, d: "DAY 2" },
    { x: 250, y: 168, d: "DAY 3" },
    { x: 318, y: 92, d: "DAY 4" },
  ];
  return (
    <Frame label="Illustration: a day-by-day route plotted across a map grid with a validated itinerary">
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`h${i}`} className="s-faint" d={`M0 ${30 + i * 32} Q200 ${18 + i * 32} 400 ${30 + i * 32}`} />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <path key={`v${i}`} className="s-faint" d={`M${i * 40} 0 Q${i * 40 + (i - 5) * 6} 150 ${i * 40} 300`} />
      ))}
      <circle className="s-line" cx="330" cy="250" r="120" />
      <ellipse className="s-faint" cx="330" cy="250" rx="60" ry="120" />
      <path
        className="s-accent dash"
        strokeWidth="1.6"
        d={`M${stops[0].x} ${stops[0].y} C130 160 140 130 ${stops[1].x} ${stops[1].y} S230 190 ${stops[2].x} ${stops[2].y} S300 100 ${stops[3].x} ${stops[3].y}`}
      />
      {stops.map((s) => (
        <g key={s.d}>
          <circle className="f-accent pulse" cx={s.x} cy={s.y} r="5" opacity=".5" />
          <circle className="f-accent" cx={s.x} cy={s.y} r="4" />
          <text className="f-text" x={s.x + 9} y={s.y - 8}>
            {s.d}
          </text>
        </g>
      ))}
      <g transform="translate(24 24)">
        <rect className="f-surface-2" width="132" height="56" rx="8" />
        <rect className="s-line" width="132" height="56" rx="8" />
        <text className="f-muted" x="12" y="21">
          itinerary.json
        </text>
        <circle className="f-olive" cx="17" cy="37" r="4" />
        <text className="f-text" x="28" y="41">
          schema valid
        </text>
      </g>
    </Frame>
  );
}

function Siren() {
  const tiles = [
    { x: 20, y: 20, box: [60, 40, 34, 64], t: "track 03" },
    { x: 206, y: 20, box: [120, 30, 30, 70], t: "track 07" },
    { x: 20, y: 136, box: [100, 34, 40, 60], t: "motion" },
    { x: 206, y: 136, box: [40, 48, 56, 44], t: "track 11" },
  ];
  return (
    <Frame label="Illustration: a wall of four camera feeds with tracked subjects and an event timeline">
      {tiles.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y})`}>
          <rect className="f-surface" width="174" height="106" rx="6" />
          <rect className="s-faint" width="174" height="106" rx="6" />
          <path className="s-faint" d="M0 80 L60 62 L174 70" />
          <rect className="s-accent" x={t.box[0]} y={t.box[1]} width={t.box[2]} height={t.box[3]} strokeWidth="1.2" />
          <text className="f-accent" x={t.box[0]} y={t.box[1] - 5} fontSize="9">
            {t.t}
          </text>
          <circle className="f-accent blink" cx="12" cy="12" r="3" />
          <text className="f-muted" x="20" y="15" fontSize="9">
            CAM 0{i + 1}
          </text>
        </g>
      ))}
      <g transform="translate(20 258)">
        <rect className="f-surface-2" width="360" height="24" rx="12" />
        <rect className="s-faint" width="360" height="24" rx="12" />
        {[40, 92, 150, 196, 262, 318].map((x, i) => (
          <rect key={x} className={i % 2 ? "f-olive" : "f-accent"} x={x} y="7" width={i % 3 ? 10 : 22} height="10" rx="3" />
        ))}
      </g>
    </Frame>
  );
}

function Mask() {
  return (
    <Frame label="Illustration: a desktop window showing an agent conversation, a tool card with a diff, and a terminal">
      <g transform="translate(24 22)">
        <rect className="f-surface" width="352" height="256" rx="10" />
        <rect className="s-line" width="352" height="256" rx="10" />
        <path className="s-faint" d="M0 26 H352 M92 26 V256" />
        {[14, 26, 38].map((x) => (
          <circle key={x} className="f-muted" cx={x} cy="13" r="3.5" opacity=".6" />
        ))}
        {[44, 62, 80, 98].map((y, i) => (
          <rect key={y} className={i === 0 ? "f-accent" : "f-surface-2"} x="12" y={y} width={i === 0 ? 64 : 56} height="8" rx="4" opacity={i === 0 ? 0.8 : 1} />
        ))}
        <g transform="translate(108 40)">
          <rect className="f-surface-2" x="96" width="132" height="22" rx="11" />
          <text className="f-text" x="108" y="15" fontSize="9">
            add tests for parser
          </text>
          <rect className="f-surface-2" y="34" width="228" height="96" rx="8" />
          <rect className="s-line" y="34" width="228" height="96" rx="8" />
          <text className="f-muted" x="12" y="52" fontSize="9">
            EDIT · src/parser.ts
          </text>
          <rect className="f-accent" x="12" y="62" width="150" height="10" rx="2" opacity=".22" />
          <rect className="f-olive" x="12" y="76" width="186" height="10" rx="2" opacity=".35" />
          <rect className="f-olive" x="12" y="90" width="120" height="10" rx="2" opacity=".35" />
          <rect className="f-surface" x="12" y="104" width="160" height="10" rx="2" />
          <text className="f-muted" x="0" y="150" fontSize="9">
            TASK 2 / 4
          </text>
          <rect className="f-surface-2" x="0" y="158" width="228" height="4" rx="2" />
          <rect className="f-accent" x="0" y="158" width="114" height="4" rx="2" />
        </g>
        <g transform="translate(92 196)">
          <rect className="f-surface-2" width="260" height="60" />
          <text className="f-accent" x="12" y="24" fontSize="10">
            $
          </text>
          <text className="f-text" x="24" y="24" fontSize="10">
            npm test
          </text>
          <text className="f-muted" x="12" y="42" fontSize="10">
            ✓ all tests passed
          </text>
          <rect className="f-text blink" x="80" y="34" width="6" height="11" />
        </g>
      </g>
    </Frame>
  );
}

function Edith() {
  const bars = [30, 44, 38, 58, 52, 70, 64, 48, 56, 40, 62, 74];
  return (
    <Frame label="Illustration: a macOS menu-bar panel with a memory chart, file search and a floating assistant orb">
      <rect className="f-surface-2" x="0" y="0" width="400" height="20" />
      <path className="s-faint" d="M0 20 H400" />
      {[300, 322, 344].map((x) => (
        <rect key={x} className="f-muted" x={x} y="7" width="12" height="6" rx="2" opacity=".6" />
      ))}
      <circle className="f-accent" cx="372" cy="10" r="4" />
      <g transform="translate(150 30)">
        <rect className="f-surface" width="234" height="250" rx="12" />
        <rect className="s-line" width="234" height="250" rx="12" />
        <text className="f-muted" x="16" y="26" fontSize="9">
          MEMORY PRESSURE
        </text>
        {bars.map((h, i) => (
          <rect
            key={i}
            className={`${i === bars.length - 1 ? "f-accent" : "f-olive"} bar`}
            style={{ animationDelay: `${i * 0.12}s` }}
            x={16 + i * 17}
            y={112 - h}
            width="10"
            height={h}
            rx="2"
            opacity={i === bars.length - 1 ? 1 : 0.55}
          />
        ))}
        <rect className="f-surface-2" x="16" y="130" width="202" height="28" rx="8" />
        <text className="f-text" x="28" y="148" fontSize="10">
          ext:pdf in:Documents
        </text>
        <rect className="f-text blink" x="150" y="139" width="1.5" height="12" />
        {[172, 196, 220].map((y, i) => (
          <g key={y}>
            <rect className="f-surface-2" x="16" y={y} width="16" height="16" rx="3" />
            <rect className="f-muted" x="40" y={y + 3} width={[110, 80, 128][i]} height="5" rx="2" opacity=".7" />
            <rect className="f-muted" x="40" y={y + 11} width={[60, 90, 50][i]} height="3" rx="1.5" opacity=".35" />
          </g>
        ))}
      </g>
      <g transform="translate(74 200)">
        <circle className="f-accent pulse" r="22" opacity=".35" />
        <circle className="f-accent" r="18" opacity=".9" />
        <circle className="f-surface" r="7" />
      </g>
    </Frame>
  );
}

function Voice() {
  const wave = Array.from({ length: 34 }, (_, i) => 8 + Math.round(Math.abs(Math.sin(i * 0.7) * 28 + Math.sin(i * 1.9) * 10)));
  const nodes = ["CALL", "WEBHOOK", "LANGGRAPH", "LEAD"];
  return (
    <Frame label="Illustration: a voice waveform flowing through call, webhook and evaluation stages to a lead status">
      <g transform="translate(36 54)">
        {wave.map((h, i) => (
          <rect
            key={i}
            className={`${i > 12 && i < 22 ? "f-accent" : "f-muted"} bar`}
            style={{ animationDelay: `${(i % 7) * 0.15}s` }}
            x={i * 9.6}
            y={40 - h / 2}
            width="4"
            height={h}
            rx="2"
            opacity={i > 12 && i < 22 ? 1 : 0.45}
          />
        ))}
      </g>
      <g transform="translate(28 150)">
        <path className="s-line dash" d="M40 30 H328" />
        {nodes.map((n, i) => (
          <g key={n} transform={`translate(${i * 96} 0)`}>
            <rect className="f-surface" width="80" height="60" rx="10" />
            <rect className={i === 2 ? "s-accent" : "s-line"} width="80" height="60" rx="10" />
            <text className={i === 2 ? "f-accent" : "f-muted"} x="40" y="34" textAnchor="middle" fontSize="8.5">
              {n}
            </text>
          </g>
        ))}
      </g>
      <g transform="translate(232 236)">
        <rect className="f-surface-2" width="144" height="28" rx="14" />
        <circle className="f-olive" cx="16" cy="14" r="4" />
        <text className="f-text" x="28" y="18" fontSize="10">
          status · qualified
        </text>
      </g>
    </Frame>
  );
}

const MAP: Record<Kind, () => ReactNode> = { atlas: Atlas, siren: Siren, mask: Mask, edith: Edith, voice: Voice };

export function Art({ kind }: { kind: Kind }) {
  const C = MAP[kind];
  return <C />;
}
