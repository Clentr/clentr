import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/cms";
import { getWork } from "@/lib/projects";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import { ProjectIcon } from "../work/ProjectArt";

/** Proof points in one compact band: four tiles, each with a small live detail. Real figures only. */
export async function Trust({ c }: { c: SiteContent["trust"] }) {
  const { mobileApps, webDesktop } = await getWork();
  const bars = [18, 26, 32, 40, 52, 66, 84, 100];
  return (
    <section className="section" aria-labelledby="trust-title">
      <div className="container">
        <SectionHead
          id="trust-title"
          chip={c.chip}
          icon={c.icon}
          title={c.title}
          dim={c.dim}
          lead={c.lead.replaceAll("{shipped}", String(mobileApps.length)).replaceAll("{rnd}", String(webDesktop.length))}
        />
        <Reveal className="trust7">
          <div className="trust7__tile">
            <span className="trust7__num">{mobileApps.length}</span>
            <span className="trust7__label">{c.shippedLabel}</span>
            <span className="trust7__fan" aria-hidden="true">
              {mobileApps.slice(0, 6).map((p, i) => (
                <span key={p.slug} style={{ "--i": i } as CSSProperties}>
                  <ProjectIcon p={p} size={40} />
                </span>
              ))}
            </span>
          </div>
          <div className="trust7__tile">
            <span className="trust7__num">{c.platforms}</span>
            <span className="trust7__label">{c.platformsLabel}</span>
            <span className="trust7__chips" aria-hidden="true">
              {[["smartphone", "iOS"], ["smartphone", "Android"], ["globe", "Web"], ["monitor", "macOS"]].map(([ic, t], i) => (
                <span key={t} style={{ "--i": i } as CSSProperties}>
                  <Icon name={ic} />
                  {t}
                </span>
              ))}
            </span>
          </div>
          <div className="trust7__tile">
            <span className="trust7__num trust7__num--sm">{c.scaleTitle}</span>
            <span className="trust7__label">{c.scaleText}</span>
            <span className="trust7__bars" aria-hidden="true">
              {bars.map((h, i) => (
                <i key={i} style={{ "--h": `${h}%`, "--i": i } as CSSProperties} />
              ))}
            </span>
          </div>
          <div className="trust7__tile">
            <span className="trust7__num">{c.replyNum}</span>
            <span className="trust7__label">{c.replyLabel}</span>
            <span className="trust7__chat" aria-hidden="true">
              <span className="trust7__q">{c.replyQ}</span>
              <span className="trust7__a">
                <Mark />
                {c.replyA}
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
