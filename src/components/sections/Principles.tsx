import { principles } from "@/content/site";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function Principles() {
  return (
    <section className="section" aria-labelledby="principles-title" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHead
          id="principles-title"
          index="05"
          label="Why Clentr"
          title={["How we think", <span key="2">about <span className="serif">building.</span></span>]}
        />
        <ol className="principles">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.k} className="principle" delay={i * 0.05}>
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="principle__k">{p.k}</h3>
              <p className="principle__v">{p.v}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
