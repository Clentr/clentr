"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { KINDS, slugify, type Library, type Resource, type ResourceKind } from "@/content/resources";
import { LIBRARY_KEY, readLibrary } from "@/lib/resources";
import { requireAdmin } from "@/lib/supabase/auth";
import { serviceClient } from "@/lib/supabase/service";
import type { FormState } from "./actions";

const BUCKET = "resources";
const MAX_FILE = 50 * 1024 * 1024;
const COVER_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
// Anything a browser would run or render as a page stays out of a public bucket.
const BLOCKED = /\.(html?|xhtml|svg|js|mjs|php|exe|sh|bat)$/i;

const text = (form: FormData, k: string) => String(form.get(k) ?? "").trim();
const isOurs = (u: string) => {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base && u.startsWith(`${base}/storage/v1/object/public/${BUCKET}/`));
};

async function write(lib: Library) {
  const { error } = await serviceClient()!.from("site_content").upsert({ key: LIBRARY_KEY, data: lib, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  updateTag("resources");
}

/** A one-time signed URL, so files go straight from the browser to Storage (Vercel caps bodies at 4.5 MB). */
export async function prepareResourceUpload(id: string, what: "file" | "cover", name: string, type: string, size: number) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  if (!/^[a-z0-9-]{6,40}$/.test(id)) throw new Error("Bad resource id.");
  if (size > MAX_FILE) throw new Error("Files can be up to 50 MB. For bigger ones, paste a Google Drive or Dropbox link instead.");
  let file: string;
  if (what === "cover") {
    const ext = COVER_TYPES[type];
    if (!ext) throw new Error("Cover images must be PNG, JPG or WebP.");
    file = `cover-${Date.now()}.${ext}`;
  } else {
    if (BLOCKED.test(name)) throw new Error("That file type can’t be shared. Use PDF, Office, Sheets, ZIP, images or similar.");
    const clean = name
      .normalize("NFKD")
      .replace(/[^\w.\- ]+/g, "")
      .replace(/\s+/g, "-")
      .slice(-80);
    file = `${Date.now()}-${clean || "file"}`;
  }
  const path = `${id}/${file}`;
  const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Could not prepare the upload.");
  return { path, token: data.token, url: db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}

export async function saveResource(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  if (!serviceClient()) return { error: "SUPABASE_SERVICE_ROLE_KEY is missing." };

  const id = text(form, "id");
  const title = text(form, "title");
  const category = text(form, "category");
  const kind = (text(form, "kind") in KINDS ? text(form, "kind") : "other") as ResourceKind;
  const file = text(form, "file");
  const link = text(form, "link");
  const cover = text(form, "cover");
  const body = String(form.get("body") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200_000);
  if (!/^[a-z0-9-]{6,40}$/.test(id)) return { error: "Something went wrong — reload the page and try again." };
  if (!title) return { error: "Add a title." };
  if (!category) return { error: "Pick or type a category." };
  if (file && !isOurs(file)) return { error: "Upload the file again." };
  if (link && !/^https:\/\/\S+$/.test(link)) return { error: "The link must start with https://" };
  if (!file && !link && !body) return { error: "Write the article, upload a file or paste a link." };

  const lib = await readLibrary();
  const before = lib.items.find((r) => r.id === id);
  // A unique page address; it stays put when the title changes, unless edited.
  const base = slugify(text(form, "slug") || before?.slug || title) || id;
  const taken = new Set(lib.items.filter((r) => r.id !== id).flatMap((r) => [r.slug, r.id]));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  const item: Resource = {
    id,
    slug,
    title: title.slice(0, 120),
    description: text(form, "description").slice(0, 400),
    category: category.slice(0, 40),
    kind,
    ...(body ? { body } : {}),
    ...(file ? { file, fileName: text(form, "fileName").slice(0, 120), size: Math.max(0, Number(text(form, "size")) || 0) } : {}),
    ...(link && !file ? { link } : {}),
    ...(cover && isOurs(cover) ? { cover } : {}),
    detail: text(form, "detail").slice(0, 40) || undefined,
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
    sort: Number(text(form, "sort")) || 0,
    updatedAt: new Date().toISOString(),
  };
  // One featured resource at a time — it gets the large card.
  const items = lib.items.map((r) => (item.featured ? { ...r, featured: false } : r)).filter((r) => r.id !== id);
  try {
    await write({ ...lib, items: [...items, item] });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save." };
  }
  // Clean up files this resource no longer uses.
  const keep = new Set([item.file, item.cover].filter(Boolean));
  const stale = [before?.file, before?.cover].filter((u): u is string => Boolean(u && !keep.has(u) && isOurs(u)));
  if (stale.length) await serviceClient()!.storage.from(BUCKET).remove(stale.map((u) => u.split(`/public/${BUCKET}/`)[1]));
  redirect(`/admin/resources?saved=${encodeURIComponent(item.title)}`);
}

export async function setResourcePublished(id: string, published: boolean) {
  await requireAdmin();
  const lib = await readLibrary();
  await write({ ...lib, items: lib.items.map((r) => (r.id === id ? { ...r, published } : r)) });
}

export async function deleteResource(id: string) {
  await requireAdmin();
  const db = serviceClient()!;
  const lib = await readLibrary();
  await write({ ...lib, items: lib.items.filter((r) => r.id !== id) });
  const { data: files } = await db.storage.from(BUCKET).list(id);
  if (files?.length) await db.storage.from(BUCKET).remove(files.map((f) => `${id}/${f.name}`));
}

export async function saveLibraryCopy(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const lib = await readLibrary();
  try {
    await write({ ...lib, title: text(form, "title") || lib.title, dim: text(form, "dim"), lead: text(form, "lead") });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: "Saved — live on the library page." };
}
