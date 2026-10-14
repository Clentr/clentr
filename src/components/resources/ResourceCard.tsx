import { fileType, formatSize, KINDS, type Resource } from "@/content/resources";
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

/** One resource in the library: cover, what it is, and a download (or open) button. */
export function ResourceCard({ r, big = false }: { r: Resource; big?: boolean }) {
  const k = KINDS[r.kind] ?? KINDS.other;
  // Supabase serves "?download=" with a Content-Disposition header, so files save instead of opening.
  const href = r.file ? `${r.file}?download=${encodeURIComponent(r.fileName ?? "")}` : (r.link ?? "#");
  const isFile = Boolean(r.file);
  const meta = [r.detail, isFile ? [fileType(r.fileName), formatSize(r.size)].filter(Boolean).join(" · ") : "Opens in a new tab"].filter(Boolean);
  return (
    <article className={`rc card${big ? " rc--big" : ""}`}>
      <a
        className="rc__cover"
        href={href}
        {...(isFile ? {} : { target: "_blank", rel: "noopener" })}
        tabIndex={-1}
        aria-hidden="true"
        data-track={`resource:${r.title}`}
      >
        {r.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.cover} alt="" loading="lazy" />
        ) : (
          <PaperCover r={r} />
        )}
      </a>
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
          <a
            className="btn btn--ink btn--xs rc__get"
            href={href}
            {...(isFile ? {} : { target: "_blank", rel: "noopener" })}
                data-track={`resource:${r.title}`}
          >
            {isFile ? "Download" : "Open"}
            <Icon name={isFile ? "arrow-right" : "arrow-up-right"} className={isFile ? "rc__down" : "arrow"} />
          </a>
        </div>
      </div>
    </article>
  );
}
