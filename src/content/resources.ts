/** The free resource library (/resources): shared with the Instagram campaign, managed in the admin panel. */

export const KINDS = {
  guide: { label: "Guide", icon: "book-open" },
  ebook: { label: "E-book", icon: "book-open" },
  playbook: { label: "Playbook", icon: "rocket" },
  template: { label: "Template", icon: "layers" },
  checklist: { label: "Checklist", icon: "circle-check" },
  spreadsheet: { label: "Spreadsheet", icon: "trending-up" },
  toolkit: { label: "Toolkit", icon: "package" },
  pdf: { label: "PDF", icon: "file-text" },
  other: { label: "Resource", icon: "paperclip" },
} as const;

export type ResourceKind = keyof typeof KINDS;

export type Resource = {
  id: string;
  /** Page address: /resources/<slug>. Older entries fall back to the id. */
  slug?: string;
  title: string;
  description: string;
  category: string;
  kind: ResourceKind;
  /** The article itself, in Markdown — shown as a blog post with a PDF download. */
  body?: string;
  /** …and/or an uploaded file in the "resources" bucket… */
  file?: string;
  fileName?: string;
  size?: number;
  /** …or an outside link (Notion, Google Drive, Figma). */
  link?: string;
  cover?: string;
  /** Short detail under the title, e.g. "24 pages" or "Google Sheets". */
  detail?: string;
  featured?: boolean;
  published: boolean;
  sort: number;
  updatedAt: string;
};

export type Library = {
  title: string;
  dim: string;
  lead: string;
  items: Resource[];
};

export const libraryDefaults: Omit<Library, "items"> = {
  title: "Free resources for founders.",
  dim: "No email, no catch.",
  lead: "The guides, templates and checklists we use to plan, build and launch products — free to download and keep.",
};

export const formatSize = (b?: number) =>
  !b ? "" : b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(b < 10 * 1024 * 1024 ? 1 : 0)} MB`;

/** Extension → label shown on the card. */
export const fileType = (name?: string) => (name?.split(".").pop() ?? "").toUpperCase().slice(0, 5);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const resourcePath = (r: Pick<Resource, "id" | "slug">) => `/resources/${r.slug || r.id}`;

/** How a resource is shown on its page. */
export type View =
  | { kind: "article" }
  | { kind: "pdf"; src: string }
  | { kind: "office"; src: string }
  | { kind: "image"; src: string }
  | { kind: "video"; src: string }
  | { kind: "audio"; src: string }
  | { kind: "text"; src: string; table: boolean }
  | { kind: "embed"; src: string; host: string }
  | { kind: "link"; src: string; host: string }
  | { kind: "file"; src: string };

const ext = (name?: string) => (name?.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "");

/** Turns a shared link into its embeddable form where the service allows one. */
function embedFor(url: URL): string | null {
  const h = url.hostname.replace(/^www\./, "");
  if (h === "docs.google.com") return url.href.replace(/\/(edit|view)(\?.*|#.*)?$/, "/preview");
  if (h === "drive.google.com") {
    const id = url.pathname.match(/\/d\/([^/]+)/)?.[1] ?? url.searchParams.get("id");
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }
  if (h === "figma.com") return `https://www.figma.com/embed?embed_host=clentr&url=${encodeURIComponent(url.href)}`;
  if (h === "youtube.com" || h === "youtu.be") {
    const id = h === "youtu.be" ? url.pathname.slice(1) : (url.searchParams.get("v") ?? url.pathname.split("/").pop());
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (h === "loom.com") return url.href.replace("/share/", "/embed/");
  if (h === "vimeo.com") return `https://player.vimeo.com/video/${url.pathname.split("/").filter(Boolean)[0]}`;
  if (h.endsWith("notion.site") || h === "canva.com" || h.endsWith(".canva.site") || h === "pitch.com") return url.href;
  return null;
}

export function viewOf(r: Resource): View {
  if (r.body?.trim()) return { kind: "article" };
  if (r.file) {
    const e = ext(r.fileName) || ext(r.file);
    if (e === "pdf") return { kind: "pdf", src: r.file };
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(e)) return { kind: "office", src: r.file };
    if (["png", "jpg", "jpeg", "webp", "gif", "avif"].includes(e)) return { kind: "image", src: r.file };
    if (["mp4", "webm", "mov", "m4v"].includes(e)) return { kind: "video", src: r.file };
    if (["mp3", "wav", "m4a", "ogg"].includes(e)) return { kind: "audio", src: r.file };
    if (["csv", "tsv", "txt", "md", "json"].includes(e)) return { kind: "text", src: r.file, table: e === "csv" || e === "tsv" };
    return { kind: "file", src: r.file };
  }
  try {
    const u = new URL(r.link ?? "");
    const host = u.hostname.replace(/^www\./, "");
    const embed = embedFor(u);
    return embed ? { kind: "embed", src: embed, host } : { kind: "link", src: u.href, host };
  } catch {
    return { kind: "file", src: "#" };
  }
}

/** Download URL: Supabase's "?download=" makes the browser save the file. */
export const downloadUrl = (r: Resource) => (r.file ? `${r.file}?download=${encodeURIComponent(r.fileName ?? "")}` : undefined);
