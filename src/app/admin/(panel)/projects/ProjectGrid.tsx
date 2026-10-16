"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Eye, EyeOff, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { GROUPS, groupOf, type Project } from "@/content/projects";
import { ProjectIcon, StageArt } from "@/components/work/ProjectArt";
import { resetOrDeleteProject, setProjectVisible } from "../../actions";

export type ProjectRow = { p: Project; source: "builtin" | "edited" | "added"; visible: boolean };

const TABS = [{ k: "all", label: "All" }, ...GROUPS, { k: "hidden", label: "Hidden" }] as const;

export function ProjectGrid({ rows: initial }: { rows: ProjectRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const [, start] = useTransition();

  const inTab = (r: ProjectRow, k: string) => (k === "all" ? true : k === "hidden" ? !r.visible : groupOf(r.p) === k && r.visible);
  const shown = rows.filter((r) => inTab(r, tab));
  const count = (k: string) => rows.filter((r) => inTab(r, k)).length;

  function setVisible(slug: string, visible: boolean) {
    setRows((rs) => rs.map((r) => (r.p.slug === slug ? { ...r, visible, source: r.source === "builtin" ? "edited" : r.source } : r)));
    start(async () => {
      await setProjectVisible(slug, visible);
      router.refresh();
    });
  }
  function reset(r: ProjectRow) {
    const msg =
      r.source === "added"
        ? `Delete ${r.p.name} and its images? This can’t be undone.`
        : `Reset ${r.p.name} to the original version? Your edits are removed and it becomes visible again.`;
    if (!confirm(msg)) return;
    if (r.source === "added") setRows((rs) => rs.filter((x) => x.p.slug !== r.p.slug));
    start(async () => {
      await resetOrDeleteProject(r.p.slug);
      router.refresh();
    });
  }

  return (
    <>
      <div className="ad-tabs ad-tabs--bar" role="tablist">
        {TABS.map((t) => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} onClick={() => setTab(t.k)}>
            {t.label}
            <em>{count(t.k)}</em>
          </button>
        ))}
      </div>
      <div className="pg">
        {shown.map((r) => (
          <article key={r.p.slug} className={`pg__card ${r.visible ? "" : "is-hidden"}`}>
            <div className="pg__art">
              <StageArt p={r.p} />
              <span className="pg__badges">
                <span className={`pg__badge pg__badge--${r.visible ? "live" : "hidden"}`}>{r.visible ? "Live" : "Hidden"}</span>
                {r.source !== "builtin" && <span className="pg__badge">{r.source === "added" ? "Added" : "Edited"}</span>}
              </span>
            </div>
            <div className="pg__meta">
              <ProjectIcon p={r.p} size={36} className="pg__icon" />
              <div>
                <b>{r.p.name}</b>
                <small>
                  {r.p.kind} · {GROUPS.find((g) => g.k === groupOf(r.p))?.label}
                </small>
              </div>
            </div>
            <div className="pg__actions">
              <button
                type="button"
                className={`ol__vis ${r.visible ? "is-on" : ""}`}
                role="switch"
                aria-checked={r.visible}
                onClick={() => setVisible(r.p.slug, !r.visible)}
              >
                {r.visible ? <Eye /> : <EyeOff />}
                {r.visible ? "Visible" : "Hidden"}
              </button>
              <span className="pg__tools">
                {r.visible && (
                  <a className="ad-iconbtn ad-iconbtn--sm" href={`/work/${r.p.slug}`} target="_blank" rel="noopener" aria-label="View on site" title="View on site">
                    <ExternalLink />
                  </a>
                )}
                {r.source !== "builtin" && (
                  <button
                    type="button"
                    className="ad-iconbtn ad-iconbtn--sm ad-iconbtn--danger"
                    onClick={() => reset(r)}
                    aria-label={r.source === "added" ? "Delete" : "Reset to original"}
                    title={r.source === "added" ? "Delete" : "Reset to original"}
                  >
                    {r.source === "added" ? <Trash2 /> : <RotateCcw />}
                  </button>
                )}
                <Link className="ad-btn ad-btn--sm" href={`/admin/projects/${r.p.slug}`}>
                  <Pencil />
                  Edit
                </Link>
              </span>
            </div>
          </article>
        ))}
        {!shown.length && <p className="ad-muted">Nothing here.</p>}
      </div>
    </>
  );
}
