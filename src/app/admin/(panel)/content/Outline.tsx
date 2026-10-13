"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Loader, Pencil, Plus, X } from "lucide-react";
import type { Layout, Template } from "@/content/cms";
import { Icon } from "@/components/ui/Icon";
import { createSection, saveLayout } from "../../actions";

type Row = { id: string; href: string; name: string; about: string; icon: string; custom: boolean; edited: boolean };
type Tpl = { k: string; name: string; about: string; icon: string };

/** Sketch of each template for the picker. */
function Thumb({ k }: { k: string }) {
  return (
    <span className={`tp-thumb tp-thumb--${k}`} aria-hidden="true">
      {k === "features" && (
        <>
          <i className="h" />
          <span className="g">
            <i />
            <i />
            <i />
          </span>
        </>
      )}
      {k === "media" && (
        <span className="m">
          <span>
            <i className="h" />
            <i className="t" />
            <i className="t s" />
            <i className="b" />
          </span>
          <i className="img" />
        </span>
      )}
      {k === "stats" && (
        <>
          <i className="h" />
          <span className="g">
            <b>12</b>
            <b>4</b>
            <b>1d</b>
          </span>
        </>
      )}
      {k === "quote" && (
        <span className="q">
          <i className="t" />
          <i className="t" />
          <i className="t s" />
          <i className="av" />
        </span>
      )}
      {k === "logos" && (
        <span className="l">
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      {k === "cta" && (
        <span className="c">
          <span>
            <i className="h" />
            <i className="t" />
          </span>
          <i className="b" />
        </span>
      )}
    </span>
  );
}

export function Outline({ rows: initial, layout, templates, contactEdited, contactAbout }: {
  rows: Row[];
  layout: Layout;
  templates: Tpl[];
  contactEdited: boolean;
  contactAbout: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [hidden, setHidden] = useState(new Set(layout.hidden));
  const [drag, setDrag] = useState<number | null>(null);
  const [picker, setPicker] = useState<{ after: string | null } | null>(null);
  const [pending, start] = useTransition();
  const [creating, setCreating] = useState<string | null>(null);

  // Take fresh rows from the server after a refresh.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setRows(initial);
  }

  function persist(nextRows: Row[], nextHidden: Set<string>) {
    start(async () => {
      await saveLayout({ order: nextRows.map((r) => r.id), hidden: [...nextHidden] });
      router.refresh();
    });
  }
  const move = (from: number, to: number) => {
    if (to < 0 || to >= rows.length || from === to) return;
    const n = [...rows];
    const [r] = n.splice(from, 1);
    n.splice(to, 0, r);
    setRows(n);
    persist(n, hidden);
  };
  const toggle = (id: string) => {
    const h = new Set(hidden);
    if (h.has(id)) h.delete(id);
    else h.add(id);
    setHidden(h);
    persist(rows, h);
  };

  async function add(k: string) {
    setCreating(k);
    try {
      const id = await createSection(k as Template, picker?.after ?? null);
      router.push(`/admin/content/${id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not add the section.");
      setCreating(null);
    }
  }

  const visible = rows.filter((r) => !hidden.has(r.id)).length;

  return (
    <>
      <div className="ol-summary">
        <span>
          <b>{visible}</b> visible · {rows.length - visible} hidden
        </span>
        {pending && (
          <span className="ol-saving">
            <Loader className="ad-spin" /> Saving order…
          </span>
        )}
        <button type="button" className="ad-btn ad-btn--primary" onClick={() => setPicker({ after: null })}>
          <Plus />
          Add section
        </button>
      </div>

      <ol className="ol">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`ol__row ${hidden.has(r.id) ? "is-hidden" : ""} ${drag === i ? "is-drag" : ""}`}
            draggable
            onDragStart={() => setDrag(i)}
            onDragEnd={() => setDrag(null)}
            onDragOver={(e) => {
              e.preventDefault();
              if (drag !== null && drag !== i) {
                const n = [...rows];
                const [x] = n.splice(drag, 1);
                n.splice(i, 0, x);
                setRows(n);
                setDrag(i);
              }
            }}
            onDrop={() => persist(rows, hidden)}
          >
            <span className="ol__grip" aria-hidden="true">
              <GripVertical />
            </span>
            <span className="ol__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="ol__icon">
              <Icon name={r.icon} />
            </span>
            <Link href={r.href} className="ol__text">
              <b>
                {r.name}
                {r.custom && <em className="ol__tag">Custom</em>}
                {!r.custom && r.edited && <em className="ol__tag ol__tag--edited">Edited</em>}
              </b>
              <small>{r.about}</small>
            </Link>
            <span className="ol__tools">
              <button type="button" className="ad-iconbtn ad-iconbtn--sm" aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
                <ChevronUp />
              </button>
              <button type="button" className="ad-iconbtn ad-iconbtn--sm" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, i + 1)}>
                <ChevronDown />
              </button>
              <button
                type="button"
                className={`ol__vis ${hidden.has(r.id) ? "" : "is-on"}`}
                role="switch"
                aria-checked={!hidden.has(r.id)}
                aria-label={hidden.has(r.id) ? `Show ${r.name}` : `Hide ${r.name}`}
                onClick={() => toggle(r.id)}
              >
                {hidden.has(r.id) ? <EyeOff /> : <Eye />}
                {hidden.has(r.id) ? "Hidden" : "Visible"}
              </button>
              <Link href={r.href} className="ad-btn ad-btn--sm">
                <Pencil />
                Edit
              </Link>
            </span>
            <button type="button" className="ol__insert" aria-label={`Add a section after ${r.name}`} onClick={() => setPicker({ after: r.id })}>
              <Plus />
            </button>
          </li>
        ))}
      </ol>

      <h2 className="ad-subhead">Site-wide</h2>
      <Link href="/admin/content/contact" className="ol__row ol__row--single">
        <span className="ol__icon">
          <Icon name="mail" />
        </span>
        <span className="ol__text">
          <b>
            Contact details {contactEdited && <em className="ol__tag ol__tag--edited">Edited</em>}
          </b>
          <small>{contactAbout}</small>
        </span>
        <span className="ad-btn ad-btn--sm">
          <Pencil />
          Edit
        </span>
      </Link>
      <Link href="/admin/content/appearance" className="ol__row ol__row--single">
        <span className="ol__icon">
          <Icon name="sparkles" />
        </span>
        <span className="ol__text">
          <b>
            Appearance
          </b>
          <small>Glass effect strength for the nav, buttons and chips.</small>
        </span>
        <span className="ad-btn ad-btn--sm">
          <Pencil />
          Edit
        </span>
      </Link>

      {picker && (
        <div className="tp" role="dialog" aria-modal="true" aria-label="Add a section" onClick={(e) => e.target === e.currentTarget && setPicker(null)}>
          <div className="tp__panel">
            <header>
              <div>
                <h2>Add a section</h2>
                <p>
                  {picker.after
                    ? `Goes after “${rows.find((r) => r.id === picker.after)?.name}”. `
                    : "Goes at the end of the page. "}
                  It starts hidden so you can finish it first.
                </p>
              </div>
              <button type="button" className="ad-iconbtn" aria-label="Close" onClick={() => setPicker(null)}>
                <X />
              </button>
            </header>
            <div className="tp__grid">
              {templates.map((t) => (
                <button key={t.k} type="button" className="tp__card" onClick={() => add(t.k)} disabled={Boolean(creating)}>
                  <Thumb k={t.k} />
                  <b>
                    <Icon name={t.icon} />
                    {t.name}
                    {creating === t.k && <Loader className="ad-spin" />}
                  </b>
                  <small>{t.about}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
