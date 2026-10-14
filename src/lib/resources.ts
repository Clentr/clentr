import { cacheLife, cacheTag } from "next/cache";
import { libraryDefaults, type Library, type Resource } from "@/content/resources";
import { serviceClient } from "./supabase/service";

/** Stored in site_content under this key: the page copy plus every resource. */
export const LIBRARY_KEY = "resources";

const order = (items: Resource[]) => [...items].sort((a, b) => a.sort - b.sort || b.updatedAt.localeCompare(a.updatedAt));

/** Everything as stored, hidden resources included — for the admin panel. Uncached. */
export async function readLibrary(): Promise<Library> {
  const db = serviceClient();
  const { data } = (await db?.from("site_content").select("data").eq("key", LIBRARY_KEY).maybeSingle()) ?? {};
  const stored = (data?.data ?? {}) as Partial<Library>;
  return { ...libraryDefaults, ...stored, items: order(Array.isArray(stored.items) ? stored.items : []) };
}

/** The public library: published resources only. */
export async function getLibrary(): Promise<Library> {
  "use cache";
  cacheTag("resources");
  cacheLife("hours");
  const lib = await readLibrary();
  return { ...lib, items: lib.items.filter((r) => r.published) };
}
