import { nav, services, site } from "@/content/site";
import { BrandMark } from "../ui/Icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <a href="#top" className="brand" aria-label={`${site.name} — back to top`}>
              <BrandMark className="brand__mark" />
              {site.name}
            </a>
            <p className="body" style={{ marginTop: 16, maxWidth: "32ch" }}>
              {site.description}
            </p>
          </div>
          <nav aria-label="Footer">
            <h2 className="label">Navigate</h2>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="label">Services</h2>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#capabilities">{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label">Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${site.email}`} style={{ overflowWrap: "anywhere" }}>
                  {site.email}
                </a>
              </li>
              <li>
                <a href="#contact">Start a project</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer__word" aria-hidden="true">
          {site.name}
        </p>
      </div>
      <div className="footer__bottom container">
        <span className="label">
          © {site.copyrightYear} {site.name}
        </span>
        <span className="label">{site.tagline}</span>
      </div>
    </footer>
  );
}
