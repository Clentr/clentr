import { projects, type Project } from "@/content/projects";
import { ProjectCard } from "../work/ProjectCard";
import { SectionHead } from "../ui/SectionHead";

type Row = { kind: "single"; item: Project; index: number } | { kind: "pair"; items: [Project, Project]; index: number };

// Consecutive compact projects pair up into a staggered two-up row.
function toRows(list: Project[]): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    const next = list[i + 1];
    if (p.layout === "compact" && next?.layout === "compact") {
      rows.push({ kind: "pair", items: [p, next], index: i });
      i++;
    } else {
      rows.push({ kind: "single", item: p, index: i });
    }
  }
  return rows;
}

export function Work() {
  const list = projects;

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          id="work-title"
          index="03"
          label="Selected work"
          aside={`${String(list.length).padStart(2, "0")} products`}
          title={["Things we have", <span key="2"><span className="serif">built</span> and shipped.</span>]}
          lead="Commerce, operations, careers, travel, vision, developer tools and voice — on phones, desktops, browsers and servers."
        />
        <div className="work__list">
          {toRows(list).map((row) =>
            row.kind === "single" ? (
              <ProjectCard key={row.item.slug} project={row.item} index={row.index} />
            ) : (
              <div key={row.items[0].slug} className="work__pair">
                <ProjectCard project={row.items[0]} index={row.index} />
                <ProjectCard project={row.items[1]} index={row.index + 1} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
