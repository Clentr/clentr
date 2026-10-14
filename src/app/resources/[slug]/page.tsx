import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { downloadUrl, fileType, formatSize, KINDS, viewOf } from "@/content/resources";
import { getLibrary, getResource } from "@/lib/resources";
import { BookCall } from "@/components/ui/BookCall";
import { Footer } from "@/components/ui/Footer";
import { Icon } from "@/components/ui/Icon";
import { Nav } from "@/components/ui/Nav";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceViewer, ShareResource } from "@/components/resources/ResourceViewer";

// Known resources are prerendered; ones added later render on first visit.
export const instant = false;

export async function generateStaticParams() {
  const { items } = await getLibrary();
  return items.length ? items.map((r) => ({ slug: r.slug || r.id })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const r = await getResource((await params).slug);
  if (!r) return {};
  const description = r.description || `A free ${KINDS[r.kind]?.label.toLowerCase() ?? "resource"} from Clentr.`;
  return {
    title: r.title,
    description,
    openGraph: { title: `${r.title} — free from Clentr`, description, type: "article", ...(r.cover ? { images: [{ url: r.cover }] } : {}) },
  };
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const r = await getResource((await params).slug);
  if (!r) notFound();
  const { items } = await getLibrary();
  const k = KINDS[r.kind] ?? KINDS.other;
  const view = viewOf(r);
  const dl = downloadUrl(r);
  const more = [...items.filter((x) => x.id !== r.id && x.category === r.category), ...items.filter((x) => x.id !== r.id && x.category !== r.category)].slice(0, 3);
  const facts = [
    ["Type", k.label],
    ["Category", r.category],
    r.detail && ["Length", r.detail],
    r.file && ["File", [fileType(r.fileName), formatSize(r.size)].filter(Boolean).join(" · ")],
    view.kind === "embed" || view.kind === "link" ? ["Hosted on", view.host] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className="page">
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main className="container rp">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/resources" className="back-pill">
            <Icon name="arrow-left" />
            Library
          </Link>
          <Link href="/resources">Free resources</Link>
          <span aria-hidden="true">›</span>
          <span>{r.category}</span>
        </nav>

        <header className="rp__head">
          <div className="rp__copy">
            <span className="rp__kind">
              <Icon name={k.icon} />
              {k.label}
              <em>Free</em>
            </span>
            <h1>{r.title}</h1>
            {r.description && <p>{r.description}</p>}
          </div>
          <div className="rp__actions">
            <ShareResource title={r.title} />
            {dl && (
              <a className="btn btn--ink btn--sm" href={dl} data-track={`resource_download:${r.title}`}>
                <Icon name="download" />
                Download
              </a>
            )}
            {!dl && r.link && (
              <a className="btn btn--ink btn--sm" href={r.link} target="_blank" rel="noopener" data-track={`resource_open:${r.title}`}>
                Open original
                <Icon name="arrow-up-right" className="arrow" />
              </a>
            )}
          </div>
        </header>

        <section className="rp__viewer" aria-label={r.title}>
          <ResourceViewer view={view} title={r.title} download={dl} />
        </section>

        <dl className="rp__facts">
          {facts.map(([t, d]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>

        <section className="lib__after card">
          <div>
            <b>Found this useful?</b>
            <p>It’s how we work on every product we build. If you’d like us to build yours, let’s talk — 30 minutes, no pitch deck needed.</p>
          </div>
          <div className="lib__after-ctas">
            <Link href="/#work" className="btn btn--ghost btn--sm">
              See our work
            </Link>
            <BookCall where={`resource:${r.slug || r.id}`} className="btn btn--ink btn--sm">
              Book a call
              <Icon name="arrow-up-right" className="arrow" />
            </BookCall>
          </div>
        </section>

        {more.length > 0 && (
          <section className="rp__more">
            <div className="rp__more-head">
              <h2>More free resources</h2>
              <Link href="/resources" className="rp__all">
                See the library
                <Icon name="arrow-right" />
              </Link>
            </div>
            <div className="lib__grid">
              {more.map((m) => (
                <ResourceCard key={m.id} r={m} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
