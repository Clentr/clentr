import { cacheLife, cacheTag } from "next/cache";
import { carouselOrder, projects as builtIn, type Project } from "@/content/projects";
import { serviceClient } from "./supabase/service";

/** Built-in (Figma) projects plus published ones added from the admin panel. */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag("projects");
  cacheLife("hours");
  const db = serviceClient();
  if (!db) return builtIn;
  const { data, error } = await db.from("projects").select("slug, data, published, sort").order("sort").order("created_at");
  if (error || !data) return builtIn;
  // Any row for a built-in slug overrides it — an unpublished row hides it.
  const rows = new Map(data.map((r) => [r.slug as string, r]));
  const fromRow = (r: (typeof data)[number]) => ({ ...(r.data as Omit<Project, "slug">), slug: r.slug as string });
  const merged = builtIn.flatMap((p) => {
    const r = rows.get(p.slug);
    return !r ? [p] : r.published ? [{ ...fromRow(r), media: (r.data as Project).media }] : [];
  });
  const added = data.filter((r) => r.published && !builtIn.some((p) => p.slug === r.slug)).map(fromRow);
  return [...merged, ...added];
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getWork() {
  const all = await getProjects();
  const ordered = [
    ...carouselOrder.map((s) => all.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p)),
    ...all.filter((p) => !carouselOrder.includes(p.slug)),
  ];
  return {
    all,
    mobileApps: all.filter((p) => p.status === "shipped"),
    webDesktop: all.filter((p) => p.status === "rnd"),
    carousel: ordered,
  };
}

/** The three projects that follow `slug`, wrapping around — for "More work". */
export async function moreWork(slug: string) {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  return [1, 2, 3].map((k) => all[(i + k) % all.length]).filter((p) => p.slug !== slug);
}
