"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdown";
import { Icon } from "../ui/Icon";

/** Thin bar under the nav that fills as you read; also remembers ticked checklist items. */
export function ArticleProgress({ storageKey }: { storageKey: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const body = document.querySelector<HTMLElement>(".art__prose");
    if (!body) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setP(Math.min(1, Math.max(0, (window.innerHeight * 0.3 - r.top) / Math.max(1, total))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Checklists: each reader's ticks are kept on their device.
    const boxes = [...body.querySelectorAll<HTMLInputElement>("input.art__check")];
    let saved: boolean[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      /* storage blocked */
    }
    boxes.forEach((b, i) => {
      if (typeof saved[i] === "boolean") b.checked = saved[i];
      b.closest("li")?.classList.toggle("is-done", b.checked);
    });
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (!t.matches("input.art__check")) return;
      t.closest("li")?.classList.toggle("is-done", t.checked);
      try {
        localStorage.setItem(storageKey, JSON.stringify(boxes.map((b) => b.checked)));
      } catch {
        /* storage blocked */
      }
    };
    body.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      body.removeEventListener("change", onChange);
      cancelAnimationFrame(raf);
    };
  }, [storageKey]);
  return (
    <div className="art__progress" aria-hidden="true">
      <i style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

/** "On this page", with the section you're reading highlighted. */
export function ArticleToc({ toc }: { toc: TocItem[] }) {
  const [at, setAt] = useState(toc[0]?.id);
  useEffect(() => {
    const heads = toc.map((t) => document.getElementById(t.id)).filter((h): h is HTMLElement => Boolean(h));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setAt(vis.target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [toc]);
  if (toc.length < 2) return null;
  return (
    <nav className="art__toc" aria-label="On this page">
      <span>On this page</span>
      <ol>
        {toc.map((t) => (
          <li key={t.id} className={t.depth === 3 ? "is-sub" : undefined}>
            <a href={`#${t.id}`} aria-current={at === t.id ? "true" : undefined}>
              {t.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Saves the article as a PDF. Uses the uploaded PDF when there is one; otherwise prints the page
 * with the print stylesheet (clean, branded layout) — the browser's "Save as PDF".
 */
export function PdfButton({ title, file, className = "btn btn--ink btn--sm", label = "Download PDF" }: { title: string; file?: string; className?: string; label?: string }) {
  if (file)
    return (
      <a className={className} href={file} data-track={`resource_pdf:${title}`}>
        <Icon name="download" />
        {label}
      </a>
    );
  return (
    <button
      type="button"
      className={className}
      data-track={`resource_pdf:${title}`}
      onClick={() => {
        const before = document.title;
        document.title = `${title} — Clentr`; // becomes the PDF's file name
        window.print();
        window.setTimeout(() => (document.title = before), 500);
      }}
    >
      <Icon name="download" />
      {label}
    </button>
  );
}
