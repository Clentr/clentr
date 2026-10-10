"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";

/** Copy-link and native share for a case study. */
export function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => window.location.href;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  }
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: url() });
      } catch {
        /* dismissed */
      }
    } else {
      copy();
    }
  }

  return (
    <>
      <button type="button" className="round-btn" onClick={copy} aria-label="Copy link to this case study">
        <Icon name="copy" />
      </button>
      <button type="button" className="round-btn" onClick={share} aria-label="Share this case study">
        <Icon name="share" />
      </button>
      <span className="copied" role="status">
        {copied ? "Link copied" : ""}
      </span>
    </>
  );
}
