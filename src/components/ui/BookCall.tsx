"use client";

import type { ReactNode } from "react";
import { config } from "@/lib/config";
import { bookCallHref } from "@/content/site";

/**
 * "Book a call" link. With NEXT_PUBLIC_CAL_LINK set it opens the Cal.com pop-up
 * (falling back to the Cal.com page); without it, it opens an email.
 */
export function BookCall({ where, className, children }: { where: string; className?: string; children: ReactNode }) {
  const cal = config.calLink;
  return (
    <a
      href={cal ? `https://cal.com/${cal}` : bookCallHref}
      className={className}
      data-track={`book_call:${where}`}
      {...(cal ? { "data-cal-link": cal, "data-cal-config": '{"layout":"month_view"}' } : {})}
      onClick={(e) => {
        // The Cal.com embed opens its pop-up from the same click; stay on the page.
        if (cal && window.Cal?.loaded) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
