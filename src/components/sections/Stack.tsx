import { stack } from "@/content/site";
import { LineReveal, Reveal } from "../ui/Reveal";

export function Stack() {
  return (
    <section className="section" aria-labelledby="stack-title">
      <div className="container">
        <div className="stack__layout">
          <div className="stack__sticky">
            <span className="label label--accent">04 — Engineering</span>
            <h2 className="h2" id="stack-title" style={{ marginTop: 24 }}>
              <LineReveal lines={["The stack", <span key="2">behind the <span className="serif">work.</span></span>]} />
            </h2>
            <Reveal delay={0.1}>
              <p className="lead" style={{ marginTop: 24 }}>
                No tool on this list is decorative. Every one of them runs in at least one of the products above.
              </p>
            </Reveal>
          </div>
          <div className="stack__rows">
            {stack.map((g, i) => (
              <Reveal key={g.group} className="stack__row" delay={i * 0.05}>
                <span className="label">
                  {String(i + 1).padStart(2, "0")} {g.group}
                </span>
                <ul className="stack__items">
                  {g.items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
