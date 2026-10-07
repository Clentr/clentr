import { services } from "@/content/site";

/** Slow band of capabilities that bridges the hero into the page. */
export function Marquee() {
  const items = services.map((s) => s.title);
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={t} style={{ display: "contents" }}>
          <span className={`marquee__item ${i % 2 ? "marquee__item--muted" : ""}`}>{t}</span>
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
