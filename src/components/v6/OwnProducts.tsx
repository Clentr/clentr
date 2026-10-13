"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import type { SiteContent } from "@/content/cms";
import type { Project } from "@/content/projects";
import { Icon } from "../ui/Icon";
import { ProjectIcon } from "../work/ProjectArt";

/**
 * The statement that sets Clentr apart, set big. The second line is drawn in as the
 * section arrives; the paragraph lights up word by word as it scrolls past.
 */
export function OwnProducts({ c, apps }: { c: SiteContent["own"]; apps: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const body = useRef<HTMLParagraphElement>(null);
  const words = c.body.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    const p = body.current;
    if (!el || !p) return;
    const spans = Array.from(p.querySelectorAll("span"));
    const io = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add("is-in"), { threshold: 0.25 });
    io.observe(el);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      spans.forEach((s) => s.classList.add("on"));
      return () => io.disconnect();
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = p.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height + vh * 0.3)));
      const lit = Math.round(prog * spans.length);
      spans.forEach((s, i) => s.classList.toggle("on", i < lit));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className="section own7" aria-labelledby="own-title">
      <div className="container own7__inner">
        <span className="chip">
          <Icon name={c.icon} />
          {c.chip}
        </span>
        <h2 className="own7__title" id="own-title">
          <span className="own7__l1">{c.title}</span>
          <span className="own7__l2">
            <span>{c.dim}</span>
          </span>
        </h2>
        <p className="own7__body" ref={body}>
          {words.map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </p>
        <ul className="own7__apps" aria-label="Products we built and run">
          {apps.map((p, i) => (
            <li key={p.slug} style={{ "--i": i } as CSSProperties}>
              <Link href={`/work/${p.slug}`} aria-label={`${p.name} — ${p.kind}`}>
                <ProjectIcon p={p} size={64} className="own7__icon" />
                <span className="own7__name">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="own7__live">
          <span className="dot-live" />
          {apps.length} products live with real users
        </p>
        <Link href="/#work-folders" className="btn btn--ghost own7__cta">
          {c.cta}
          <Icon name="arrow-right" className="arrow" />
        </Link>
      </div>
    </section>
  );
}
