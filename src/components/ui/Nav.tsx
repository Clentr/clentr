"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { bookCallHref, nav } from "@/content/site";
import { Icon } from "./Icon";
import { Lockup } from "./Logo";

/** Floating pill nav. Highlights the section in view on the home page. */
export function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>(pathname.startsWith("/work") ? "/#work" : pathname === "/contact" ? "/contact" : "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["services", "work", "ai", "process", "faqs"];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`/#${e.target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="nav container">
      <nav className="nav__bar" aria-label="Primary">
        <Lockup />
        <ul className="nav__links">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={active === n.href ? "true" : undefined}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={bookCallHref} className="btn btn--ink btn--sm nav__cta">
          <Icon name="calendar" />
          Book a call
          <Icon name="arrow-up-right" className="arrow" />
        </a>
        <button type="button" className="round-btn nav__menu" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <Icon name="menu" />
        </button>
      </nav>
      {open && (
        <div className="nav__sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="nav__sheet-top">
            <Lockup />
            <button type="button" className="round-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Icon name="x" />
            </button>
          </div>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={bookCallHref} className="btn btn--ink">
            <Icon name="calendar" />
            Book a 30-min call
          </a>
        </div>
      )}
    </header>
  );
}
