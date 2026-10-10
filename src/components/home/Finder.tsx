import Link from "next/link";
import { mobileApps, webDesktop, type Project } from "@/content/projects";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";

function FolderItem({ p }: { p: Project }) {
  const tag = p.status === "shipped" ? "var(--green)" : "var(--accent)";
  return (
    <Link href={`/work/${p.slug}`} className="folder" aria-label={`Open ${p.name} — ${p.kind}`}>
      <span className="folder__pop" aria-hidden="true">
        <Art name={`pop-${p.slug}-l`} alt="" className="pop-l" sizes="70px" />
        <Art name={`pop-${p.slug}-r`} alt="" className="pop-r" sizes="70px" />
        <Art name={`icon-${p.slug}`} themed alt="" className="pop-icon" sizes="44px" />
      </span>
      <Art name={`folder-${p.slug}`} themed alt="" className="folder__art" sizes="96px" />
      <span className="folder__label">
        {p.name}
        <i style={{ background: tag }} />
      </span>
      <span className="folder__kind">{p.kind}</span>
      <span className="folder__open" aria-hidden="true">
        Open
        <Icon name="arrow-up-right" />
      </span>
    </Link>
  );
}

const SIDEBAR = [
  { h: "Favourites", items: [["AirDrop", "audio-lines"], ["Recents", "clock"], ["Applications", "app-window"], ["Desktop", "monitor"], ["Documents", "file-text"], ["Downloads", "arrow-right"]] },
  { h: "Clentr", items: [["Work", "folder-open"], ["Case studies", "book-open"], ["Brand kit", "sparkles"]] },
  { h: "Locations", items: [["iCloud Drive", "cloud"], ["Macintosh HD", "hard-drive"]] },
];

/** The work, organised like the Mac it was built on. */
export function Finder() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          id="work-title"
          chip="Our work"
          icon="folder"
          title="Every project, one"
          dim="folder away."
          lead="Mobile apps, websites and desktop tools — organised like the Mac we build them on. Hover a folder to peek inside, click to open the project."
        />
      </div>
      <div className="desktop">
        <span className="desktop__wave desktop__wave--1" aria-hidden="true" />
        <span className="desktop__wave desktop__wave--2" aria-hidden="true" />
        <div className="menubar" aria-hidden="true">
          <b>Finder</b>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
          <span className="menubar__right">
            <Icon name="search" />
            <span>Sat 10 Oct&nbsp;&nbsp;3:30 PM</span>
          </span>
        </div>
        <div className="desk-items" aria-hidden="true">
          <Art name="desk-clentr-brand-pdf" themed alt="" sizes="96px" />
          <Art name="desk-proposal-key" themed alt="" sizes="96px" />
          <Art name="desk-screenshots" themed alt="" sizes="96px" />
        </div>

        <div className="finder">
          <aside className="finder__side" aria-hidden="true">
            <div className="lights">
              <i />
              <i />
              <i />
            </div>
            {SIDEBAR.map((g) => (
              <div className="side-group" key={g.h}>
                <h3>{g.h}</h3>
                {g.items.map(([label, icon]) => (
                  <span key={label} className={label === "Work" ? "is-sel" : undefined}>
                    <Icon name={icon} />
                    {label}
                  </span>
                ))}
              </div>
            ))}
            <div className="side-group">
              <h3>Tags</h3>
              {[["Shipped", "var(--green)"], ["In R&D", "var(--accent)"]].map(([t, c]) => (
                <span key={t}>
                  <i className="tagdot" style={{ background: c }} />
                  {t}
                </span>
              ))}
            </div>
          </aside>
          <div className="finder__main">
            <div className="toolbar">
              <Icon name="arrow-left" />
              <Icon name="arrow-right" />
              <b>Work</b>
              <span className="toolbar__search" aria-hidden="true">
                <Icon name="search" />
                Search
              </span>
            </div>
            <div className="finder__body">
              {[
                ["Mobile apps", mobileApps],
                ["Web & desktop", webDesktop],
              ].map(([title, list]) => (
                <div key={title as string}>
                  <div className="finder__group-head">
                    <b>{title as string}</b>
                    <span>{(list as Project[]).length} items</span>
                    <em aria-hidden="true">Show Less</em>
                  </div>
                  <div className="folders">
                    {(list as Project[]).map((p) => (
                      <FolderItem key={p.slug} p={p} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="finder__path" aria-hidden="true">
              <Icon name="hard-drive" />
              <span>Macintosh HD › Users › clentr › Work</span>
              <span>12 items, 418 GB available</span>
            </div>
          </div>
        </div>
        <Art name="dock" themed alt="" className="dock" sizes="800px" />
      </div>
    </section>
  );
}
