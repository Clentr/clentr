"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import type { Crop, Shot } from "@/content/projects";
import { Device } from "@/components/work/ProjectArt";

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/**
 * Edit how a screenshot sits in its frame: drag to move it, slide to zoom. Shows the exact
 * Mac window (or iPhone) used on the site, so what you see is what gets published.
 */
export function CropEditor({ shot, onChange, onDone }: { shot: Shot; onChange: (c: Crop | undefined) => void; onDone: () => void }) {
  const [c, setC] = useState<Crop>(shot.crop ?? { x: 50, y: 0, z: 1 });
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; c: Crop } | null>(null);
  const set = (n: Crop) => {
    setC(n);
    onChange(n);
  };

  return (
    <div className="crop">
      <div
        ref={box}
        className={`crop__stage crop__stage--${shot.device}`}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, c };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const r = box.current?.getBoundingClientRect();
          if (!d || !r) return;
          // Dragging right reveals more of the left side, like moving a photo under a frame.
          const k = 100 / d.c.z;
          set({ ...d.c, x: clamp(d.c.x - ((e.clientX - d.x) / r.width) * k * 1.6, 0, 100), y: clamp(d.c.y - ((e.clientY - d.y) / r.height) * k * 1.6, 0, 100) });
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <Device src={shot.url} device={shot.device} w={shot.w} h={shot.h} crop={c} sizes="520px" />
        <span className="crop__hint">Drag to reposition</span>
      </div>
      <div className="crop__controls">
        <label>
          <span>Zoom</span>
          <input type="range" min={1} max={3} step={0.01} value={c.z} onChange={(e) => set({ ...c, z: Number(e.target.value) })} />
          <b>{Math.round(c.z * 100)}%</b>
        </label>
        <label>
          <span>Horizontal</span>
          <input type="range" min={0} max={100} step={1} value={c.x} onChange={(e) => set({ ...c, x: Number(e.target.value) })} />
          <b>{Math.round(c.x)}%</b>
        </label>
        <label>
          <span>Vertical</span>
          <input type="range" min={0} max={100} step={1} value={c.y} onChange={(e) => set({ ...c, y: Number(e.target.value) })} />
          <b>{Math.round(c.y)}%</b>
        </label>
        <div className="crop__actions">
          <button
            type="button"
            className="ad-btn ad-btn--ghost"
            onClick={() => {
              setC({ x: 50, y: 0, z: 1 });
              onChange(undefined);
            }}
          >
            <RotateCcw /> Reset
          </button>
          <button type="button" className="ad-btn ad-btn--primary" onClick={onDone}>
            <Check /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
