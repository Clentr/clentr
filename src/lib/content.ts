import { cacheLife, cacheTag } from "next/cache";
import { builtIn, defaultLayout, defaults, homeOrder, type CustomSection, type Layout, type SectionKey, type SiteContent } from "@/content/cms";
import { serviceClient } from "./supabase/service";

export type Site = { content: SiteContent; layout: Layout; sections: CustomSection[] };

/** The home order before the v6 rebuild. A stored layout still equal to it was never customised, so it moves to the new default. */
const PREVIOUS_DEFAULT = ["hero", "work", "statement", "services", "ai", "trust", "principles", "process", "faq", "cta"];
const untouched = (l: Layout) => l.hidden.length === 0 && l.order.length === PREVIOUS_DEFAULT.length && l.order.every((id, i) => id === PREVIOUS_DEFAULT[i]);

/** Site copy with admin edits merged over the defaults, plus the home-page layout and custom sections. */
export async function getSite(): Promise<Site> {
  "use cache";
  cacheTag("content");
  cacheLife("hours");
  const content = structuredClone(defaults) as SiteContent;
  const db = serviceClient();
  if (!db) return { content, layout: defaultLayout, sections: [] };

  const [{ data: rows }, { data: secs }] = await Promise.all([
    db.from("site_content").select("key, data"),
    db.from("sections").select("id, template, name, data").order("created_at"),
  ]);
  let layout = defaultLayout;
  for (const r of rows ?? []) {
    if (r.key === "layout") layout = untouched(r.data as Layout) ? defaultLayout : (r.data as Layout);
    else if (r.key in builtIn) Object.assign(content[r.key as SectionKey], r.data);
  }
  const sections = (secs ?? []) as CustomSection[];

  // Keep the layout complete: new built-ins appear, deleted custom sections drop out.
  const known = new Set([...homeOrder, ...sections.map((s) => `s:${s.id}`)]);
  const order = layout.order.filter((id) => known.has(id));
  for (const id of known) if (!order.includes(id)) order.push(id);
  return { content, layout: { order, hidden: layout.hidden.filter((id) => known.has(id)) }, sections };
}

/** Uncached read for the admin panel: edits, layout and custom sections exactly as stored. */
export async function getSiteForAdmin() {
  const db = (await import("./supabase/service")).serviceClient();
  if (!db) return { edits: {} as Record<string, Record<string, unknown>>, layout: defaultLayout, sections: [] as (CustomSection & { updated_at: string })[] };
  const [{ data: rows }, { data: secs }] = await Promise.all([
    db.from("site_content").select("key, data"),
    db.from("sections").select("id, template, name, data, updated_at").order("created_at"),
  ]);
  const edits: Record<string, Record<string, unknown>> = {};
  let layout = defaultLayout;
  for (const r of rows ?? []) {
    if (r.key === "layout") layout = untouched(r.data as Layout) ? defaultLayout : (r.data as Layout);
    else edits[r.key] = r.data as Record<string, unknown>;
  }
  const sections = (secs ?? []) as (CustomSection & { updated_at: string })[];
  const known = new Set([...homeOrder, ...sections.map((s) => `s:${s.id}`)]);
  const order = layout.order.filter((id) => known.has(id));
  for (const id of known) if (!order.includes(id)) order.push(id);
  return { edits, layout: { order, hidden: layout.hidden.filter((id) => known.has(id)) }, sections };
}
