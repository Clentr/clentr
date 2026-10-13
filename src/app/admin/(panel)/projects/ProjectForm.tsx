"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowDown, ArrowUp, Check, Crop as CropIcon, ImagePlus, Loader, Smartphone, Monitor, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { guessDevice, shotsOf, type Project, type Shot } from "@/content/projects";
import { Device, ProjectIcon, StageArt } from "@/components/work/ProjectArt";
import { config } from "@/lib/config";
import { prepareUploads, saveProject } from "../../actions";
import { CropEditor } from "./CropEditor";

const SERVICES = ["Mobile app", "Web platform", "Applied AI", "Computer vision", "Desktop & native", "Backend & cloud", "Product design", "Launch & growth"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function uploadAll(slug: string, files: File[]) {
  const signed = await prepareUploads(slug, files.map((f) => f.type));
  const storage = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey).storage.from("project-media");
  await Promise.all(
    signed.map(async (s, i) => {
      const { error } = await storage.uploadToSignedUrl(s.path, s.token, files[i], { contentType: files[i].type });
      if (error) throw new Error(error.message);
    }),
  );
  return signed.map((s) => s.url);
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

/** Add or edit a project. Everything the case-study template needs, nothing more. */
export function ProjectForm({ project, builtIn = false, published = true, sort = 100 }: {
  project?: Project;
  builtIn?: boolean;
  published?: boolean;
  sort?: number;
}) {
  const [state, action, saving] = useActionState(saveProject, undefined);
  const [name, setName] = useState(project?.name ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [kind, setKind] = useState(project?.kind ?? "");
  const [platform, setPlatform] = useState(project?.platform ?? "");
  const [color, setColor] = useState(project?.color ?? "#5b4fe0");
  const [status, setStatus] = useState<Project["status"]>(project?.status ?? "shipped");
  const [shots, setShots] = useState<Shot[]>(project?.media ? shotsOf(project.media) : []);
  const [icon, setIcon] = useState<string | null>(project?.media?.icon ?? null);
  const [busy, setBusy] = useState<string | null>(null);
  const [cropping, setCropping] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const screensInput = useRef<HTMLInputElement>(null);
  const iconInput = useRef<HTMLInputElement>(null);
  const about = Object.fromEntries(project?.about ?? []);

  async function onFiles(which: "screens" | "icon", list: FileList | null) {
    const files = [...(list ?? [])];
    if (!files.length) return;
    if (!slug) {
      setUploadError("Add the name first — images are stored under the project’s address.");
      return;
    }
    setUploadError(null);
    setBusy(which);
    try {
      // Read each image's size first: it decides the frame (iPhone or window) and how it fits.
      const dims = await Promise.all(
        files.map(async (f) => {
          try {
            const b = await createImageBitmap(f);
            const d = { w: b.width, h: b.height };
            b.close();
            return d;
          } catch {
            return { w: 0, h: 0 };
          }
        }),
      );
      const urls = await uploadAll(slug, files);
      if (which === "icon") setIcon(urls[0]);
      else
        setShots((s) => [
          ...s,
          ...urls.map((url, i) => ({ url, ...dims[i], device: dims[i].w ? guessDevice(dims[i].w, dims[i].h) : ("phone" as const) })),
        ]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
      if (screensInput.current) screensInput.current.value = "";
      if (iconInput.current) iconInput.current.value = "";
    }
  }

  const move = (i: number, d: -1 | 1) =>
    setShots((s) => {
      const n = [...s];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });

  // Live preview of the card, built from the current values.
  const preview: Project = {
    ...(project ?? ({ about: [], services: [], built: [], proves: [], gallery: [], galleryWide: null, screens: [], captions: [], galleryCaptions: [] } as unknown as Project)),
    slug: slug || "preview",
    name: name || "Project name",
    kind: kind || "Short label",
    platform: platform || "Platform",
    color,
    status,
    media: shots.length
      ? { icon, screens: shots.map((x) => x.url), device: shots[0].device, shots }
      : builtIn
        ? project?.media
        : { icon, screens: [], device: "phone", shots: [] },
  };

  return (
    <form action={action} className="pf">
      <input type="hidden" name="original" value={project?.slug ?? ""} />
      <input type="hidden" name="shots" value={JSON.stringify(shots)} />
      <input type="hidden" name="icon" value={icon ?? ""} />

      <div className="pf__main">
        <Section title="Basics" sub="How the project is named and where it appears.">
          <div className="pf-row">
            <label className="pf-field">
              <span>Name</span>
              <input
                name="name"
                required
                value={name}
                placeholder="e.g. Episode"
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </label>
            <label className="pf-field">
              <span>Page address</span>
              <span className="pf-prefix">
                <em>/work/</em>
                <input
                  name="slug"
                  required
                  value={slug}
                  readOnly={builtIn}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </span>
            </label>
          </div>
          <div className="pf-row">
            <div className="pf-field">
              <span>Section on the site</span>
              <div className="pf-choice" role="radiogroup">
                {(["shipped", "rnd"] as const).map((v) => (
                  <label key={v} className={status === v ? "is-on" : ""}>
                    <input type="radio" name="status" value={v} checked={status === v} onChange={() => setStatus(v)} />
                    {v === "shipped" ? <Smartphone /> : <Monitor />}
                    <span>
                      <b>{v === "shipped" ? "Mobile apps" : "Web & desktop"}</b>
                      <small>{v === "shipped" ? "Shipped" : "In R&D"}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <label className="pf-field">
              <span>Brand colour</span>
              <span className="pf-color">
                <input name="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                <code>{color}</code>
              </span>
            </label>
          </div>
          <div className="pf-row pf-row--3">
            <label className="pf-field">
              <span>Short label</span>
              <input name="kind" required value={kind} onChange={(e) => setKind(e.target.value)} placeholder="AI journaling" />
            </label>
            <label className="pf-field">
              <span>Category</span>
              <input name="category" required defaultValue={about.Category} placeholder="Lifestyle · AI" />
            </label>
            <label className="pf-field">
              <span>Platform</span>
              <input name="platform" required value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="iPhone" />
            </label>
          </div>
        </Section>

        <Section
          title="Images"
          sub={builtIn && !shots.length ? "This project uses its Figma artwork. Upload screenshots only if you want to replace it." : "Phone screenshots go in an iPhone, web screenshots in a Mac window — any size fits. The first ones make the hero. Use the crop button to position each one."}
        >
          <div className="pf-media">
            <div>
              <span className="pf-label">App icon</span>
              <div className="pf-iconup">
                {icon ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon} alt="" />
                    <button type="button" className="ad-iconbtn ad-iconbtn--sm" aria-label="Remove icon" onClick={() => setIcon(null)}>
                      <X />
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => iconInput.current?.click()} disabled={busy === "icon"}>
                    {busy === "icon" ? <Loader className="ad-spin" /> : <ImagePlus />}
                    <small>Upload</small>
                  </button>
                )}
              </div>
              <input ref={iconInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onFiles("icon", e.target.files)} />
            </div>
            <div className="pf-screens">
              <div className="pf-screens__head">
                <span className="pf-label">
                  Screenshots <em>Any size — framed automatically</em>
                </span>
              </div>
              <ol className="pf-shots">
                {shots.map((x, i) => (
                  <li key={x.url} className={`pf-shots__item pf-shots__item--${x.device}`}>
                    <span className="pf-shots__frame">
                      <Device src={x.url} device={x.device} w={x.w} h={x.h} crop={x.crop} sizes="200px" />
                    </span>
                    <span className="pf-shots__n">{i + 1}</span>
                    <span className="pf-shots__kind" role="radiogroup" aria-label={`Frame for screenshot ${i + 1}`}>
                      {(["phone", "desktop"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          role="radio"
                          aria-checked={x.device === d}
                          title={d === "phone" ? "Show in an iPhone" : "Show in a window"}
                          onClick={() => setShots((all) => all.map((y, j) => (j === i ? { ...y, device: d } : y)))}
                        >
                          {d === "phone" ? <Smartphone /> : <Monitor />}
                        </button>
                      ))}
                    </span>
                    <span className="pf-shots__tools">
                      <button type="button" aria-label="Crop and position" title="Crop and position" aria-pressed={cropping === x.url} onClick={() => setCropping(cropping === x.url ? null : x.url)}>
                        <CropIcon />
                      </button>
                      <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}>
                        <ArrowUp />
                      </button>
                      <button type="button" aria-label="Move later" disabled={i === shots.length - 1} onClick={() => move(i, 1)}>
                        <ArrowDown />
                      </button>
                      <button type="button" aria-label="Remove" onClick={() => setShots((all) => all.filter((y) => y.url !== x.url))}>
                        <X />
                      </button>
                    </span>
                  </li>
                ))}
                <li className="pf-shots__item">
                  <button type="button" className="pf-shots__add" onClick={() => screensInput.current?.click()} disabled={busy === "screens"}>
                    {busy === "screens" ? <Loader className="ad-spin" /> : <ImagePlus />}
                    <span>{busy === "screens" ? "Uploading…" : "Add screenshots"}</span>
                    <small>Phone or web, any size</small>
                  </button>
                </li>
              </ol>
              <input ref={screensInput} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={(e) => onFiles("screens", e.target.files)} />
              {cropping && shots.some((x) => x.url === cropping) && (
                <CropEditor
                  key={cropping}
                  shot={shots.find((x) => x.url === cropping)!}
                  onChange={(crop) => setShots((all) => all.map((y) => (y.url === cropping ? { ...y, crop } : y)))}
                  onDone={() => setCropping(null)}
                />
              )}
            </div>
          </div>
          {uploadError && <p className="sf-err">{uploadError}</p>}
          <label className="pf-field">
            <span>
              Screenshot captions <em>One per line · optional</em>
            </span>
            <textarea name="captions" rows={3} defaultValue={project?.galleryCaptions.join("\n")} placeholder={"01 Onboarding\n02 Home"} />
          </label>
        </Section>

        <Section title="Case study" sub="The words on the project’s page.">
          <label className="pf-field">
            <span>Tagline</span>
            <input name="tagline" required defaultValue={project?.tagline} placeholder="Your life, told one episode at a time." />
          </label>
          <label className="pf-field">
            <span>One-line summary</span>
            <input name="short" required defaultValue={project?.short} placeholder="A journal that turns each day into an episode of your life." />
          </label>
          <label className="pf-field">
            <span>The product</span>
            <textarea name="product" rows={3} required defaultValue={project?.product} />
          </label>
          <label className="pf-field">
            <span>The challenge</span>
            <textarea name="challenge" rows={3} required defaultValue={project?.challenge} />
          </label>
          <div className="pf-row">
            <label className="pf-field">
              <span>
                How we built it <em>One point per line</em>
              </span>
              <textarea name="built" rows={5} required defaultValue={project?.built.join("\n")} />
            </label>
            <label className="pf-field">
              <span>
                What it proves <em>One point per line</em>
              </span>
              <textarea name="proves" rows={5} required defaultValue={project?.proves.join("\n")} />
            </label>
          </div>
          <label className="pf-field">
            <span>
              Highlights <em>Comma-separated · optional</em>
            </span>
            <input name="highlights" defaultValue={about.Highlights} placeholder="AI generation, Offline sync" />
          </label>
          <div className="pf-field">
            <span>Services</span>
            <div className="pf-checks">
              {SERVICES.map((s) => (
                <label key={s}>
                  <input type="checkbox" name="services" value={s} defaultChecked={project ? project.services.includes(s) : s === "Product design"} />
                  <span>
                    <Check />
                  </span>
                  {s}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Access" sub="How visitors can try the product.">
          <label className="pf-field">
            <span>
              Live link <em>https:// · optional</em>
            </span>
            <input name="liveUrl" type="url" defaultValue={project?.liveUrl} placeholder="https://apps.apple.com/app/…" />
          </label>
          <label className="pf-field">
            <span>
              Button text <em>optional</em>
            </span>
            <input name="liveLabel" defaultValue={project?.liveLabel} placeholder="Open on the App Store" />
          </label>
          <div className="pf-field">
            <div className="pf-checks">
              <label>
                <input type="checkbox" name="nda" defaultChecked={Boolean(project?.nda)} />
                <span>
                  <Check />
                </span>
                Under NDA — no public link; invite visitors to request a walkthrough
              </label>
            </div>
          </div>
        </Section>
      </div>

      <aside className="pf__side">
        <div className="ad-card pf-preview">
          <span className="pf-label">Card preview</span>
          <div className="work-card pf-card" style={{ "--p": color } as CSSProperties}>
            <div className="work-card__stage">
              <StageArt p={preview} />
            </div>
            <div className="work-card__meta">
              <ProjectIcon p={preview} size={44} className="app-icon" />
              <div>
                <div className="work-card__name">{preview.name}</div>
                <div className="work-card__kind">
                  {preview.kind} · {preview.platform}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ad-card pf-publish">
          <label className="pf-switch">
            <input name="published" type="checkbox" defaultChecked={published} />
            <span aria-hidden="true" />
            <span>
              <b>Show on the site</b>
              <small>Folder, carousel and case-study page</small>
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
            {saving ? "Saving…" : project ? "Save changes" : "Create project"}
          </button>
        </div>
      </aside>
    </form>
  );
}
