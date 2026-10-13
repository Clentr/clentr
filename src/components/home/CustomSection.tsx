import Image from "next/image";
import Link from "next/link";
import type { CustomSection as Section } from "@/content/cms";
import { BookCall } from "../ui/BookCall";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

type D = Record<string, unknown>;
const str = (d: D, k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");
const list = <T,>(d: D, k: string) => (Array.isArray(d[k]) ? (d[k] as T[]) : []);

function Head({ d, id }: { d: D; id: string }) {
  if (!str(d, "title")) return null;
  return <SectionHead id={id} chip={str(d, "chip")} icon={str(d, "icon") || "sparkles"} title={str(d, "title")} dim={str(d, "dim")} lead={str(d, "lead")} />;
}

/** A button that either books a call ("book"), goes to a page on the site, or opens a link. */
function Cta({ label, href, where, className }: { label: string; href: string; where: string; className: string }) {
  if (!label) return null;
  const inner = (
    <>
      <Icon name={href === "book" ? "calendar" : "arrow-right"} />
      {label}
    </>
  );
  if (href === "book" || !href) return <BookCall where={where} className={className}>{inner}</BookCall>;
  if (href.startsWith("/")) return <Link href={href} className={className}>{inner}</Link>;
  return (
    <a href={href} className={className} target="_blank" rel="noopener">
      {inner}
    </a>
  );
}

/** Sections added from the admin panel, rendered with the site's own components. */
export function CustomSection({ s }: { s: Section }) {
  const d = s.data;
  const id = `sec-${s.id.slice(0, 8)}`;

  switch (s.template) {
    case "features":
      return (
        <section className="section" id={`s-${s.id.slice(0, 8)}`} aria-labelledby={id}>
          <div className="container">
            <Head d={d} id={id} />
            <div className="xfeatures">
              {list<D>(d, "items").map((it, i) => (
                <Reveal as="article" key={i} className="card xfeature" delay={(i % 4) * 60}>
                  <span className="icon-tile">
                    <Icon name={str(it, "icon") || "sparkles"} />
                  </span>
                  <h3>{str(it, "title")}</h3>
                  <p>{str(it, "body")}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "media": {
      const img = str(d, "image");
      return (
        <section className="section" id={`s-${s.id.slice(0, 8)}`} aria-labelledby={id}>
          <div className="container">
            <Reveal className={`card xmedia ${str(d, "flip") === "left" ? "xmedia--flip" : ""}`}>
              <div className="xmedia__copy">
                {str(d, "chip") && (
                  <span className="chip">
                    <Icon name={str(d, "icon") || "sparkles"} />
                    {str(d, "chip")}
                  </span>
                )}
                <h2 className="h2" id={id}>
                  {str(d, "title")} <span className="dim">{str(d, "dim")}</span>
                </h2>
                <p>{str(d, "body")}</p>
                {list<string>(d, "points").length > 0 && (
                  <ul className="ticks">
                    {list<string>(d, "points").map((p) => (
                      <li key={p}>
                        <Icon name="check" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                <Cta label={str(d, "button")} href={str(d, "href")} where={`section_${s.id.slice(0, 6)}`} className="btn btn--ink btn--sm" />
              </div>
              <div className="xmedia__art">
                {img ? <Image src={img} alt="" fill sizes="(max-width: 900px) 92vw, 560px" /> : <span className="xmedia__empty"><Mark /></span>}
              </div>
            </Reveal>
          </div>
        </section>
      );
    }

    case "stats":
      return (
        <section className="section" id={`s-${s.id.slice(0, 8)}`} aria-labelledby={id}>
          <div className="container">
            <Head d={d} id={id} />
            <div className="xstats">
              {list<D>(d, "items").map((it, i) => (
                <Reveal key={i} className="card stat" delay={i * 60}>
                  <span className="stat__num">{str(it, "value")}</span>
                  <span className="stat__label">{str(it, "label")}</span>
                  {str(it, "text") && <p className="stat__text">{str(it, "text")}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "quote": {
      const photo = str(d, "photo");
      return (
        <section className="section" id={`s-${s.id.slice(0, 8)}`}>
          <div className="container">
            <Reveal as="figure" className="card xquote">
              <Icon name="message-circle" className="xquote__mark" />
              <blockquote>{str(d, "quote")}</blockquote>
              <figcaption>
                {photo && <Image src={photo} alt="" width={48} height={48} />}
                <span>
                  <b>{str(d, "name")}</b>
                  <span>{str(d, "role")}</span>
                </span>
              </figcaption>
            </Reveal>
          </div>
        </section>
      );
    }

    case "logos": {
      const logos = list<D>(d, "logos").filter((l) => str(l, "image"));
      if (!logos.length) return null;
      return (
        <section className="section section--tight" id={`s-${s.id.slice(0, 8)}`}>
          <div className="container">
            <p className="xlogos__label">{str(d, "label")}</p>
            <div className="xlogos">
              {logos.map((l, i) => (
                <span key={i} className="xlogos__item">
                  <Image src={str(l, "image")} alt={str(l, "name")} fill sizes="160px" />
                </span>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "cta":
      return (
        <section className="section section--tight" id={`s-${s.id.slice(0, 8)}`}>
          <div className="container">
            <Reveal className="xcta">
              <div>
                <h2 className="h2">{str(d, "title")}</h2>
                <p>{str(d, "text")}</p>
              </div>
              <Cta label={str(d, "button")} href={str(d, "href")} where={`section_${s.id.slice(0, 6)}`} className="btn btn--accent" />
            </Reveal>
          </div>
        </section>
      );
  }
}
