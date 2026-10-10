import { mobileApps, webDesktop } from "@/content/projects";
import { Art } from "../ui/Art";
import { Mark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

/**
 * Proof points. Only real figures: the design's placeholder stats
 * (founder count, years, avatars) are left out until real numbers exist.
 */
export function Trust() {
  return (
    <section className="section" aria-labelledby="trust-title">
      <div className="container">
        <SectionHead
          id="trust-title"
          chip="Why founders trust us"
          icon="shield-check"
          title="Trusted by founders"
          dim="who ship."
          lead={`${mobileApps.length} products shipped and ${webDesktop.length} more in R&D — designed and engineered by the same team.`}
        />
        <div className="trust">
          <Reveal className="card stat stat--split">
            <div>
              <span className="stat__num">{mobileApps.length}</span>
              <span className="stat__label">products shipped</span>
              <p className="stat__text">
                Journaling, careers, relationships, social, fitness, local commerce and hospitality — live with real
                users.
              </p>
            </div>
            <Art name="trust-products" themed alt="App icons of shipped products" className="stat__art" sizes="200px" />
          </Reveal>
          <Reveal className="card stat" delay={80}>
            <span className="stat__num">4</span>
            <span className="stat__label">platforms, one team</span>
            <Art name="trust-platforms" themed alt="iPhone, Android, web and macOS" className="stat__art" sizes="200px" />
          </Reveal>
        </div>
        <div className="trust__row2 trust__row2--two">
          <Reveal className="card stat">
            <h3 className="stat__title">Built to scale</h3>
            <p className="stat__text" style={{ color: "var(--ink-2)", marginTop: 10 }}>
              From MVP to v1 to scale — on the same codebase.
            </p>
            <Art name="trust-growth" themed alt="" className="stat__art" sizes="340px" />
          </Reveal>
          <Reveal className="card stat" delay={80}>
            <span className="stat__num">&lt; 1 day</span>
            <span className="stat__label">to a real reply</span>
            <div className="chat" aria-hidden="true">
              <span className="bubble bubble--me">Can you take over our half-built app?</span>
              <span className="bubble-row">
                <Mark />
                <span className="bubble bubble--them">Yes — send the repo. We&apos;ll review it this week.</span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
