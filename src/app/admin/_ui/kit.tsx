import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";

export function PageHead({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <header className="ad-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="ad-head__actions">{children}</div>}
    </header>
  );
}

export function Card({ title, icon: I, action, children, className = "" }: {
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`ad-card ${className}`}>
      {(title || action) && (
        <header className="ad-card__head">
          {title && (
            <h2>
              {I && <I />}
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="ad-delta ad-delta--new">New</span>;
  if (value === 0) {
    return (
      <span className="ad-delta">
        <Minus />
        0%
      </span>
    );
  }
  const up = value > 0;
  return (
    <span className={`ad-delta ${up ? "ad-delta--up" : "ad-delta--down"}`}>
      {up ? <ArrowUpRight /> : <ArrowDownRight />}
      {Math.abs(value)}%
    </span>
  );
}

/** Tiny trend line for a KPI card. */
export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const step = 100 / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(2)},${(30 - (v / max) * 26 - 2).toFixed(2)}`);
  return (
    <svg className="ad-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <path className="ad-spark__area" d={`M0,30 L${pts.join(" L")} L100,30 Z`} />
      <path className="ad-spark__line" d={`M${pts.join(" L")}`} />
    </svg>
  );
}

export function Kpi({ label, value, delta, icon: I, trend, hint }: {
  label: string;
  value: number;
  delta: number | null;
  icon: LucideIcon;
  trend: number[];
  hint: string;
}) {
  return (
    <div className="ad-card ad-kpi">
      <div className="ad-kpi__top">
        <span className="ad-kpi__icon">
          <I />
        </span>
        <span className="ad-kpi__label">{label}</span>
        <Delta value={delta} />
      </div>
      <b className="ad-kpi__value">{value.toLocaleString()}</b>
      <small className="ad-kpi__hint">{hint}</small>
      <Sparkline values={trend} />
    </div>
  );
}

/** Ranked list with proportional bars. */
export function Ranked({ rows, format = (s) => s, lead, empty = "Nothing yet in this period." }: {
  rows: [string, number][];
  format?: (s: string) => ReactNode;
  lead?: (s: string) => ReactNode;
  empty?: string;
}) {
  if (!rows.length) return <Empty text={empty} />;
  const max = rows[0][1];
  const total = rows.reduce((a, [, n]) => a + n, 0);
  return (
    <ol className="ad-rank">
      {rows.map(([k, n]) => (
        <li key={k}>
          <span className="ad-rank__bar" style={{ width: `${Math.max(4, (n / max) * 100)}%` }} />
          {lead && <span className="ad-rank__lead">{lead(k)}</span>}
          <span className="ad-rank__k">{format(k)}</span>
          <span className="ad-rank__n">
            {n.toLocaleString()}
            <small>{Math.round((n / total) * 100)}%</small>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Donut({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  if (!total) return <Empty text="No visits yet." />;
  const C = 2 * Math.PI * 40;
  const lens = parts.map((p) => (p.value / total) * C);
  const offsets = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className="ad-donut">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" className="ad-donut__track" />
        {parts.map((p, i) => (
          <circle
            key={p.label}
            cx="50"
            cy="50"
            r="40"
            stroke={p.color}
            strokeDasharray={`${Math.max(0, lens[i] - 1.5)} ${C}`}
            strokeDashoffset={-offsets[i]}
            className="ad-donut__seg"
          />
        ))}
      </svg>
      <ul>
        {parts.map((p) => (
          <li key={p.label}>
            <i style={{ background: p.color }} />
            {p.label}
            <b>{Math.round((p.value / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const top = Math.max(1, steps[0]?.value ?? 1);
  return (
    <ol className="ad-funnel">
      {steps.map((s, i) => {
        const prev = i ? steps[i - 1].value : null;
        const rate = prev ? Math.round((s.value / prev) * 100) : null;
        return (
          <li key={s.label}>
            <div className="ad-funnel__row">
              <span>{s.label}</span>
              <b>{s.value.toLocaleString()}</b>
            </div>
            <div className="ad-funnel__track">
              <i style={{ width: `${Math.max(s.value ? 2 : 0, (s.value / top) * 100)}%` }} />
            </div>
            {rate !== null && <small>{prev ? `${rate}% of the step before` : "—"}</small>}
          </li>
        );
      })}
    </ol>
  );
}

export function Empty({ text, icon: I, children }: { text: string; icon?: LucideIcon; children?: ReactNode }) {
  return (
    <div className="ad-empty">
      {I && (
        <span className="ad-empty__icon">
          <I />
        </span>
      )}
      <p>{text}</p>
      {children}
    </div>
  );
}

/** "🇮🇳" from "IN". */
export const flag = (cc: string) =>
  /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "🌐";

export const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
