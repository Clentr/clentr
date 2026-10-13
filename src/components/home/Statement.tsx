"use client";

import Image from "next/image";
import { Art } from "../ui/Art";
import { Icon } from "../ui/Icon";

/** The tools we build with, as a scrolling logo strip. */
type Tool = { key?: string; name: string; image: string };

export function Statement({ c }: { c: { toolsLabel: string; tools: Tool[] } }) {
  const tools = c.tools.filter((t) => t.image || t.key);
  return (
    <section className="container">
      <div className="tools">
        <span className="tools__label">
          <Icon name="code-xml" />
          {c.toolsLabel.toUpperCase()}
        </span>
        <div className="tools__rail">
          <div className="tools__track">
            {[...tools, ...tools].map((t, i) =>
              t.image ? (
                <Image key={`${t.name}-${i}`} src={t.image} alt={i < tools.length ? t.name : ""} width={64} height={64} className="tools__custom" />
              ) : (
                <Art key={`${t.key}-${i}`} name={`tool-${t.key}`} themed alt={i < tools.length ? t.name : ""} sizes="64px" />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
