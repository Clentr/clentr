import Link from "next/link";
import { bookCallHref, nav, services, site } from "@/content/site";
import { Icon } from "./Icon";
import { Lockup } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <Lockup />
            <p>Software engineering studio. We design and engineer software people actually use.</p>
            <span className="status-pill">
              <span className="dot-live" />
              Taking on new projects
            </span>
          </div>
          <nav aria-label="Studio">
            <h2>Studio</h2>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Capabilities</h2>
            <ul>
              {services.map((s) => (
                <li key={s.key}>
                  <Link href="/#services">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Get in touch</h2>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>
                  <Icon name="mail" />
                  {site.email}
                </a>
              </li>
              <li>
                <a href={bookCallHref}>
                  <Icon name="calendar" />
                  Book a call
                </a>
              </li>
              <li>
                <Link href="/contact">
                  <Icon name="send" />
                  Start a project
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Clentr. All rights reserved.</span>
          <div>
            <ThemeSwitch />
            <span>Designed and engineered in-house.</span>
          </div>
        </div>
      </div>
      <p className="footer__word" aria-hidden="true">
        clentr
      </p>
    </footer>
  );
}
