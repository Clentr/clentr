"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { builtIn as sectionDefs, templates, type Layout, type SectionKey, type Template } from "@/content/cms";
import { projects as builtInProjects, type Project, type Shot } from "@/content/projects";
import { hasSupabase } from "@/lib/config";
import { authClient, isAdminEmail, requireAdmin } from "@/lib/supabase/auth";
import { serviceClient } from "@/lib/supabase/service";

export type FormState = { error?: string; ok?: string } | undefined;

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  if (!hasSupabase) return { error: "Supabase is not configured yet — add the keys to .env.local." };
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!isAdminEmail(email)) return { error: "This email isn’t on the admin list." };
  const supabase = await authClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Wrong email or password." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await authClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const BUCKET = "project-media";
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const text = (form: FormData, k: string) => String(form.get(k) ?? "").trim();

const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

/**
 * One-time signed upload URLs, so screenshots go straight from the browser to Supabase Storage
 * instead of through this function (Vercel caps request bodies at 4.5 MB).
 */
export async function prepareUploads(slug: string, types: string[]) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  // A project slug, or "content" / "sections/<id>" for images used in page sections.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9-]+)?$/.test(slug)) throw new Error("Set a valid slug before adding images.");
  if (types.length > 20) throw new Error("Up to 20 images at a time.");
  return Promise.all(
    types.map(async (type) => {
      const ext = TYPES[type];
      if (!ext) throw new Error("Images must be PNG, JPG or WebP.");
      const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error || !data) throw new Error(error?.message ?? "Could not prepare upload.");
      return { path, token: data.token, url: db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
    }),
  );
}

const isOurUrl = (u: string) => {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Built-in projects can also use the screenshots shipped with the site.
  return /^\/screens\/[\w.-]+$/.test(u) || Boolean(base && u.startsWith(`${base}/storage/v1/object/public/${BUCKET}/`));
};

/** Creates or updates a project. The case-study page, folder and cards are generated from it. */
export async function saveProject(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { error: "SUPABASE_SERVICE_ROLE_KEY is missing." };

  const original = text(form, "original");
  const slug = text(form, "slug").toLowerCase();
  const name = text(form, "name");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { error: "Slug: lowercase letters, numbers and dashes only (e.g. my-app)." };
  if (!name) return { error: "Name is required." };

  const status = text(form, "status") === "rnd" ? "rnd" : "shipped";
  const group = (["app", "web", "ai"] as const).find((g) => g === text(form, "group")) ?? (status === "shipped" ? "app" : "web");
  const category = text(form, "category");
  const platform = text(form, "platform");
  const services = form.getAll("services").map(String);
  const tagline = text(form, "tagline");

  try {
    // Image URLs come from prepareUploads(); only accept our own bucket.
    let shots: Shot[] = [];
    try {
      shots = (JSON.parse(text(form, "shots") || "[]") as Shot[])
        .filter((x) => x && typeof x.url === "string" && isOurUrl(x.url))
        .map((x) => ({
          url: x.url,
          w: Math.max(0, Math.round(Number(x.w) || 0)),
          h: Math.max(0, Math.round(Number(x.h) || 0)),
          device: x.device === "desktop" || x.device === "tablet" ? x.device : "phone",
          ...(x.crop && [x.crop.x, x.crop.y, x.crop.z].every((n) => Number.isFinite(Number(n)))
            ? { crop: { x: Math.min(100, Math.max(0, Number(x.crop.x))), y: Math.min(100, Math.max(0, Number(x.crop.y))), z: Math.min(4, Math.max(1, Number(x.crop.z))) } }
            : {}),
        }));
    } catch {
      return { error: "Couldn’t read the screenshots — please try again." };
    }
    const screens = shots.map((x) => x.url);
    const iconUrl = text(form, "icon");
    const icon = iconUrl && isOurUrl(iconUrl) ? iconUrl : null;
    const isBuiltIn = builtInProjects.some((p) => p.slug === (original || slug));
    if (isBuiltIn && original && original !== slug) return { error: "Built-in projects keep their page address." };
    if (screens.length === 0 && !isBuiltIn) return { error: "Add at least one screenshot." };

    const captions = lines(form.get("captions"));
    const data: Omit<Project, "slug"> = {
      name,
      color: text(form, "color") || "#5b4fe0",
      kind: text(form, "kind"),
      platform,
      status,
      group,
      eyebrow: `Case study · ${category}`,
      tagline,
      servicesLine: services.slice(0, 3).join(" · "),
      cta: "",
      quote: tagline.replace(/\.$/, ""),
      short: text(form, "short"),
      about: [
        ["Category", category],
        ["Platform", platform],
        ["Status", status === "shipped" ? "Shipped" : "In R&D"],
        ...(text(form, "highlights") ? [["Highlights", text(form, "highlights")] as [string, string]] : []),
        ["Screens designed", String(screens.length)],
      ],
      services,
      product: text(form, "product"),
      challenge: text(form, "challenge"),
      built: lines(form.get("built")),
      proves: lines(form.get("proves")),
      gallery: [],
      galleryWide: null,
      screens: [],
      captions: [],
      galleryCaptions: captions,
      liveUrl: /^https:\/\//.test(text(form, "liveUrl")) ? text(form, "liveUrl") : "",
      liveLabel: text(form, "liveLabel"),
      nda: form.get("nda") === "on",
      // Built-in projects keep their Figma artwork unless screenshots are uploaded.
      ...(screens.length ? { media: { icon, screens, device: shots[0].device, shots } } : {}),
    };

    const row = { slug, data, published: form.get("published") === "on", sort: Number(text(form, "sort")) || 100, updated_at: new Date().toISOString() };
    const { error } = original && original !== slug
      ? await db.from("projects").update(row).eq("slug", original)
      : await db.from("projects").upsert(row, { onConflict: "slug" });
    if (error) return { error: error.message.includes("duplicate") ? "That slug is already used." : error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }

  updateTag("projects");
  redirect(`/admin/projects?saved=${slug}`);
}

export async function setPublished(slug: string, published: boolean) {
  await requireAdmin();
  await serviceClient()?.from("projects").update({ published, updated_at: new Date().toISOString() }).eq("slug", slug);
  updateTag("projects");
}

export async function deleteProject(slug: string) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return;
  const { data: files } = await db.storage.from(BUCKET).list(slug);
  if (files?.length) await db.storage.from(BUCKET).remove(files.map((f) => `${slug}/${f.name}`));
  await db.from("projects").delete().eq("slug", slug);
  updateTag("projects");
  redirect("/admin/projects");
}

