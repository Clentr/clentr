import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectIcon, StageArt } from "./ProjectArt";
import { Icon } from "../ui/Icon";

export function WorkCard({ p, tabIndex }: { p: Project; tabIndex?: number }) {
  return (
    <Link href={`/work/${p.slug}`} className="work-card" tabIndex={tabIndex} aria-label={`${p.name} — ${p.kind} case study`}>
      <div className="work-card__stage">
        <StageArt p={p} />
      </div>
      <div className="work-card__meta">
        <ProjectIcon p={p} size={44} className="app-icon" />
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
