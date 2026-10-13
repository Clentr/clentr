import type { CSSProperties } from "react";
import Link from "next/link";
import type { SiteContent } from "@/content/cms";
import type { Project } from "@/content/projects";
import { getWork } from "@/lib/projects";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { FolderArt, PopArt, ProjectIcon } from "../work/ProjectArt";
import { SectionHead } from "../ui/SectionHead";

function FolderItem({ p }: { p: Project }) {
  const tag = p.status === "shipped" ? "var(--green)" : "var(--accent)";
  return (
    <Link
      href={`/work/${p.slug}`}
      className="folder"
      aria-label={`Open ${p.name} — ${p.kind}`}
      style={{ "--p": p.color } as CSSProperties}
    >
      <span className="folder__glow" aria-hidden="true" />
      <span className="folder__pop" aria-hidden="true">
        <PopArt p={p} />
      </span>
      <FolderArt p={p} />
      <span className="folder__label">
        <span>{p.name}</span>
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

/** Projects whose Figma icon is only a letter — shown as a tinted tile on the phone screen. */
const LETTER_ICONS = new Set(["wayfare", "siren", "edith", "voice-orchestrator", "cafemanager"]);

const SIDEBAR = [
  { h: "Favourites", items: [["AirDrop", "audio-lines"], ["Recents", "clock"], ["Applications", "app-window"], ["Desktop", "monitor"], ["Documents", "file-text"], ["Downloads", "arrow-right"]] },
  { h: "Clentr", items: [["Work", "folder-open"], ["Case studies", "book-open"], ["Brand kit", "sparkles"]] },
  { h: "Locations", items: [["iCloud Drive", "cloud"], ["Macintosh HD", "hard-drive"]] },
];

/** The work, organised like the Mac it was built on. */
export async function Finder({ c }: { c: SiteContent["work"] }) {
  const { mobileApps, webDesktop } = await getWork();
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead id="work-title" {...c} />
      </div>
      <div className="desktop" id="work-folders">
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
              <div className="lights lights--bar" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
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
              <span>{mobileApps.length + webDesktop.length} items, 418 GB available</span>
            </div>
          </div>
        </div>
        <Art name="dock" themed alt="" className="dock" sizes="800px" />
      </div>

      {/* Phones: the same work as an iPhone home screen — tap an app to open its case study. */}
      <div className="phonehome" aria-label="All projects">
        <div className="phonehome__status" aria-hidden="true">
          <b>9:41</b>
          <span>
            <i />
            <i />
            <i />
          </span>
        </div>
        {[
          ["Shipped", mobileApps],
          ["Web, desktop & R&D", webDesktop],
        ].map(([title, list]) => (
          <div key={title as string} className="phonehome__group">
            <span className="phonehome__label">{title as string}</span>
            <ul className="phonehome__grid">
              {(list as Project[]).map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="phonehome__app" aria-label={`Open ${p.name} — ${p.kind}`}>
                    {LETTER_ICONS.has(p.slug) ? (
                      <span className="phonehome__icon phonehome__letter" style={{ "--p": p.color } as CSSProperties}>
                        {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                    ) : (
                      <ProjectIcon p={p} size={60} className="phonehome__icon" />
                    )}
                    <span>{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="phonehome__dock" aria-hidden="true">
          {mobileApps.slice(0, 4).map((p) => (
            <ProjectIcon key={p.slug} p={p} size={52} className="phonehome__icon" />
          ))}
        </div>
      </div>
    </section>
  );
}
