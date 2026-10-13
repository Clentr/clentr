"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, Check, ExternalLink, Eye, EyeOff, Loader, RotateCcw, Trash2 } from "lucide-react";
import type { Field, Layout, SectionKey } from "@/content/cms";
import { Icon } from "@/components/ui/Icon";
import { deleteCustomSection, resetSectionContent, saveCustomSection, saveLayout, saveSectionContent } from "../actions";
import { Fields } from "./SchemaForm";

type Props = {
  kind: "builtin" | "custom";
  id: string; // section key, or custom section uuid
  layoutId: string | null; // id in the home layout ("services", "s:<uuid>"), null for site-wide
  name: string;
  about: string;
  icon: string;
  fields: Field[];
  initial: Record<string, unknown>;
  anchor: string | null;
  layout: Layout;
  edited: boolean;
};

export function SectionEditor(p: Props) {
  const router = useRouter();
  const [data, setData] = useState(p.initial);
  const [name, setName] = useState(p.name);
  const [saved, setSaved] = useState({ data: JSON.stringify(p.initial), name: p.name });
  const [hidden, setHidden] = useState(p.layoutId ? p.layout.hidden.includes(p.layoutId) : false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string } | null>(null);
  const [saving, start] = useTransition();
  const [frameKey, setFrameKey] = useState(0);
  const dirty = JSON.stringify(data) !== saved.data || name !== saved.name;
  const frame = useRef<HTMLIFrameElement>(null);

  function save() {
    start(async () => {
      const r = p.kind === "builtin" ? await saveSectionContent(p.id as SectionKey, data) : await saveCustomSection(p.id, name, data);
      setMsg(r ?? null);
      if (!r?.error) {
        setSaved({ data: JSON.stringify(data), name });
        setFrameKey((k) => k + 1);
        router.refresh();
      }
    });
  }

  // ⌘S / Ctrl+S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function toggleHidden() {
    if (!p.layoutId) return;
    const next = !hidden;
    setHidden(next);
    const h = new Set(p.layout.hidden);
    if (next) h.add(p.layoutId);
    else h.delete(p.layoutId);
    start(async () => {
      await saveLayout({ ...p.layout, hidden: [...h] });
      setFrameKey((k) => k + 1);
      router.refresh();
    });
  }

  const previewSrc = `/${p.anchor ? `#${p.anchor}` : ""}`;

  return (
    <div className="se">
      <header className="se__head">
        <Link href="/admin/content" className="ad-iconbtn" aria-label="Back to home page sections">
          <ArrowLeft />
        </Link>
        <span className="se__icon">
          <Icon name={p.icon} />
        </span>
        <div className="se__title">
          {p.kind === "custom" ? (
            <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Section name" />
          ) : (
            <h1>{p.name}</h1>
          )}
          <p>{p.about}</p>
        </div>
        <div className="se__actions">
          {p.layoutId && (
            <button type="button" className={`ad-btn ${hidden ? "ad-btn--warn" : ""}`} onClick={toggleHidden}>
              {hidden ? <EyeOff /> : <Eye />}
              {hidden ? "Hidden" : "Visible"}
            </button>
          )}
          {p.anchor && !hidden && (
            <a className="ad-btn" href={previewSrc} target="_blank" rel="noopener">
              <ExternalLink />
              View
            </a>
          )}
        </div>
      </header>

      <div className="se__body">
        <div className="se__form ad-card">
          <Fields fields={p.fields} data={data} onChange={(d) => setData(d)} folder={p.kind === "custom" ? `sections/${p.id}` : "content"} />
        </div>
        <aside className="se__preview">
          <div className="se__browser">
            <div className="se__bar">
              <i />
              <i />
              <i />
              <span>clentr.com{previewSrc === "/" ? "" : previewSrc}</span>
              {saving && <Loader className="ad-spin" />}
            </div>
            {hidden ? (
              <div className="se__hidden">
                <EyeOff />
                <b>This section is hidden</b>
                <span>Make it visible to see it on the page.</span>
              </div>
            ) : (
              <div className="se__frame">
                <iframe key={frameKey} ref={frame} src={previewSrc} title="Live preview" loading="lazy" />
              </div>
            )}
          </div>
          <p className="se__note">Live site — refreshes after each save.</p>
        </aside>
      </div>

      <div className={`se__bar-save ${dirty || msg ? "is-on" : ""}`} role="status">
        <span>
          {msg?.error ? (
            <span className="sf-err">{msg.error}</span>
          ) : dirty ? (
            "You have unsaved changes"
          ) : msg?.ok ? (
            <>
              <Check /> {msg.ok}
            </>
          ) : null}
        </span>
        <div>
          {p.kind === "builtin" && p.edited && (
            <button
              type="button"
              className="ad-btn ad-btn--ghost"
              onClick={() => {
                if (!confirm("Reset this section to its original text?")) return;
                start(async () => {
                  await resetSectionContent(p.id as SectionKey);
                  router.refresh();
                  location.reload();
                });
              }}
            >
              <RotateCcw />
              Reset to original
            </button>
          )}
          {p.kind === "custom" && (
            <button
              type="button"
              className="ad-btn ad-btn--ghost ad-btn--danger"
              onClick={() => {
                if (confirm(`Delete “${name}”? This can’t be undone.`)) start(() => deleteCustomSection(p.id));
              }}
            >
              <Trash2 />
              Delete section
            </button>
          )}
          {dirty && (
            <button type="button" className="ad-btn ad-btn--ghost" onClick={() => {
                setData(JSON.parse(saved.data));
                setName(saved.name);
              }}>
              Discard
            </button>
          )}
          <button type="button" className="ad-btn ad-btn--primary" disabled={!dirty || saving} onClick={save}>
            {saving ? <Loader className="ad-spin" /> : <Check />}
            {saving ? "Saving…" : "Save changes"}
            <kbd>⌘S</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
