import type { Metadata } from "next";
import Link from "next/link";
import { getLibrary } from "@/lib/resources";
import { BookCall } from "@/components/ui/BookCall";
import { Footer } from "@/components/ui/Footer";
import { Icon } from "@/components/ui/Icon";
import { Nav } from "@/components/ui/Nav";
import { Library } from "@/components/resources/Library";

export const metadata: Metadata = {
  title: "Free resources",
  description: "Guides, templates and checklists from the Clentr team — free to download, no email needed.",
};

export default async function Resources() {
  const lib = await getLibrary();
  return (
    <div className="page">
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main className="container lib">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/" className="back-pill">
            <Icon name="arrow-left" />
            Home
          </Link>
        </nav>
        <header className="lib__head">
          <span className="chip">
            <Icon name="book-open" />
            Free library
          </span>
          <h1 className="h1">
            {lib.title} <span className="dim">{lib.dim}</span>
          </h1>
          <p className="lead">{lib.lead}</p>
          <ul className="lib__promise">
            {[
              ["badge-check", "Made by the team that ships our own apps"],
              ["lock", "No sign-up, no email"],
              ["repeat", "New resources added regularly"],
            ].map(([i, t]) => (
              <li key={t}>
                <Icon name={i} />
                {t}
              </li>
            ))}
          </ul>
        </header>

        <Library items={lib.items} />

        <section className="lib__after card">
          <div>
            <b>Want this done for you?</b>
            <p>Clentr designs and builds apps, platforms and AI systems for founders — from first sketch to launch.</p>
          </div>
          <div className="lib__after-ctas">
            <Link href="/#work" className="btn btn--ghost btn--sm">
              See our work
            </Link>
            <BookCall where="resources" className="btn btn--ink btn--sm">
              Book a call
              <Icon name="arrow-up-right" className="arrow" />
            </BookCall>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
