"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Check, FileUp, ImagePlus, Link2, Loader, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import type { ReactNode } from "react";
import { formatSize, KINDS, slugify, type Resource, type ResourceKind } from "@/content/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { config } from "@/lib/config";
import { prepareResourceUpload, saveResource } from "../../resource-actions";

async function upload(id: string, what: "file" | "cover", f: File) {
  const s = await prepareResourceUpload(id, what, f.name, f.type, f.size);
  const storage = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey).storage.from("resources");
  const { error } = await storage.uploadToSignedUrl(s.path, s.token, f, { contentType: f.type || "application/octet-stream" });
  if (error) throw new Error(error.message);
  return s.url;
}

function Section({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <fieldset className="ad-card pf-sec">
      <legend className="sr-only">{title}</legend>
      <header className="pf-sec__head">
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </header>
      {children}
    </fieldset>
  );
}

/** Add or edit one resource in the free library. */
export function ResourceForm({ id, resource, categories, sort }: { id: string; resource?: Resource; categories: string[]; sort: number }) {
  const [state, action, saving] = useActionState(saveResource, undefined);
  const [title, setTitle] = useState(resource?.title ?? "");
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(resource?.slug));
  const [description, setDescription] = useState(resource?.description ?? "");
  const [category, setCategory] = useState(resource?.category ?? "");
  const [kind, setKind] = useState<ResourceKind>(resource?.kind ?? "guide");
  const [detail, setDetail] = useState(resource?.detail ?? "");
  const [source, setSource] = useState<"file" | "link">(resource?.link && !resource.file ? "link" : "file");
  const [file, setFile] = useState(resource?.file ? { url: resource.file, name: resource.fileName ?? "", size: resource.size ?? 0 } : null);
  const [link, setLink] = useState(resource?.link ?? "");
  const [cover, setCover] = useState(resource?.cover ?? "");
  const [featured, setFeatured] = useState(Boolean(resource?.featured));
  const [busy, setBusy] = useState<"file" | "cover" | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  async function onPick(what: "file" | "cover", list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setErr(null);
    setBusy(what);
    try {
      const url = await upload(id, what, f);
      if (what === "cover") setCover(url);
      else {
        setFile({ url, name: f.name, size: f.size });
        if (!title) {
          const t = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
          setTitle(t);
          if (!slugTouched) setSlug(slugify(t));
        }
        if (/\.pdf$/i.test(f.name) && kind === "other") setKind("pdf");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
      if (fileInput.current) fileInput.current.value = "";
      if (coverInput.current) coverInput.current.value = "";
    }
  }

  const preview: Resource = {
    id,
    slug: slug || undefined,
    title: title || "Resource title",
    description: description || "A short line on what this is and who it helps.",
    category: category || "Category",
    kind,
    detail,
    ...(source === "file" && file ? { file: file.url, fileName: file.name, size: file.size } : {}),
    ...(source === "link" && link ? { link } : {}),
    ...(cover ? { cover } : {}),
    published: true,
    sort,
    updatedAt: "",
  };

  return (
    <form action={action} className="pf">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="file" value={source === "file" ? (file?.url ?? "") : ""} />
      <input type="hidden" name="fileName" value={file?.name ?? ""} />
      <input type="hidden" name="size" value={file?.size ?? 0} />
      <input type="hidden" name="cover" value={cover} />
      <div className="pf__main">
        <Section title="What it is">
          <label className="pf-field">
            <span>Title</span>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="The App Launch Checklist"
            />
          </label>
          <label className="pf-field">
            <span>
              Page address <em>The link you share — keep it short</em>
            </span>
            <span className="pf-prefix">
              <em>clentr.com/resources/</em>
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="app-launch-checklist"
              />
            </span>
          </label>
          <label className="pf-field">
            <span>
              Description <em>One or two lines — what’s inside and who it’s for</em>
            </span>
            <textarea name="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Every step from TestFlight to launch day, in the order we do them." />
          </label>
          <div className="pf-row pf-row--3">
            <label className="pf-field">
              <span>Category</span>
              <input name="category" required list="rf-cats" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Launch" />
              <datalist id="rf-cats">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label className="pf-field">
              <span>Type</span>
              <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as ResourceKind)}>
                {Object.entries(KINDS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="pf-field">
              <span>
                Detail <em>Optional</em>
              </span>
              <input name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="24 pages" />
            </label>
          </div>
        </Section>

        <Section title="The resource" sub="Upload the file (PDF, Word, Excel, PowerPoint, ZIP, images — up to 50 MB), or paste a link to Notion, Google Drive, Figma or similar.">
          <div className="pf-choice rf-source" role="radiogroup">
            {(["file", "link"] as const).map((v) => (
              <label key={v} className={source === v ? "is-on" : ""}>
                <input type="radio" checked={source === v} onChange={() => setSource(v)} />
                {v === "file" ? <FileUp /> : <Link2 />}
                <span>
                  <b>{v === "file" ? "Upload a file" : "Paste a link"}</b>
                  <small>{v === "file" ? "Visitors download it" : "Opens in a new tab"}</small>
                </span>
              </label>
            ))}
          </div>
          {source === "file" ? (
            <div className="rf-file">
              {file ? (
                <>
                  <span className="rf-file__name">
                    <FileUp />
                    <b>{file.name || "Uploaded file"}</b>
                    <small>{formatSize(file.size)}</small>
                  </span>
                  <button type="button" className="ad-btn ad-btn--sm" onClick={() => fileInput.current?.click()} disabled={busy === "file"}>
                    {busy === "file" ? <Loader className="ad-spin" /> : <FileUp />}
                    Replace
                  </button>
                </>
              ) : (
                <button type="button" className="rf-drop" onClick={() => fileInput.current?.click()} disabled={busy === "file"}>
                  {busy === "file" ? <Loader className="ad-spin" /> : <FileUp />}
                  <b>{busy === "file" ? "Uploading…" : "Choose a file"}</b>
                  <small>Up to 50 MB</small>
                </button>
              )}
              <input ref={fileInput} type="file" hidden onChange={(e) => onPick("file", e.target.files)} />
            </div>
          ) : (
            <label className="pf-field">
              <span>Link</span>
              <input name="link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.notion.so/…" />
            </label>
          )}
        </Section>

        <Section title="Cover" sub="Optional. Without one, the card shows a paper-sheet cover with the title. Best at 1600 × 1000.">
          <div className="rf-cover">
            {cover ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt="" />
                <button type="button" className="ad-iconbtn ad-iconbtn--sm" aria-label="Remove cover" onClick={() => setCover("")}>
                  <X />
                </button>
              </>
            ) : (
              <button type="button" className="rf-drop" onClick={() => coverInput.current?.click()} disabled={busy === "cover"}>
                {busy === "cover" ? <Loader className="ad-spin" /> : <ImagePlus />}
                <b>{busy === "cover" ? "Uploading…" : "Upload a cover"}</b>
                <small>PNG, JPG or WebP</small>
              </button>
            )}
            <input ref={coverInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onPick("cover", e.target.files)} />
          </div>
        </Section>
        {err && (
          <p className="sf-err" role="alert">
            {err}
          </p>
        )}
      </div>

      <aside className="pf__side">
        <div className="ad-card pf-preview rf-preview">
          <span className="pf-label">Card preview</span>
          <ResourceCard r={preview} />
        </div>
        <div className="ad-card pf-publish">
          <label className="pf-switch">
            <input name="published" type="checkbox" defaultChecked={resource?.published ?? true} />
            <span aria-hidden="true" />
            <span>
              <b>Show in the library</b>
              <small>Visible at /resources</small>
            </span>
          </label>
          <label className="pf-switch">
            <input name="featured" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <span aria-hidden="true" />
            <span>
              <b>Feature it</b>
              <small>Shown large at the top. Only one at a time.</small>
            </span>
          </label>
          <label className="pf-field">
            <span>
              Order <em>Lower shows first</em>
            </span>
            <input name="sort" type="number" defaultValue={sort} />
          </label>
          {state?.error && (
            <p className="sf-err" role="alert">
              {state.error}
            </p>
          )}
          <button className="ad-btn ad-btn--primary ad-btn--block" disabled={saving || Boolean(busy)}>
            {saving ? <Loader className="ad-spin" /> : <Check />}
            {saving ? "Saving…" : resource ? "Save changes" : "Add resource"}
          </button>
        </div>
      </aside>
    </form>
  );
}
