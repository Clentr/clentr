import Link from "next/link";
import { bookCallHref } from "@/content/site";
import { carouselOrder, getProject, mobileApps, webDesktop, type Project } from "@/content/projects";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";
import { WorkCard } from "../work/WorkCard";

export function Hero() {
  const cards = carouselOrder.map((s) => getProject(s)).filter(Boolean) as Project[];
  return (
    <section aria-labelledby="hero-title">
      <div className="container hero">
        <Link href="/contact" className="pill-link">
          <span className="dot-live" />
          Taking on new projects this quarter
          <Icon name="arrow-right" />
        </Link>
        <h1 className="h1" id="hero-title">
          We design and engineer
          <br /> software people <span className="dim">actually use.</span>
        </h1>
        <p className="lead">
          Clentr takes ideas from first sketch to shipped software across mobile apps, web platforms, desktop tools and AI
          systems.
        </p>
        <div className="hero__ctas">
          <a href={bookCallHref} className="btn btn--ink">
            <Icon name="calendar" />
            Book a 30-min call
            <Icon name="arrow-up-right" className="arrow" />
          </a>
          <Link href="/#work" className="btn btn--ghost">
            <Icon name="folder" />
            Explore our work
          </Link>
        </div>
        <div className="proof">
          <span className="proof__apps" aria-hidden="true">
            {mobileApps.slice(0, 5).map((p) => (
              <Art key={p.slug} name={`icon-${p.slug}`} themed alt="" sizes="30px" />
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
