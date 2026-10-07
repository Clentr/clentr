import type { ReactNode } from "react";
import { LineReveal, Reveal } from "./Reveal";

/** Label row with index, then a large headline and optional supporting copy. */
export function SectionHead({
  index,
  label,
  aside,
  title,
  lead,
  id,
}: {
  index: string;
  label: string;
  aside?: ReactNode;
  title: ReactNode[];
  lead?: ReactNode;
  id?: string;
}) {
  return (
    <header className="section-head">
      <div className="section-head__meta">
        <span className="label label--accent">
          {index} — {label}
        </span>
        {aside && <span className="label">{aside}</span>}
      </div>
      <div className="section-head__row">
        <h2 className="h2" id={id}>
          <LineReveal lines={title} />
        </h2>
        {lead && (
          <Reveal delay={0.15}>
            <p className="lead">{lead}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
