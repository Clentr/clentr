import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import type { SiteContent } from "@/content/cms";
import { GROUPS, type Project } from "@/content/projects";
import { getWork } from "@/lib/projects";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { FolderArt, PopArt, ProjectIcon } from "../work/ProjectArt";
import { SectionHead } from "../ui/SectionHead";
import { BookCall } from "../ui/BookCall";
import { Mark } from "../ui/Logo";
import { PhonePager } from "./PhonePager";

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


/** Slots per home-screen page: 4 columns × 6 rows. The widget and each group title take a row. */
const PER_PAGE = 24;
type PhonePage = { widget: boolean; groups: { title: string; apps: Project[] }[] };

/** Lays the projects out like an iPhone: fixed-size pages, filled in order. Empty groups are skipped. */
function phonePages(groups: (readonly [string, Project[]])[]): PhonePage[] {
  const pages: PhonePage[] = [{ widget: true, groups: [] }];
  let room = PER_PAGE - 4; // the widget takes one row
  for (const [title, list] of groups) {
    let first = true;
    for (let i = 0; i < list.length; ) {
      // A group title needs a row of its own; start a new page if there's no room for it plus one row.
      if (room < (first ? 8 : 4)) {
        pages.push({ widget: false, groups: [] });
        room = PER_PAGE;
      }
      if (first) room -= 4;
      const take = list.slice(i, i + room);
      const rows = Math.ceil(take.length / 4) * 4;
      pages[pages.length - 1].groups.push({ title: first ? title : "", apps: take });
      room -= rows;
      i += take.length;
      first = false;
    }
  }
  return pages.filter((p) => p.widget || p.groups.length);
}

const SIDEBAR = [
  { h: "Favourites", items: [["AirDrop", "audio-lines"], ["Recents", "clock"], ["Applications", "app-window"], ["Desktop", "monitor"], ["Documents", "file-text"], ["Downloads", "arrow-right"]] },
  { h: "Clentr", items: [["Work", "folder-open"], ["Case studies", "book-open"], ["Brand kit", "sparkles"]] },
  { h: "Locations", items: [["iCloud Drive", "cloud"], ["Macintosh HD", "hard-drive"]] },
];

/** The work, organised like the Mac it was built on. */
export async function Finder({ c, email }: { c: SiteContent["work"]; email: string }) {
  const { mobileApps, webDesktop, aiWork, all, shipped, rnd } = await getWork();
  // Empty columns stay out of sight.
  const groups = GROUPS.map((g) => [g.label, { app: mobileApps, web: webDesktop, ai: aiWork }[g.k]] as const).filter(([, list]) => list.length);
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
              {groups.map(([title, list]) => (
                <div key={title}>
                  <div className="finder__group-head">
                    <b>{title}</b>
                    <span>{list.length} items</span>
                    <em aria-hidden="true">Show Less</em>
                  </div>
                  <div className="folders">
                    {list.map((p) => (
                      <FolderItem key={p.slug} p={p} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="finder__path" aria-hidden="true">
              <Icon name="hard-drive" />
              <span>Macintosh HD › Users › clentr › Work</span>
              <span>{all.length} items, 418 GB available</span>
            </div>
          </div>
        </div>
        <Art name="dock" themed alt="" className="dock" sizes="800px" />
      </div>

      {/* Phones: the same work as an iPhone home screen — tap an app to open its case study.
          The phone keeps real iPhone proportions; more projects add home-screen pages, never height. */}
      <div className="phonehome" aria-label="All projects">
        <div className="phonehome__status" aria-hidden="true">
          <b>9:41</b>
          <span>
            <i />
            <i />
            <i />
          </span>
        </div>
        <PhonePager
          pages={phonePages(groups.map(([t, l]) => [t === "Mobile apps" ? "Apps" : t, l] as const)).map((pg, n) => (
            <Fragment key={n}>
              {pg.widget && (
                <div className="phonehome__widget">
                  <Mark className="phonehome__mark" />
                  <span>
                    <b>{shipped} shipped</b>
                    {rnd > 0 && <small>{rnd} in R&amp;D</small>}
                    <small>Tap an app to open its story</small>
                  </span>
                </div>
              )}
              {pg.groups.map((g) => (
                <div key={g.title} className="phonehome__group">
                  {g.title && <span className="phonehome__label">{g.title}</span>}
                  <ul className="phonehome__grid">
                    {g.apps.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/work/${p.slug}`} className="phonehome__app" aria-label={`Open ${p.name} — ${p.kind}`}>
                          <ProjectIcon p={p} size={60} className="phonehome__icon" />
                          <span>{p.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Fragment>
          ))}
        />
        <div className="phonehome__dock">
          <BookCall where="phone_dock" className="phonehome__dockapp">
            <span className="phonehome__tile phonehome__tile--cal" aria-hidden="true">
              <small>BOOK</small>
              <b>30</b>
            </span>
            <span className="sr-only">Request a call</span>
          </BookCall>
          <a href={`mailto:${email}`} className="phonehome__dockapp" aria-label="Email us">
            <span className="phonehome__tile phonehome__tile--mail" aria-hidden="true">
              <Icon name="mail" />
            </span>
          </a>
          <Link href="/contact" className="phonehome__dockapp" aria-label="Start a project">
            <span className="phonehome__tile phonehome__tile--msg" aria-hidden="true">
              <Icon name="message-circle" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
