"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/content/site";
import { BrandMark, Close, Menu } from "../ui/Icons";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ease } from "../ui/Reveal";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

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
    <>
      <header className="nav">
        <div className="container">
          <motion.nav
            aria-label="Primary"
            className={`nav__bar glass ${scrolled || open ? "is-scrolled" : ""}`}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            <a href="#top" className="brand" aria-label={`${site.name} — back to top`}>
              <BrandMark className="brand__mark" />
              {site.name}
            </a>
            <ul className="nav__links">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={`nav__link ${active === n.href.slice(1) ? "is-active" : ""}`}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav__actions">
              <ThemeToggle />
              <span className="nav__cta">
                <Button href="#contact" variant="primary" size="sm">
                  Start a project
                </Button>
              </span>
              <button
                type="button"
                className="icon-btn nav__menu-btn"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <Close /> : <Menu />}
              </button>
            </div>
          </motion.nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <ul>
              {nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.05 + i * 0.06 }}
                >
                  <a href={n.href} onClick={() => setOpen(false)}>
                    {n.label}
                    <span className="label">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a className="label" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
