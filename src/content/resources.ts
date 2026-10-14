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
  title: string;
  description: string;
  category: string;
  kind: ResourceKind;
  /** Uploaded file in the "resources" bucket… */
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
