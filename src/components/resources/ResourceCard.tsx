import Link from "next/link";
import { fileType, formatSize, KINDS, resourcePath, viewOf, type Resource } from "@/content/resources";
import { Icon } from "../ui/Icon";

/** The paper-sheet cover used when a resource has no cover image. */
function PaperCover({ r }: { r: Resource }) {
  const k = KINDS[r.kind] ?? KINDS.other;
  return (
    <span className="rc__paper" aria-hidden="true">
      <span className="rc__sheet rc__sheet--back" />
      <span className="rc__sheet">
        <span className="rc__sheet-kind">
          <Icon name={k.icon} />
          {k.label}
        </span>
        <b>{r.title}</b>
        <i />
        <i />
        <i />
        <i className="is-short" />
      </span>
    </span>
  );
}

const VERB: Record<string, string> = { article: "Read", pdf: "Read", office: "Open", text: "Open", image: "View", video: "Watch", audio: "Listen", embed: "Open", link: "Open", file: "Get it" };

/** One resource in the library: the whole card opens its page, where it reads right on the site. */
export function ResourceCard({ r, big = false }: { r: Resource; big?: boolean }) {
  const k = KINDS[r.kind] ?? KINDS.other;
  const view = viewOf(r);
  const meta = [r.detail, r.file ? [fileType(r.fileName), formatSize(r.size)].filter(Boolean).join(" · ") : view.kind === "embed" || view.kind === "link" ? view.host : view.kind === "article" ? "Article" : ""].filter(Boolean);
  return (
    <article className={`rc card${big ? " rc--big" : ""}`}>
      <Link href={resourcePath(r)} className="rc__hit" aria-label={`${VERB[view.kind]} ${r.title}`} data-track={`resource:${r.title}`} />
      <span className="rc__cover" aria-hidden="true">
        {r.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.cover} alt="" loading="lazy" />
        ) : (
          <PaperCover r={r} />
        )}
      </span>
      <div className="rc__body">
        <span className="rc__kind">
          <Icon name={k.icon} />
          {k.label}
          <em>{r.category}</em>
        </span>
        <h3>{r.title}</h3>
        {r.description && <p>{r.description}</p>}
        <div className="rc__foot">
          <small>{meta.join(" · ")}</small>
          <span className="btn btn--ink btn--xs rc__get" aria-hidden="true">
            {VERB[view.kind]}
            <Icon name="arrow-right" className="arrow" />
          </span>
        </div>
      </div>
    </article>
  );
}
