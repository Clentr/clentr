"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ExternalLink, FolderKanban, Inbox, LayoutDashboard, LayoutTemplate, Settings } from "lucide-react";

const GROUPS = [
  { h: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    h: "Inbox",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox, badge: "leads" },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    ],
  },
  {
    h: "Content",
    items: [
      { href: "/admin/content", label: "Home page", icon: LayoutTemplate },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    ],
  },
  { h: "Studio", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

export function SideNav({ newLeads }: { newLeads: number }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <nav className="sn" aria-label="Admin">
      {GROUPS.map((g) => (
        <div key={g.h} className="sn__group">
          <span className="sn__h">{g.h}</span>
          {g.items.map(({ href, label, icon: I, badge }) => (
            <Link key={href} href={href} className="sn__link" aria-current={active(href) ? "page" : undefined}>
              <I />
              {label}
              {badge === "leads" && newLeads > 0 && <em className="sn__badge">{newLeads}</em>}
            </Link>
          ))}
        </div>
      ))}
      <div className="sn__group">
        <a href="/" target="_blank" rel="noopener" className="sn__link">
          <ExternalLink />
          View site
        </a>
      </div>
    </nav>
  );
}
