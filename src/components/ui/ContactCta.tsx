import Link from "next/link";
import type { SiteContent } from "@/content/cms";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { BookCall } from "./BookCall";
import { Mark } from "./Logo";

/** Dark closing band with the oversized mark. */
export function ContactCta({ c }: { c: SiteContent["cta"] }) {
  return (
    <Reveal className="container">
      <section className="cta" aria-labelledby="cta-title">
        <div>
          <h2 className="h2" id="cta-title">
            {c.title}
            <br />
            {c.title2}
          </h2>
          <p>{c.text}</p>
          <div className="cta__ctas">
            <BookCall where="cta" className="btn btn--accent">
              <Icon name="calendar" />
              Request a call
              <Icon name="arrow-up-right" className="arrow" />
            </BookCall>
            <Link href="/contact" className="btn btn--light">
              <Icon name="send" />
              Send us your idea
            </Link>
          </div>
        </div>
        <Mark className="big-mark big-mark--stroke" ink="currentColor" width={5.5} />
      </section>
    </Reveal>
  );
}
