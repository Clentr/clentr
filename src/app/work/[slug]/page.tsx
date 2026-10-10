import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getProject, moreWork, projects } from "@/content/projects";
import { bookCallHref } from "@/content/site";
import { Art } from "@/components/ui/Art";
import { Icon } from "@/components/ui/Icon";
import { Lockup, Mark } from "@/components/ui/Logo";
import { Nav } from "@/components/ui/Nav";
import { Reveal } from "@/components/ui/Reveal";
import { Share } from "@/components/work/Share";
import { WorkCard } from "@/components/work/WorkCard";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.name} — ${p.tagline}`, description: p.product };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const shipped = p.status === "shipped";
  // "Every screen" continues the gallery's numbering.
  const captions = p.captions;

  return (
    <div className="page" style={{ "--p": p.color } as CSSProperties}>
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/#work" className="back-pill">
            <Icon name="arrow-left" />
            All work
          </Link>
          <Link href="/#work">Work</Link>
          <span aria-hidden="true">›</span>
          <span>{shipped ? "Shipped" : "In R&D"}</span>
          <span aria-hidden="true">›</span>
          <span className="here" aria-current="page">
            {p.name}
          </span>
        </nav>

        <header className="cs-hero">
          <div className="cs-hero__copy">
            <div className="cs-eyebrow">
              <Art name={`icon-${p.slug}`} themed alt="" sizes="34px" />
              {p.eyebrow}
            </div>
            <h1 className="h1 cs-title">
              {p.name} — <span className="dim">{p.tagline}</span>
            </h1>
            <div className="cs-by">
              <span className="mark-tile">
                <Mark ink="#fff" lit="#2d46ff" />
              </span>
              <span>
                <b>Designed &amp; engineered by Clentr</b>
                <span>{p.servicesLine}</span>
              </span>
            </div>
            <div className="cs-actions">
              <Share title={`${p.name} — Clentr case study`} />
              {!shipped && (
                <Link href="/contact" className="btn btn--ink btn--xs">
                  <Icon name="send" />
                  Request a demo
                </Link>
              )}
            </div>
          </div>
          <div className="cs-visual">
            <Art name={`cs-${p.slug}-hero`} alt={`${p.name} product screens`} priority sizes="(max-width: 1024px) 92vw, 600px" />
          </div>
        </header>

        <hr className="cs-rule" />

        <div className="cs-body">
          <aside className="cs-about" aria-label={`About ${p.name}`}>
            <div className="cs-about__name">
              <Art name={`icon-${p.slug}`} themed alt="" sizes="28px" />
              {p.name}
            </div>
            <p>{p.short}</p>
            <dl>
              {p.about.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <article className="cs-main">
            <p className="cs-quote">
              <b>“</b>
              {p.quote}
              <b>”</b>
            </p>
            <h2>The product</h2>
            <p>{p.product}</p>
            <h2>The challenge</h2>
            <p>{p.challenge}</p>
            <h2>How we built it</h2>
            <ul className="ticks">
              {p.built.map((b) => (
                <li key={b}>
                  <Icon name="check" />
                  {b}
                </li>
              ))}
            </ul>

            {p.gallery.length > 0 && (
              <Reveal className="gallery" style={{ "--n": p.gallery.length } as CSSProperties}>
                <div className="gallery__row">
                  {p.gallery.map((g, i) => (
                    <figure key={g}>
                      <Art name={g} alt={`${p.name} screen ${i + 1}`} sizes="148px" />
                      {p.galleryCaptions[i] && <figcaption>{p.galleryCaptions[i]}</figcaption>}
                    </figure>
                  ))}
                </div>
              </Reveal>
            )}
            {p.galleryWide && (
              <Reveal className="gallery gallery--wide">
                <Art name={p.galleryWide} alt={`${p.name} interface`} sizes="640px" />
              </Reveal>
            )}

            <h2>What it proves</h2>
            <ul className="ticks">
              {p.proves.map((b) => (
                <li key={b}>
                  <Icon name="sparkles" />
                  {b}
                </li>
              ))}
            </ul>

            {p.screens.length > 0 && (
              <>
                <h2>Every screen</h2>
                <div className="screens">
                  {p.screens.map((s, i) => (
                    <figure key={s}>
                      <Art name={s} alt={captions[i] ?? `${p.name} screen`} sizes="112px" />
                      <figcaption>{captions[i]}</figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </article>

          <aside className="cs-side" aria-label="Services">
            <h2>SERVICES</h2>
            <ul>
              {p.services.map((s) => (
                <li key={s}>
                  <Icon name="check" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="similar card">
              <b>Building something similar?</b>
              <p>We reply within one working day.</p>
              <a href={bookCallHref} className="btn btn--ink btn--xs">
                <Icon name="calendar" />
                Book a call
              </a>
            </div>
          </aside>
        </div>

        <section className="more" aria-label="More work">
          <span>MORE WORK</span>
          <div className="more__row">
            {moreWork(p.slug).map((m) => (
              <WorkCard key={m.slug} p={m} />
            ))}
          </div>
        </section>

        <Reveal className="closing card">
          <div>
            <h2>Liked how {p.name} came together?</h2>
            <p>Let’s design and build yours — same team, same care.</p>
            <div className="closing__ctas">
              <a href={bookCallHref} className="btn btn--ink btn--sm">
                <Icon name="calendar" />
                Book a 30-min call
                <Icon name="arrow-up-right" className="arrow" />
              </a>
              <Link href="/contact" className="btn btn--ghost btn--sm">
                <Icon name="send" />
                Contact us
              </Link>
            </div>
          </div>
          <Art name={`cs-${p.slug}-closing`} alt="" className="closing__icons" sizes="320px" />
        </Reveal>

        <footer className="mini-foot">
          <Lockup />
          <span>© 2026 Clentr · Designed and engineered in-house.</span>
          <Link href="/#work">
            Back to all work
            <Icon name="arrow-up-right" />
          </Link>
        </footer>
      </main>
    </div>
  );
}
