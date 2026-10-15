import Link from "next/link";
import type { Project } from "@/content/projects";
import { BookCall } from "../ui/BookCall";
import { Icon } from "../ui/Icon";

/**
 * How a visitor gets to try the product: a live link when it's public, otherwise an
 * invitation to a guided walkthrough (NDA, private beta or no public build yet).
 */
export function ProjectAccess({ p }: { p: Project }) {
  if (p.liveUrl) {
    return (
      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="access access--live" data-track={`live_link:${p.slug}`}>
        <span className="access__pulse" aria-hidden="true" />
        <span className="access__text">
          <b>{p.liveLabel || `Open ${p.name}`}</b>
        </span>
        <span className="access__go" aria-hidden="true">
          <Icon name="arrow-up-right" />
        </span>
      </a>
    );
  }
  const badge = p.nda ? "Under NDA" : p.status === "rnd" ? "Private beta" : "Private demo";
  return (
    <div className="access access--private">
      <span className="access__lock" aria-hidden="true">
        <Icon name="lock" />
      </span>
      <div className="access__copy">
        <span className="access__badge">{badge}</span>
        <b>Want to experience {p.name}?</b>
        <p>{p.nda ? "This build is under NDA, so there’s no public link — but we’ll walk you through the real thing on a short call." : "We’ll walk you through the working product on a short call and show you how we’d build yours."}</p>
        <div className="access__ctas">
          <BookCall where={`access_${p.slug}`} className="btn btn--accent btn--xs">
            <Icon name="calendar" />
            Request a walkthrough
          </BookCall>
          <Link href={`/contact?project=${p.slug}`} className="btn btn--ghost btn--xs">
            <Icon name="send" />
            Request access
          </Link>
        </div>
      </div>
    </div>
  );
}
