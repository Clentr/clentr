import type { Project } from "@/content/projects";
import { Reveal } from "../ui/Reveal";
import { Art } from "./Art";
import { Screens } from "./Screens";
import { VideoVisual } from "./VideoVisual";

function Visual({ project }: { project: Project }) {
  const v = project.visual;
  if (v.type === "screens") {
    return <Screens images={v.images} variant={project.layout === "feature" ? "feature" : v.ratio} />;
  }
  if (v.type === "video") return <VideoVisual src={v.src} poster={v.poster} alt={v.alt} />;
  return <Art kind={v.kind} />;
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  const showFeatures = project.layout !== "compact";

  return (
    <Reveal as="article" className={`project project--${project.layout}`}>
      <div className="project__stage">
        <span className="project__index label">{n}</span>
        <span className="project__badge glass">
          <span className="dot" />
          {project.platform}
        </span>
        <Visual project={project} />
      </div>

      <div className="project__info">
        <div style={{ display: "grid", gap: 14 }}>
          <span className="label label--accent">
            {project.category} — {project.kicker}
          </span>
          <h3 className="project__name">{project.name}</h3>
          <p className="body">{project.summary}</p>
          <ul className="tags" aria-label={`${project.name} technology`}>
            {project.stack.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </div>
        {showFeatures && (
          <ul className="project__features" aria-label={`${project.name} key features`}>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}
