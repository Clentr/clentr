import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/content";
import { ApplyForm } from "@/components/apply/ApplyForm";
import { Footer } from "@/components/ui/Footer";
import { Icon } from "@/components/ui/Icon";
import { Nav } from "@/components/ui/Nav";

export const metadata: Metadata = {
  title: "Request a call",
  description: "We take on a few new products each month. Tell us what you’re building — if it’s a fit, we’ll send you a time to talk.",
};

export default async function Apply() {
  const { content } = await getSite();
  const email = content.contact.email;
  return (
    <div className="page">
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/" className="back-pill">
            <Icon name="arrow-left" />
            Home
          </Link>
        </nav>
        <div className="contact apply-page">
          <div>
            <h1 className="h1">
              Request a call.
              <br />
              <span className="dim">Two minutes, tops.</span>
            </h1>
            <p className="contact__lead">
              We take on a small number of new products each month. These few questions help us see if we’re the right team, so the call is worth your time.
            </p>
            <div className="next card">
              <b>How it works</b>
              <ol>
                {["You tell us what you’re building", "We read it ourselves, within a day", "If it’s a fit, you pick a time for a 30-min call"].map((t, i) => (
                  <li key={t}>
                    <span>{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <a href={`mailto:${email}`} className="info card">
              <span className="icon-tile">
                <Icon name="mail" />
              </span>
              <div>
                <b>Prefer email?</b>
                <span>{email}</span>
              </div>
            </a>
          </div>
          <ApplyForm email={email} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
