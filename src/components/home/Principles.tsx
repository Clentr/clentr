import type { SiteContent } from "@/content/cms";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function Principles({ c }: { c: SiteContent["principles"] }) {
  const [hire = "", agency = ""] = c.compareColumns;
  return (
    <section className="section" aria-labelledby="principles-title">
      <div className="container">
        <SectionHead id="principles-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead} />
        <div className="principles">
          {c.items.map((p, i) => (
            <Reveal as="article" key={`${p.title}-${i}`} className="principle card" delay={i * 60}>
              <span className="icon-tile">
                <Icon name={p.icon} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </div>

        <h2 className="h2 compare-title">
          {c.compareTitle} <span className="dim">{c.compareDim}</span>
        </h2>
        <Reveal className="compare card">
          <table>
            <caption className="sr-only">Clentr compared with an in-house hire and a typical agency</caption>
            <thead>
              <tr>
                <td />
                <th scope="col" className="us">
                  <span className="lockup">
                    <Mark />
                    clentr
                  </span>
                </th>
                <th scope="col">
                  <span>
                    <Icon name="users" />
                    {hire}
                  </span>
                </th>
                <th scope="col">
                  <span>
                    <Icon name="app-window" />
                    {agency}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {c.compareRows.map(([label, us, h, a], r) => (
                <tr key={`${label}-${r}`}>
                  <th scope="row">{label}</th>
                  <td className="us" data-label="clentr">
                    <span>
                      <Icon name="circle-check" />
                      {us}
                    </span>
                  </td>
                  <td className="other" data-label={hire}>
                    <span>
                      <Icon name="minus" />
                      {h}
                    </span>
                  </td>
                  <td className="other" data-label={agency}>
                    <span>
                      <Icon name="x" />
                      {a}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
