import Link from "next/link";
import type { SiteContent } from "@/content/cms";
import { getWork } from "@/lib/projects";
import { ProjectIcon } from "../work/ProjectArt";
import { Icon } from "../ui/Icon";
import { WorkCard } from "../work/WorkCard";
import { BookCall } from "../ui/BookCall";

export async function Hero({ c }: { c: SiteContent["hero"] }) {
  const { mobileApps, webDesktop, carousel: cards } = await getWork();
  return (
    <section aria-labelledby="hero-title">
      <div className="container hero">
        <Link href="/contact" className="pill-link">
          <span className="dot-live" />
          {c.pill}
          <Icon name="arrow-right" />
        </Link>
        <h1 className="h1" id="hero-title">
          {c.title} <span className="dim">{c.dim}</span>
        </h1>
        <p className="lead">{c.lead}</p>
        <div className="hero__ctas">
          <BookCall where="hero" className="btn btn--ink">
            <Icon name="calendar" />
            {c.primary}
            <Icon name="arrow-up-right" className="arrow" />
          </BookCall>
          <Link href="/#work" className="btn btn--ghost">
            <Icon name="folder" />
            {c.secondary}
          </Link>
        </div>
        <div className="proof">
          <span className="proof__apps" aria-hidden="true">
            {mobileApps.slice(0, 5).map((p) => (
              <ProjectIcon key={p.slug} p={p} size={30} />
            ))}
          </span>
          <span className="proof__item">
            <Icon name="rocket" />
            {mobileApps.length} products shipped
          </span>
          <span className="proof__item">
            <Icon name="sparkles" />
            {webDesktop.length} in R&amp;D
          </span>
          <span className="proof__item">
            <Icon name="monitor-smartphone" />
            iPhone, Android, web &amp; macOS
          </span>
        </div>
      </div>

      <div className="carousel" aria-label="Recent work">
        <div className="carousel__track">
          {[...cards, ...cards].map((p, i) => (
            <WorkCard key={`${p.slug}-${i}`} p={p} tabIndex={i >= cards.length ? -1 : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
