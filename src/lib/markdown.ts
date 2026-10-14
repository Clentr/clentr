import { Marked, type Tokens } from "marked";

/** Markdown → article HTML for resource pages (also used by the admin preview). */

export type TocItem = { id: string; text: string; depth: 2 | 3 };
export type Article = { html: string; toc: TocItem[]; minutes: number };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
const idOf = (s: string) =>
  plain(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "section";
const safeHref = (h: string) => (/^(https?:|mailto:|#|\/(?!\/))/i.test(h.trim()) ? h.trim() : "#");

const CALLOUTS: Record<string, { label: string; icon: string }> = {
  NOTE: { label: "Note", icon: "i" },
  TIP: { label: "Tip", icon: "✓" },
  IMPORTANT: { label: "Important", icon: "!" },
  WARNING: { label: "Watch out", icon: "!" },
  CAUTION: { label: "Caution", icon: "!" },
};

export function renderArticle(md: string): Article {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      // Written content only: raw HTML is shown as text, never run.
      html({ text }) {
        return esc(text);
      },
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) return `<h2>${inner}</h2>`;
        let id = idOf(inner);
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n + 1}`;
        if (depth === 2 || depth === 3) toc.push({ id, text: plain(inner), depth });
        return `<h${depth} id="${id}"><a class="art__anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>`;
      },
      link({ href, title, tokens }) {
        const url = safeHref(href);
        const ext = /^https?:/i.test(url);
        return `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${this.parser.parseInline(tokens)}</a>`;
      },
      image({ href, title, text }) {
        const url = safeHref(href);
        const cap = title || "";
        return `<figure class="art__fig"><img src="${esc(url)}" alt="${esc(text)}" loading="lazy" />${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>`;
      },
      checkbox({ checked }) {
        return `<input type="checkbox" class="art__check"${checked ? " checked" : ""} aria-label="Done" /> `;
      },
      table(t: Tokens.Table) {
        const head = t.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = t.rows
          .map((r) => `<tr>${r.map((c) => `<td${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="art__table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      },
      code({ text, lang }) {
        const l = (lang ?? "").split(/\s/)[0];
        return `<figure class="art__code">${l ? `<figcaption>${esc(l)}</figcaption>` : ""}<pre><code>${esc(text)}</code></pre></figure>`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        // GitHub-style callouts: > [!TIP] …
        const m = body.match(/^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br>)?\s*/i);
        if (m) {
          const c = CALLOUTS[m[1].toUpperCase()];
          return `<aside class="art__callout art__callout--${m[1].toLowerCase()}"><b><i aria-hidden="true">${c.icon}</i>${c.label}</b>${body.replace(m[0], "<p>")}</aside>`;
        }
        return `<blockquote>${body}</blockquote>`;
      },
    },
  });

  const html = marked.parse(md, { async: false });
  const words = plain(html).split(/\s+/).filter(Boolean).length;
  return { html, toc, minutes: Math.max(1, Math.round(words / 220)) };
}
