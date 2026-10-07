import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";
import { Reveal } from "../ui/Reveal";
import { Flow } from "./Flow";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project" style={{ "--c": project.color } as CSSProperties}>
      <Reveal className="container pinfo">
        <div className="pinfo__lead">
          <div className="pinfo__meta">
            <span className="pinfo__swatch" aria-hidden="true" />
            <span className="label">{String(index + 1).padStart(2, "0")}</span>
            <span className="label">{project.category}</span>
            <span className="label">{project.platform}</span>
          </div>
          <h3 className="pinfo__name">{project.name}</h3>
          <p className="pinfo__tagline">{project.tagline}</p>
        </div>
        <div className="pinfo__detail">
          <p className="body">{project.summary}</p>
          <ul className="pinfo__features" aria-label={`${project.name} features`}>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="pinfo__tags">
            <span className="label">{project.tags.label}</span>
            <ul className="tags">
              {project.tags.items.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
      <Reveal y={48}>
        <Flow screens={project.flow} name={project.name} />
      </Reveal>
    </article>
  );
}
