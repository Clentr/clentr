"use client";

import { useEffect, useState } from "react";
import { BookCall } from "./BookCall";
import { Icon } from "./Icon";

/** Phones only: a "Request a call" bar that appears once the hero has scrolled away, and hides at the final CTA. */
export function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const cta = document.querySelector(".cta")?.getBoundingClientRect();
      const nearEnd = cta ? cta.top < window.innerHeight : false;
      setShow(window.scrollY > window.innerHeight * 0.9 && !nearEnd);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className={`mcta ${show ? "is-on" : ""}`} aria-hidden={!show}>
      <span>
        <b>Have an idea?</b>
        <small>Reply within 24 hours</small>
      </span>
      <BookCall where="mobile_bar" className="btn btn--ink btn--sm">
        <Icon name="calendar" />
        Request a call
      </BookCall>
    </div>
  );
}
