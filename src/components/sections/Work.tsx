import { moreWork, projects } from "@/content/projects";
import { ProjectCard } from "../work/ProjectCard";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function Work() {
  const shipped = projects.filter((p) => p.group === "shipped");
  const built = projects.filter((p) => p.group === "built");

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          id="work-title"
          index="03"
          label="Selected work"
          aside={`${String(shipped.length).padStart(2, "0")} shipped apps`}
          title={["Products we have", <span key="2"><span className="serif">shipped.</span></span>]}
          lead="Five apps live on iPhone — journaling, careers, relationships, social confidence and fitness. Each one designed, engineered and released end to end."
        />
        <div className="work__list">
          {shipped.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="work__sub">
          <div className="section-head__meta">
            <span className="label">Also engineered</span>
            <span className="label">Platforms &amp; tools</span>
          </div>
        </div>
        <div className="work__list">
          {built.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={shipped.length + i} />
          ))}
        </div>

        <Reveal className="more">
          <span className="label">More from the workshop</span>
          <ul className="more__list">
            {moreWork.map((w) => (
              <li key={w.name} className="more__row">
                <span className="more__name">{w.name}</span>
                <span className="more__kind">{w.kind}</span>
                <span className="more__stack label">{w.stack}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
