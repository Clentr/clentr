"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { Icon } from "../ui/Icon";

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const ASSETS = "/pdfjs/";

/**
 * Reads a PDF right on the page: pages render as you scroll (sharp at any zoom), with a page
 * counter, jump-to-page, zoom, thumbnails and full screen. Falls back to the browser's viewer.
 */
export function PdfReader({ src, title, download }: { src: string; title: string; download?: string }) {
  const shell = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [ratios, setRatios] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [thumbs, setThumbs] = useState(false);
  const [full, setFull] = useState(false);
  const [width, setWidth] = useState(0);

  // Load the document.
  useEffect(() => {
    let dead = false;
    let task: { destroy: () => Promise<void> } | null = null;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `${ASSETS}pdf.worker.min.mjs`;
        const t = pdfjs.getDocument({ url: src, cMapUrl: `${ASSETS}cmaps/`, cMapPacked: true, standardFontDataUrl: `${ASSETS}standard_fonts/`, wasmUrl: `${ASSETS}wasm/` });
        task = t;
        t.onProgress = ({ loaded, total }: { loaded: number; total: number }) => total && setProgress(Math.min(99, Math.round((loaded / total) * 100)));
        const d = await t.promise;
        if (dead) return;
        // Page shapes up front, so the scroll height is right before anything renders.
        const r = await Promise.all(
          Array.from({ length: d.numPages }, async (_, i) => {
            const v = (await d.getPage(i + 1)).getViewport({ scale: 1 });
            return v.height / v.width;
          }),
        );
        if (dead) return;
        setRatios(r);
        setDoc(d);
      } catch {
        if (!dead) setFailed(true);
      }
    })();
    return () => {
      dead = true;
      void task?.destroy();
    };
  }, [src]);

  // Track the reading width.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc]);

  // Which page is on screen.
  useEffect(() => {
    const root = scroller.current;
    if (!root || !doc) return;
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setPage(Number((best.target as HTMLElement).dataset.page));
      },
      { root, threshold: [0.25, 0.5, 0.75] },
    );
    root.querySelectorAll(".pdfr__page").forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [doc, zoom, width]);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const goTo = useCallback((n: number) => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-page="${n}"]`);
    if (el && scroller.current) scroller.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
  }, []);

  const pageWidth = Math.max(240, Math.min(width - 32, 900) * zoom);
  const n = ratios.length;

  if (failed)
    return (
      <div className="pdfr pdfr--fallback">
        <iframe src={src} title={title} className="pdfr__native" />
      </div>
    );

  return (
    <div className={`pdfr ${full ? "is-full" : ""}`} ref={shell}>
      <div className="pdfr__bar">
        <div className="pdfr__group">
          <button type="button" className="pdfr__btn pdfr__thumbs-btn" aria-pressed={thumbs} onClick={() => setThumbs((t) => !t)} title="Pages" aria-label="Show pages">
            <Icon name="layers" />
          </button>
          <span className="pdfr__pager">
            <input
              aria-label="Page"
              inputMode="numeric"
              value={doc ? page : ""}
              onChange={(e) => {
                const v = Number(e.target.value.replace(/\D/g, ""));
                if (v >= 1 && v <= n) {
                  setPage(v);
                  goTo(v);
                }
              }}
            />
            <span>/ {n || "–"}</span>
          </span>
        </div>
        <div className="pdfr__group">
          <button type="button" className="pdfr__btn" onClick={() => setZoom((z) => ZOOMS[Math.max(0, ZOOMS.indexOf(z) - 1)])} disabled={zoom === ZOOMS[0]} aria-label="Zoom out">
            <Icon name="minus" />
          </button>
          <button type="button" className="pdfr__zoom" onClick={() => setZoom(1)} title="Fit to width">
            {Math.round(zoom * 100)}%
          </button>
          <button type="button" className="pdfr__btn" onClick={() => setZoom((z) => ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(z) + 1)])} disabled={zoom === ZOOMS.at(-1)} aria-label="Zoom in">
            <Icon name="plus" />
          </button>
        </div>
        <div className="pdfr__group">
          {download && (
            <a className="pdfr__btn" href={download} title="Download" aria-label="Download">
              <Icon name="download" />
            </a>
          )}
          <button
            type="button"
            className="pdfr__btn"
            onClick={() => (full ? document.exitFullscreen() : shell.current?.requestFullscreen?.())}
            aria-label={full ? "Exit full screen" : "Full screen"}
            title={full ? "Exit full screen" : "Full screen"}
          >
            <Icon name={full ? "minimize" : "maximize"} />
          </button>
        </div>
      </div>

      <div className="pdfr__body">
        {thumbs && doc && (
          <nav className="pdfr__side" aria-label="Pages">
            {ratios.map((r, i) => (
              <button key={i} type="button" aria-current={page === i + 1 ? "page" : undefined} onClick={() => goTo(i + 1)}>
                <PageCanvas doc={doc} n={i + 1} width={108} ratio={r} root={null} />
                <small>{i + 1}</small>
              </button>
            ))}
          </nav>
        )}
        <div
          className="pdfr__scroll"
          ref={(el) => {
            scroller.current = el;
            setRootEl(el);
          }}
        >
          {!doc ? (
            <div className="pdfr__loading">
              <span className="pdfr__sheet" />
              <small>Opening {progress ? `${progress}%` : "…"}</small>
            </div>
          ) : (
            ratios.map((r, i) => (
              <div key={i} className="pdfr__page" data-page={i + 1} style={{ width: pageWidth, height: pageWidth * r }}>
                <PageCanvas doc={doc} n={i + 1} width={pageWidth} ratio={r} root={rootEl} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** One page, drawn when it comes near the viewport and redrawn sharp when the size changes. */
function PageCanvas({ doc, n, width, ratio, root }: { doc: PDFDocumentProxy; n: number; width: number; ratio: number; root: HTMLElement | null }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { root, rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  useEffect(() => {
    if (!near || !canvas.current) return;
    let task: RenderTask | null = null;
    let dead = false;
    const t = window.setTimeout(async () => {
      const pg = await doc.getPage(n);
      if (dead || !canvas.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const viewport = pg.getViewport({ scale: (width / pg.getViewport({ scale: 1 }).width) * dpr });
      const c = canvas.current;
      c.width = Math.floor(viewport.width);
      c.height = Math.floor(viewport.height);
      task = pg.render({ canvas: c, viewport });
      task.promise.catch(() => {});
    }, 60);
    return () => {
      dead = true;
      clearTimeout(t);
      task?.cancel();
    };
  }, [near, doc, n, width]);

  return <canvas ref={canvas} className="pdfr__canvas" style={{ width, height: width * ratio }} aria-label={`Page ${n}`} role="img" />;
}
