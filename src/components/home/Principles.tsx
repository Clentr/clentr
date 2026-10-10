import { comparison, principles } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function Principles() {
  const [, hire, agency] = comparison.columns;
  return (
    <section className="section" aria-labelledby="principles-title">
      <div className="container">
        <SectionHead id="principles-title" chip="How we work" icon="star" title="Principles we" dim="build by." />
        <div className="principles">
          {principles.map((p, i) => (
            <Reveal as="article" key={p.title} className="principle card" delay={i * 60}>
              <span className="icon-tile">
                <Icon name={p.icon} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </div>

        <h2 className="h2 compare-title">
          Why teams pick a studio <span className="dim">over a hire.</span>
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
              {comparison.rows.map(([label, us, h, a]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className="us">
                    <span>
                      <Icon name="circle-check" />
                      {us}
                    </span>
                  </td>
                  <td className="other">
                    <span>
                      <Icon name="minus" />
                      {h}
                    </span>
                  </td>
                  <td className="other">
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
