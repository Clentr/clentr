import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

/** Chip → two-tone heading → supporting line, centred. */
export function SectionHead({ chip, icon, title, dim, lead, id }: {
  chip: string;
  icon: string;
  title: string;
  dim: string;
  lead?: ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="head">
      <span className="chip">
        <Icon name={icon} />
        {chip}
      </span>
      <h2 className="h2" id={id}>
        {title} <span className="dim">{dim}</span>
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}
