import type { Project } from "@/content/projects";
import { Reveal } from "../ui/Reveal";
import { Device } from "./Device";

function Stage({ project }: { project: Project }) {
  const { screens, framed, layout } = project;
  // Trio: the middle screen leads. Duo: the first screen leads.
  const mainIndex = layout === "trio" ? 1 : 0;
  return (
    <div className={`stage stage--${layout === "trio" ? "trio" : "duo"}`}>
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__devices">
        {screens.map((s, i) => (
          <Device
            key={s.src}
            screen={s}
            framed={framed}
            role={i === mainIndex ? "main" : "side"}
            sizes={layout === "trio" ? "(max-width: 760px) 36vw, 300px" : "(max-width: 760px) 44vw, 300px"}
          />
        ))}
      </div>
    </div>
  );
}

function Info({ project, index }: { project: Project; index: number }) {
  return (
    <div className="pinfo">
      <div className="pinfo__meta">
        <span className="label">{String(index + 1).padStart(2, "0")}</span>
        <span className="label">{project.category}</span>
        <span className="label">{project.platform}</span>
      </div>
      <h3 className="pinfo__name">{project.name}</h3>
      <p className="pinfo__tagline">{project.tagline}</p>
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
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal as="article" className={`project project--${project.layout}`}>
      <div className="project__inner">
        <Stage project={project} />
        <Info project={project} index={index} />
      </div>
    </Reveal>
  );
}
