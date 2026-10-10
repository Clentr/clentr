import Link from "next/link";
import type { Project } from "@/content/projects";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";

export function WorkCard({ p, tabIndex }: { p: Project; tabIndex?: number }) {
  return (
    <Link href={`/work/${p.slug}`} className="work-card" tabIndex={tabIndex} aria-label={`${p.name} — ${p.kind} case study`}>
      <div className="work-card__stage">
        <Art name={`stage-${p.slug}`} themed alt="" sizes="400px" />
      </div>
      <div className="work-card__meta">
        <Art name={`icon-${p.slug}`} themed alt="" className="app-icon" sizes="44px" />
        <div>
          <div className="work-card__name">{p.name}</div>
          <div className="work-card__kind">
            {p.kind} &nbsp;·&nbsp; {p.platform}
          </div>
        </div>
        <Icon name="arrow-up-right" className="work-card__arrow" />
      </div>
    </Link>
  );
}
