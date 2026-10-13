"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  ChevronDown, ChevronUp, Copy, GripVertical, ImagePlus, Loader, Plus, Trash2, X,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Field } from "@/content/cms";
import { Icon, ICON_NAMES } from "@/components/ui/Icon";
import { config } from "@/lib/config";
import { prepareUploads } from "../actions";

type Data = Record<string, unknown>;

/* ---------- Single fields ---------- */

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const names = ICON_NAMES.filter((n) => n.includes(q.toLowerCase()));
  return (
    <div className="sf-icon" ref={ref}>
      <button type="button" className="sf-icon__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="sf-icon__tile">
          <Icon name={value || "sparkles"} />
        </span>
        {value || "Choose an icon"}
        <ChevronDown />
      </button>
      {open && (
        <div className="sf-icon__pop">
          <input autoFocus placeholder="Search icons" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="sf-icon__grid">
            {names.map((n) => (
              <button
                type="button"
                key={n}
                title={n}
                aria-pressed={n === value}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                }}
              >
                <Icon name={n} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageField({ value, onChange, folder }: { value: string; onChange: (v: string) => void; folder: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  async function pick(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    setErr(null);
    try {
      const [s] = await prepareUploads(folder, [f.type]);
      const { error } = await createBrowserClient(config.supabaseUrl, config.supabaseAnonKey)
        .storage.from("project-media")
        .uploadToSignedUrl(s.path, s.token, f, { contentType: f.type });
      if (error) throw new Error(error.message);
      onChange(s.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div className="sf-image">
      {value ? (
        <div className="sf-image__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
          <div>
            <button type="button" className="ad-btn ad-btn--sm" onClick={() => input.current?.click()}>
              Replace
            </button>
            <button type="button" className="ad-btn ad-btn--sm ad-btn--ghost" onClick={() => onChange("")}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="sf-image__drop" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Loader className="ad-spin" /> : <ImagePlus />}
          <span>{busy ? "Uploading…" : "Upload an image"}</span>
          <small>PNG, JPG or WebP · up to 8 MB</small>
        </button>
      )}
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {err && <p className="sf-err">{err}</p>}
    </div>
  );
}

function Strings({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="sf-tags">
      {value.map((t, i) => (
        <span key={`${t}-${i}`} className="sf-tag">
          <input
            value={t}
            size={Math.max(4, t.length)}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
            aria-label={`Item ${i + 1}`}
          />
          <button type="button" aria-label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <X />
          </button>
        </span>
      ))}
      <input
        className="sf-tags__new"
        value={draft}
        placeholder="Type and press Enter"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
      />
    </div>
  );
}

function Table({ value, columns, onChange }: { value: string[][]; columns: string[]; onChange: (v: string[][]) => void }) {
  const set = (r: number, c: number, v: string) => onChange(value.map((row, i) => (i === r ? row.map((x, j) => (j === c ? v : x)) : row)));
  return (
    <div className="sf-table">
      <div className="sf-table__head" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 32px` }}>
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {value.map((row, r) => (
        <div key={r} className="sf-table__row" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 32px` }}>
          {columns.map((c, j) => (
            <input key={c} value={row[j] ?? ""} onChange={(e) => set(r, j, e.target.value)} aria-label={`${c}, row ${r + 1}`} />
          ))}
          <button type="button" className="ad-iconbtn ad-iconbtn--sm" aria-label="Remove row" onClick={() => onChange(value.filter((_, i) => i !== r))}>
            <Trash2 />
          </button>
        </div>
      ))}
      <button type="button" className="sf-add" onClick={() => onChange([...value, columns.map(() => "")])}>
        <Plus /> Add row
      </button>
    </div>
  );
}

/* ---------- Lists of items ---------- */

function List({ f, value, onChange, folder }: { f: Extract<Field, { type: "list" }>; value: Data[]; onChange: (v: Data[]) => void; folder: string }) {
  const [open, setOpen] = useState<number | null>(value.length ? null : 0);
  const blank = () => Object.fromEntries(f.of.map((x) => [x.k, x.type === "strings" || x.type === "list" ? [] : x.type === "table" ? [] : ""]));
  const move = (i: number, d: number) => {
    const n = [...value];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    onChange(n);
    setOpen(open === i ? i + d : open === i + d ? i : open);
  };
  return (
    <div className="sf-list">
      {value.map((item, i) => {
        const title = String(item[f.title ?? "title"] ?? "") || `Untitled ${f.item}`;
        const iconField = f.of.find((x) => x.type === "icon");
        return (
          <div key={i} className={`sf-item ${open === i ? "is-open" : ""}`}>
            <div className="sf-item__bar">
              <GripVertical className="sf-item__grip" />
              <button type="button" className="sf-item__title" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                {iconField && (
                  <span className="sf-icon__tile sf-icon__tile--sm">
                    <Icon name={String(item[iconField.k] || "sparkles")} />
                  </span>
                )}
                <span>{title}</span>
                <ChevronDown className="sf-item__chev" />
              </button>
              <span className="sf-item__tools">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ChevronUp />
                </button>
                <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                  <ChevronDown />
                </button>
                <button
                  type="button"
                  aria-label="Duplicate"
                  disabled={Boolean(f.max && value.length >= f.max)}
                  onClick={() => {
                    const n = [...value];
                    // A copy is a new item: drop any built-in key so it doesn't reuse an animation slot.
                    const { key: _k, ...copy } = item;
                    void _k;
                    n.splice(i + 1, 0, structuredClone(copy));
                    onChange(n);
                    setOpen(i + 1);
                  }}
                >
                  <Copy />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  className="is-danger"
                  onClick={() => {
                    if (confirm(`Remove “${title}”?`)) onChange(value.filter((_, j) => j !== i));
                  }}
                >
                  <Trash2 />
                </button>
              </span>
            </div>
            {open === i && (
              <div className="sf-item__body">
                <Fields fields={f.of} data={item} onChange={(d) => onChange(value.map((x, j) => (j === i ? d : x)))} folder={folder} />
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className="sf-add"
        disabled={Boolean(f.max && value.length >= f.max)}
        onClick={() => {
          onChange([...value, blank()]);
          setOpen(value.length);
        }}
      >
        <Plus /> Add {f.item}
        {f.max ? <small>{value.length} of {f.max}</small> : null}
      </button>
    </div>
  );
}

/* ---------- Form ---------- */

export function Fields({ fields, data, onChange, folder }: { fields: Field[]; data: Data; onChange: (d: Data) => void; folder: string }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="sf-fields">
      {fields.map((f) => {
        const v = data[f.k];
        const wide = f.type === "list" || f.type === "table" || f.type === "textarea" || f.type === "strings" || f.type === "image";
        return (
          <div key={f.k} className={`sf-field ${wide ? "sf-field--wide" : ""}`}>
            <label className="sf-label">
              {f.label}
              {"optional" in f && f.optional && <em>Optional</em>}
            </label>
            {f.type === "text" || f.type === "url" ? (
              <input value={String(v ?? "")} onChange={(e) => set(f.k, e.target.value)} />
            ) : f.type === "textarea" ? (
              <textarea rows={f.rows ?? 3} value={String(v ?? "")} onChange={(e) => set(f.k, e.target.value)} />
            ) : f.type === "icon" ? (
              <IconPicker value={String(v ?? "")} onChange={(x) => set(f.k, x)} />
            ) : f.type === "image" ? (
              <ImageField value={String(v ?? "")} onChange={(x) => set(f.k, x)} folder={folder} />
            ) : f.type === "strings" ? (
              <Strings value={Array.isArray(v) ? (v as string[]) : []} onChange={(x) => set(f.k, x)} />
            ) : f.type === "table" ? (
              <Table value={Array.isArray(v) ? (v as string[][]) : []} columns={f.columns} onChange={(x) => set(f.k, x)} />
            ) : f.type === "range" ? (
              <span className="sf-range">
                <input type="range" min={f.min} max={f.max} step={f.step ?? 1} value={Number(v ?? f.min)} onChange={(e) => set(f.k, Number(e.target.value))} />
                <b>
                  {Number(v ?? f.min)}
                  {f.unit}
                </b>
              </span>
            ) : f.type === "list" ? (
              <List f={f} value={Array.isArray(v) ? (v as Data[]) : []} onChange={(x) => set(f.k, x)} folder={folder} />
            ) : null}
            {f.hint && <small className="sf-hint">{f.hint}</small>}
          </div>
        );
      })}
    </div>
  );
}
