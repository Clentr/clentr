import type { Metadata } from "next";
import Link from "next/link";
import { bookCallHref, site } from "@/content/site";
import { Footer } from "@/components/ui/Footer";
import { Icon } from "@/components/ui/Icon";
import { Nav } from "@/components/ui/Nav";
import { ContactForm } from "@/components/work/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us what you’re making. A real person replies within one working day.",
};

export default function Contact() {
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
        <div className="contact">
          <div>
            <h1 className="h1">
              Let’s build
              <br />
              <span className="dim">something real.</span>
            </h1>
            <p className="contact__lead">
              Tell us what you’re making. A real person replies within one working day — or skip the form and book a call.
            </p>
            <div className="info card">
              <span className="icon-tile">
                <Icon name="calendar" />
              </span>
              <div>
                <b>Book a 30-min call</b>
                <span>Tell us a time that suits you and we’ll confirm by email.</span>
                <br />
                <a href={bookCallHref} className="btn btn--ink btn--xs">
                  Book a call
                  <Icon name="arrow-up-right" className="arrow" />
                </a>
              </div>
            </div>
            <a href={`mailto:${site.email}`} className="info card">
              <span className="icon-tile">
                <Icon name="mail" />
              </span>
              <div>
                <b>Email us</b>
                <span>{site.email}</span>
              </div>
            </a>
            <div className="info card">
              <span className="icon-tile">
                <Icon name="clock" />
              </span>
              <div>
                <b>Reply time</b>
                <span>Within one working day, from a real person.</span>
              </div>
            </div>
            <div className="next card">
              <b>What happens next</b>
              <ol>
                {["We read your brief and reply with questions", "A 30-min call to agree scope", "A written plan with stages and cost"].map((t, i) => (
                  <li key={t}>
                    <span>{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
