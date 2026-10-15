"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function session() {
  try {
    let id = sessionStorage.getItem("c_sid");
    if (!id) {
      id = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem("c_sid", id);
    }
    return id;
  } catch {
    return null;
  }
}

function send(type: "page_view" | "click", label: string | null) {
  // The admin's live preview embeds the site; don't count it.
  if (window.self !== window.top) return;
  const body = JSON.stringify({
    type,
    label,
    path: location.pathname + location.hash,
    referrer: document.referrer || null,
    session: session(),
  });
  if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/** What a click was on: an explicit data-track label, else derived from the link. */
function labelFor(el: Element): string | null {
  const tagged = el.closest<HTMLElement>("[data-track]");
  if (tagged) return tagged.dataset.track ?? null;
  const a = el.closest<HTMLAnchorElement>("a[href]");
  if (!a) return null;
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "email";
  const work = href.match(/^\/work\/([a-z0-9-]+)/);
  if (work) return `project:${work[1]}`;
  if (href === "/contact") return "contact_page";
  if (/^https?:/.test(href)) {
    try {
      return `outbound:${new URL(href).hostname}`;
    } catch {
      return null;
    }
  }
  return href.startsWith("/#") ? `nav:${href.slice(2)}` : null;
}

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/admin")) send("page_view", null);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (location.pathname.startsWith("/admin") || !(e.target instanceof Element)) return;
      const label = labelFor(e.target);
      if (label) send("click", label);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
