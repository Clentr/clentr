"use client";

import { useMemo, useState } from "react";
import { KINDS, type Resource } from "@/content/resources";
import { Icon } from "../ui/Icon";
import { ResourceCard } from "./ResourceCard";

/** Category tabs, a search box and the shelf of resources. */
export function Library({ items }: { items: Resource[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = useMemo(() => ["All", ...new Set(items.map((r) => r.category))], [items]);
  const featured = items.find((r) => r.featured);

  const query = q.trim().toLowerCase();
  const shown = items.filter(
    (r) =>
      (cat === "All" || r.category === cat) &&
      (!query || [r.title, r.description, r.category, KINDS[r.kind]?.label].join(" ").toLowerCase().includes(query)),
  );
  const filtering = cat !== "All" || Boolean(query);
  const shelf = filtering || !featured ? shown : shown.filter((r) => r !== featured);

  if (!items.length)
    return (
      <div className="lib__empty card">
        <span className="icon-tile">
          <Icon name="hourglass" />
        </span>
        <b>The first resources are on their way.</b>
        <p>We’re finishing the guides and templates now — check back in a few days.</p>
      </div>
    );

  return (
    <>
      <div className="lib__bar">
        <div className="lib__cats" role="tablist" aria-label="Categories">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>
              {c}
              <em>{c === "All" ? items.length : items.filter((r) => r.category === c).length}</em>
            </button>
          ))}
        </div>
        <label className="lib__search">
          <Icon name="search" />
          <span className="sr-only">Search resources</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides, templates…" />
        </label>
      </div>

      {featured && !filtering && <ResourceCard r={featured} big />}

      {shelf.length ? (
        <div className="lib__grid">
          {shelf.map((r) => (
            <ResourceCard key={r.id} r={r} />
          ))}
        </div>
      ) : (
        <p className="lib__none">
          Nothing matches “{q || cat}”.{" "}
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("All");
            }}
          >
            Show everything
          </button>
        </p>
      )}
    </>
  );
}
