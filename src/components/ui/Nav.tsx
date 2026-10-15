"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Icon } from "./Icon";
import { Lockup } from "./Logo";
import { BookCall } from "./BookCall";

/** Floating pill nav. Highlights the link you clicked, or the page you are on. */
export function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>(pathname.startsWith("/work") ? "/#work" : pathname === "/contact" ? "/contact" : "");
  const [open, setOpen] = useState(false);

  // On the home page nothing is highlighted until a link is clicked; scrolling back to the top clears it.
  useEffect(() => {
    if (pathname !== "/") return;
    const onScroll = () => window.scrollY < 80 && setActive("");
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
              <Link href={n.href} aria-current={active === n.href ? "true" : undefined} onClick={() => setActive(n.href)}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <BookCall where="nav" className="btn btn--ink btn--sm nav__cta">
          <Icon name="calendar" />
          Request a call
          <Icon name="arrow-up-right" className="arrow" />
        </BookCall>
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
          <BookCall where="nav_2" className="btn btn--ink">
            <Icon name="calendar" />
            Request a call
          </BookCall>
        </div>
      )}
    </header>
  );
}
