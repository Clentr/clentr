"use client";

import { useEffect, useState } from "react";
import type { View } from "@/content/resources";
import { Icon } from "../ui/Icon";
import { PdfReader } from "./PdfReader";

/** Splits CSV/TSV text into rows (handles quoted cells). */
function parseTable(text: string, sep: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) endCell();
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      endCell();
      rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell || row.length) {
    endCell();
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

function TextView({ src, table }: { src: string; table: boolean }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    let dead = false;
    fetch(src)
      .then((r) => r.text())
      .then((t) => !dead && setText(t.slice(0, 400_000)))
      .catch(() => !dead && setText(""));
    return () => {
      dead = true;
    };
  }, [src]);
  if (text === null) return <div className="rv__loading">Opening…</div>;
  if (!table) return <pre className="rv__text">{text}</pre>;
  const rows = parseTable(text, src.toLowerCase().includes(".tsv") ? "\t" : ",").slice(0, 2000);
  const [head = [], ...body] = rows;
  return (
    <div className="rv__table">
      <table>
        <thead>
          <tr>
            <th aria-hidden="true" />
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, i) => (
            <tr key={i}>
              <td className="rv__n">{i + 1}</td>
              {head.map((_, j) => (
                <td key={j}>{r[j]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Shows a resource in place: PDF reader, Office viewer, media, tables or an embedded page. */
export function ResourceViewer({ view, title, download }: { view: View; title: string; download?: string }) {
  const [zoomed, setZoomed] = useState(false);
  switch (view.kind) {
    case "pdf":
      return <PdfReader src={view.src} title={title} download={download} />;
    case "office":
      return (
        <div className="rv rv--frame">
          <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(view.src)}`} title={title} allowFullScreen />
        </div>
      );
    case "embed":
      return (
        <div className="rv rv--frame">
          <iframe src={view.src} title={title} allow="autoplay; fullscreen; picture-in-picture; clipboard-write" allowFullScreen />
        </div>
      );
    case "image":
      return (
        <div className={`rv rv--image ${zoomed ? "is-zoomed" : ""}`}>
          <button type="button" onClick={() => setZoomed((z) => !z)} aria-label={zoomed ? "Fit to screen" : "Zoom in"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={view.src} alt={title} />
          </button>
        </div>
      );
    case "video":
      return (
        <div className="rv rv--media">
          <video src={view.src} controls playsInline preload="metadata" />
        </div>
      );
    case "audio":
      return (
        <div className="rv rv--audio">
          <span className="icon-tile">
            <Icon name="audio-lines" />
          </span>
          <audio src={view.src} controls preload="metadata" />
        </div>
      );
    case "text":
      return (
        <div className="rv rv--doc">
          <TextView src={view.src} table={view.table} />
        </div>
      );
    case "link":
      return (
        <div className="rv rv--card">
          <span className="icon-tile">
            <Icon name="link" />
          </span>
          <b>This resource lives on {view.host}</b>
          <p>It opens in a new tab, so you can keep this page.</p>
          <a className="btn btn--ink btn--sm" href={view.src} target="_blank" rel="noopener" data-track={`resource_open:${title}`}>
            Open on {view.host}
            <Icon name="arrow-up-right" className="arrow" />
          </a>
        </div>
      );
    default:
      return (
        <div className="rv rv--card">
          <span className="icon-tile">
            <Icon name="package" />
          </span>
          <b>Ready to download</b>
          <p>This file type opens on your computer — download it to get started.</p>
          {download && (
            <a className="btn btn--ink btn--sm" href={download} data-track={`resource_download:${title}`}>
              Download
              <Icon name="download" />
            </a>
          )}
        </div>
      );
  }
}

/** Native share sheet on phones; copies the link elsewhere. */
export function ShareResource({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = location.href.split("#")[0];
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        window.setTimeout(() => setDone(false), 1800);
      }
    } catch {
      /* dismissed */
    }
  }
  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={share} data-track={`resource_share:${title}`}>
      <Icon name={done ? "check" : "share"} />
      {done ? "Link copied" : "Share"}
    </button>
  );
}