/* ---------- Projects: built-in ones can be hidden, restored or edited ---------- */

/** Hide or show any project. A built-in project gets an override row the first time. */
export async function setProjectVisible(slug: string, visible: boolean) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return;
  const { data } = await db.from("projects").select("slug").eq("slug", slug).maybeSingle();
  if (data) {
    await db.from("projects").update({ published: visible, updated_at: new Date().toISOString() }).eq("slug", slug);
  } else {
    const p = builtInProjects.find((x) => x.slug === slug);
    if (!p) return;
    const { slug: _, ...rest } = p;
    void _;
    await db.from("projects").insert({ slug, published: visible, data: rest, sort: builtInProjects.indexOf(p) });
  }
  updateTag("projects");
}

/** Built-in: drop the override (back to the original). Added: delete with its images. */
export async function resetOrDeleteProject(slug: string) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return;
  if (!builtInProjects.some((p) => p.slug === slug)) {
    const { data: files } = await db.storage.from(BUCKET).list(slug);
    if (files?.length) await db.storage.from(BUCKET).remove(files.map((f) => `${slug}/${f.name}`));
  }
  await db.from("projects").delete().eq("slug", slug);
  updateTag("projects");
}

/* ---------- Leads ---------- */

export async function updateLead(id: number, patch: { status?: string; notes?: string }) {
  await requireAdmin();
  const clean: Record<string, string> = {};
  if (patch.status && ["new", "contacted", "won", "archived"].includes(patch.status)) clean.status = patch.status;
  if (typeof patch.notes === "string") clean.notes = patch.notes.slice(0, 5000);
  await serviceClient()?.from("leads").update(clean).eq("id", id);
}

export async function deleteLead(id: number) {
  await requireAdmin();
  await serviceClient()?.from("leads").delete().eq("id", id);
}

/* ---------- Site content ---------- */

/** Saves one built-in section's copy (only the fields its schema defines). */
export async function saveSectionContent(key: SectionKey, data: Record<string, unknown>): Promise<FormState> {
  await requireAdmin();
  const def = sectionDefs[key];
  if (!def) return { error: "Unknown section." };
  const allowed = new Set(def.fields.map((f) => f.k));
  const clean = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.has(k)));
  const { error } = await serviceClient()!.from("site_content").upsert({ key, data: clean, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  updateTag("content");
  return { ok: "Saved — live on the site." };
}

export async function resetSectionContent(key: SectionKey) {
  await requireAdmin();
  await serviceClient()?.from("site_content").delete().eq("key", key);
  updateTag("content");
}

export async function saveLayout(layout: Layout) {
  await requireAdmin();
  const clean: Layout = { order: layout.order.map(String).slice(0, 100), hidden: layout.hidden.map(String).slice(0, 100) };
  await serviceClient()?.from("site_content").upsert({ key: "layout", data: clean, updated_at: new Date().toISOString() });
  updateTag("content");
}

/** Adds a section from a template right after `after` (or at the end) and returns its id. */
export async function createSection(template: Template, after: string | null) {
  await requireAdmin();
  const t = templates[template];
  if (!t) throw new Error("Unknown template.");
  const db = serviceClient()!;
  const { data, error } = await db.from("sections").insert({ template, name: t.name, data: t.sample }).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Could not create the section.");
  const id = `s:${data.id}`;
  const { data: row } = await db.from("site_content").select("data").eq("key", "layout").maybeSingle();
  const { homeOrder } = await import("@/content/cms");
  const layout = (row?.data as Layout) ?? { order: [...homeOrder], hidden: [] };
  const at = after ? layout.order.indexOf(after) : -1;
  layout.order.splice(at >= 0 ? at + 1 : layout.order.length, 0, id);
  // New sections start hidden so they can be finished before going live.
  layout.hidden = [...new Set([...layout.hidden, id])];
  await db.from("site_content").upsert({ key: "layout", data: layout, updated_at: new Date().toISOString() });
  updateTag("content");
  return data.id as string;
}

export async function saveCustomSection(id: string, name: string, data: Record<string, unknown>): Promise<FormState> {
  await requireAdmin();
  const { error } = await serviceClient()!
    .from("sections")
    .update({ name: name.slice(0, 80) || "Untitled section", data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  updateTag("content");
  return { ok: "Saved." };
}

export async function deleteCustomSection(id: string) {
  await requireAdmin();
  const db = serviceClient()!;
  await db.from("sections").delete().eq("id", id);
  const { data: files } = await db.storage.from(BUCKET).list(`sections/${id}`);
  if (files?.length) await db.storage.from(BUCKET).remove(files.map((f) => `sections/${id}/${f.name}`));
  updateTag("content");
  redirect("/admin/content");
}
