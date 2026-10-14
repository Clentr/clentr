"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Eye, EyeOff, Library, Pencil, Star, Trash2 } from "lucide-react";
import { KINDS, resourcePath, type Resource } from "@/content/resources";
import { Icon } from "@/components/ui/Icon";
import { Empty } from "../../_ui/kit";
import { deleteResource, setResourcePublished } from "../../resource-actions";

/** Every resource, filterable by category, with publish and delete controls. */
export function ResourceList({ items: initial }: { items: Resource[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [cat, setCat] = useState("All");
  const [, start] = useTransition();
  const cats = ["All", ...new Set(items.map((r) => r.category))];
  const shown = items.filter((r) => cat === "All" || r.category === cat);

  function toggle(r: Resource) {
    setItems((all) => all.map((x) => (x.id === r.id ? { ...x, published: !r.published } : x)));
    start(async () => {
      await setResourcePublished(r.id, !r.published);
      router.refresh();
    });
  }
  function remove(r: Resource) {
    if (!confirm(`Delete “${r.title}” and its files? This can’t be undone.`)) return;
    setItems((all) => all.filter((x) => x.id !== r.id));
    start(async () => {
      await deleteResource(r.id);
      router.refresh();
    });
  }

  if (!items.length)
    return (
      <Empty icon={Library} text="No resources yet. Add the first guide, template or checklist — visitors see a “coming soon” note until then.">
        <Link href="/admin/resources/new" className="ad-btn ad-btn--primary">
          New resource
        </Link>
      </Empty>
    );

  return (
    <>
      <div className="ad-tabs ad-tabs--bar" role="tablist">
        {cats.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>
            {c}
            <em>{c === "All" ? items.length : items.filter((r) => r.category === c).length}</em>
          </button>
        ))}
      </div>
      <ul className="rl">
        {shown.map((r) => (
          <li key={r.id} className={`rl__row ad-card ${r.published ? "" : "is-hidden"}`}>
            <span className="rl__thumb">
              {r.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.cover} alt="" />
              ) : (
                <Icon name={(KINDS[r.kind] ?? KINDS.other).icon} />
              )}
            </span>
            <span className="rl__main">
              <b>
                {r.title}
                {r.featured && (
                  <span className="rl__feat" title="Featured — shown large at the top">
                    <Star />
                    Featured
                  </span>
                )}
              </b>
              <small>
                {(KINDS[r.kind] ?? KINDS.other).label} · {r.category} · {resourcePath(r)}
              </small>
            </span>
            <span className="rl__tools">
              <button type="button" className={`ol__vis ${r.published ? "is-on" : ""}`} role="switch" aria-checked={r.published} onClick={() => toggle(r)}>
                {r.published ? <Eye /> : <EyeOff />}
                {r.published ? "Live" : "Hidden"}
              </button>
              <a className="ad-iconbtn ad-iconbtn--sm" href={resourcePath(r)} target="_blank" rel="noopener" aria-label="Open its page" title="Open its page">
                <ExternalLink />
              </a>
              <button type="button" className="ad-iconbtn ad-iconbtn--sm ad-iconbtn--danger" onClick={() => remove(r)} aria-label="Delete" title="Delete">
                <Trash2 />
              </button>
              <Link className="ad-btn ad-btn--sm" href={`/admin/resources/${r.id}`}>
                <Pencil />
                Edit
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
