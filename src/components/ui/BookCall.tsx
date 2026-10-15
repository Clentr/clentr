import Link from "next/link";
import type { ReactNode } from "react";

/**
 * "Request a call" link. It opens the short application at /apply; the team reads it and sends
 * the Cal.com link only to good fits, so the calendar isn't open to everyone.
 */
export function BookCall({ where, className, children }: { where: string; className?: string; children: ReactNode }) {
  return (
    <Link href="/apply" className={className} data-track={`book_call:${where}`}>
      {children}
    </Link>
  );
}
