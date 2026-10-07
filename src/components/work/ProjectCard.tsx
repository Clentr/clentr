import Image from "next/image";
import type { Project } from "@/content/projects";
import { Reveal } from "../ui/Reveal";
import { Web } from "../ui/Web";
import { Fan } from "./Fan";

export function ProjectCard({ project, index, flip }: { project: Project; index: number; flip: boolean }) {
  const n = String(index + 1).padStart(2, "0");
  const featured = project.hero.map((i) => project.flow[i]);
  const showFlow = project.flow.length > project.hero.length;

  return (
    <article className={`case ${flip ? "case--flip" : ""}`} aria-labelledby={`case-${project.slug}`}>
      <Reveal className="case__panel" y={40}>
        <Web className="case__web" flip={flip} />
        <div className="case__halftone" aria-hidden="true" />

        <div className="case__copy">
          <div className="case__meta">
            <span className="case__num">{n}</span>
            <span className="label">{project.category}</span>
            <span className="label">{project.platform}</span>
          </div>
          <h3 className="case__name" id={`case-${project.slug}`}>
            {project.name}
          </h3>
          <p className="case__tagline">{project.tagline}</p>
          <p className="case__summary">{project.summary}</p>
          <ul className="case__features">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <ul className="tags" aria-label={project.tags.label}>
            {project.tags.items.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="case__visual">
          <Fan screens={featured} />
        </div>
      </Reveal>

      {showFlow && (
        <div className="case__flow">
          <div className="case__flow-head">
            <span className="label label--accent">The flow</span>
            <span className="label">
              {project.flow.length} screens · swipe
            </span>
          </div>
          <ol className="thumbs" tabIndex={0} aria-label={`${project.name} screens in order`}>
            {project.flow.map((s, i) => (
              <li key={s.src} className="thumb">
                <div className="thumb__screen">
                  <Image src={s.src} alt={s.alt} fill sizes="150px" />
                </div>
                <p className="thumb__caption">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.caption}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
