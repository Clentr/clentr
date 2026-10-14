"use client";

import { Bold, CheckSquare, Code, FileDown, Heading2, Heading3, Italic, Link2, List, ListOrdered, Minus, Quote, Sparkles, Table } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { renderArticle } from "@/lib/markdown";

type Tool = { icon: typeof Bold; label: string; wrap?: [string, string]; line?: string; block?: string };

const TOOLS: Tool[] = [
  { icon: Heading2, label: "Section heading", line: "## " },
  { icon: Heading3, label: "Sub-heading", line: "### " },
  { icon: Bold, label: "Bold", wrap: ["**", "**"] },
  { icon: Italic, label: "Italic", wrap: ["_", "_"] },
  { icon: Link2, label: "Link", wrap: ["[", "](https://)"] },
  { icon: List, label: "Bullet list", line: "- " },
  { icon: ListOrdered, label: "Numbered list", line: "1. " },
  { icon: CheckSquare, label: "Checklist", line: "- [ ] " },
  { icon: Quote, label: "Quote", line: "> " },
  { icon: Sparkles, label: "Tip box", block: "> [!TIP]\n> " },
  { icon: Code, label: "Code", wrap: ["`", "`"] },
  { icon: Table, label: "Table", block: "| Step | What to do |\n| --- | --- |\n| 1 | … |\n" },
  { icon: Minus, label: "Divider", block: "\n---\n" },
];

export const STARTER = `Start with one or two lines on why this matters.

## The first section

Write it like a blog post: short paragraphs, clear headings.

- A bullet point
- Another one

## A checklist readers can tick

- [ ] First step
- [ ] Second step

> [!TIP]
> A tip box stands out from the text.
`;

/** Markdown with a formatting toolbar, live preview and .md import. */
export function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const area = useRef<HTMLTextAreaElement>(null);
  const importer = useRef<HTMLInputElement>(null);
  const article = useMemo(() => (tab === "preview" ? renderArticle(value) : null), [tab, value]);
  const words = value.split(/\s+/).filter(Boolean).length;

  function apply(t: Tool) {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const sel = value.slice(a, b);
    let next: string;
    let caret: number;
    if (t.wrap) {
      next = value.slice(0, a) + t.wrap[0] + (sel || t.label.toLowerCase()) + t.wrap[1] + value.slice(b);
      caret = a + t.wrap[0].length + (sel || t.label.toLowerCase()).length;
    } else if (t.line) {
      const start = value.lastIndexOf("\n", a - 1) + 1;
      const lines = value.slice(start, b).split("\n").map((l) => t.line + l.replace(/^(#{1,6} |- \[[ x]\] |- |\d+\. |> )/, ""));
      next = value.slice(0, start) + lines.join("\n") + value.slice(b);
      caret = start + lines.join("\n").length;
    } else {
      const pre = a && value[a - 1] !== "\n" ? "\n\n" : "";
      next = value.slice(0, a) + pre + t.block + value.slice(b);
      caret = a + pre.length + (t.block?.length ?? 0);
    }
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  async function importMd(f?: File) {
    if (!f) return;
    const text = await f.text();
    if (!value.trim() || confirm("Replace what’s in the editor with this file?")) onChange(text);
    if (importer.current) importer.current.value = "";
  }

  return (
    <div className="mde">
      <div className="mde__bar">
        <div className="mde__tabs" role="tablist">
          {(["write", "preview"] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
              {t === "write" ? "Write" : "Preview"}
            </button>
          ))}
        </div>
        {tab === "write" && (
          <div className="mde__tools">
            {TOOLS.map((t) => (
              <button key={t.label} type="button" title={t.label} aria-label={t.label} onClick={() => apply(t)}>
                <t.icon />
              </button>
            ))}
          </div>
        )}
        <button type="button" className="ad-btn ad-btn--sm mde__import" onClick={() => importer.current?.click()}>
          <FileDown />
          Import .md
        </button>
        <input ref={importer} type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" hidden onChange={(e) => importMd(e.target.files?.[0])} />
      </div>
      {tab === "write" ? (
        <textarea
          ref={area}
          className="mde__area"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={STARTER}
          spellCheck
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const f = e.dataTransfer.files?.[0];
            if (f && /\.(md|markdown|txt)$/i.test(f.name)) {
              e.preventDefault();
              void importMd(f);
            }
          }}
        />
      ) : (
        <div className="mde__preview">
          {value.trim() ? <div className="art__prose" dangerouslySetInnerHTML={{ __html: article?.html ?? "" }} /> : <p className="ad-muted">Nothing to preview yet.</p>}
        </div>
      )}
      <div className="mde__foot">
        <span>
          {words} words · about {Math.max(1, Math.round(words / 220))} min read
        </span>
        <span>
          Markdown: <code>## Heading</code> <code>**bold**</code> <code>- [ ] checklist</code> <code>&gt; [!TIP]</code>
        </span>
      </div>
    </div>
  );
}
