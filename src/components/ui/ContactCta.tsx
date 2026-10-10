import Link from "next/link";
import { bookCallHref } from "@/content/site";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

/** Dark closing band with the oversized mark. */
export function ContactCta() {
  return (
    <Reveal className="container">
      <section className="cta" aria-labelledby="cta-title">
        <div>
          <h2 className="h2" id="cta-title">
            You&apos;ve seen the work.
            <br />
            Let&apos;s build yours.
          </h2>
          <p>Tell us what you&apos;re making. We&apos;ll reply with how we&apos;d approach it — or book a call and talk it through.</p>
          <div className="cta__ctas">
            <a href={bookCallHref} className="btn btn--accent">
              <Icon name="calendar" />
              Book a 30-min call
              <Icon name="arrow-up-right" className="arrow" />
            </a>
            <Link href="/contact" className="btn btn--light">
              <Icon name="send" />
              Contact us
            </Link>
          </div>
        </div>
        <div className="big-mark" aria-hidden="true">
          {["", "", "", "", "c", "gap", "", "", ""].map((k, i) => (
            <i key={i} className={k} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
