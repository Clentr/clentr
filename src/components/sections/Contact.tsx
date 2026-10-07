import { site } from "@/content/site";
import { LineReveal, Reveal } from "../ui/Reveal";
import { ArrowRight } from "../ui/Icons";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__glow" />
      <div className="container">
        <div className="section-head__meta">
          <span className="label label--accent">07 — Contact</span>
          <span className="label">
            <span className="dot" style={{ marginRight: 10 }} />
            Taking on new projects
          </span>
        </div>
        <h2 className="display contact__title" id="contact-title" style={{ marginTop: "clamp(40px, 6vw, 72px)" }}>
          <LineReveal lines={["Have an idea?", <span key="2" className="serif">Let&rsquo;s build it.</span>]} />
        </h2>
        <div className="contact__layout">
          <Reveal className="contact__aside">
            <p className="lead">
              Tell us what you&rsquo;re building and where you are with it. We read every message and reply personally.
            </p>
            <div>
              <span className="label" style={{ display: "block", marginBottom: 12 }}>
                Or write to us directly
              </span>
              <a className="contact__mail" href={`mailto:${site.email}`}>
                {site.email} <ArrowRight />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
