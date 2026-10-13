import Image from "next/image";
import type { CSSProperties } from "react";
import { shotsOf, type Crop, type Device as DeviceKind, type Project, type Shot } from "@/content/projects";
import { Art } from "../ui/Art";

/*
 * Project artwork. Built-in projects use their Figma exports; projects added from the admin
 * panel (`p.media`) get the same compositions built from their uploaded screenshots.
 */

const tint = (p: Project) => ({ "--p": p.color }) as CSSProperties;

// Visible screen proportions (height / width) of each frame.
const SCREEN_RATIO: Record<DeviceKind, number> = { phone: 19.5 / 9, desktop: 10 / 16 };

/**
 * How a screenshot fills its frame without losing anything:
 * close to the frame's shape → fills it; much taller (full-page capture) → fits the width and
 * scrolls through on hover; otherwise → shown whole over a soft blurred copy of itself.
 */
function fitFor(device: DeviceKind, w: number, h: number) {
  if (!w || !h) return "fill";
  const diff = h / w / SCREEN_RATIO[device];
  if (diff > 0.88 && diff < 1.14) return "fill";
  return diff >= 1.14 ? "scroll" : "contain";
}

/** A screenshot in an iPhone or a macOS-style window, fitted to any size. */
export function Device({ src, device, w = 0, h = 0, alt = "", sizes, className = "", crop }: {
  src: string;
  device: DeviceKind;
  w?: number;
  h?: number;
  alt?: string;
  sizes: string;
  className?: string;
  crop?: Crop;
}) {
  // A saved crop always fills the frame at the chosen focus point and zoom.
  const fit = crop ? "fill" : fitFor(device, w, h);
  const cropStyle = crop
    ? ({ objectPosition: `${crop.x}% ${crop.y}%`, transform: `scale(${crop.z})`, transformOrigin: `${crop.x}% ${crop.y}%` } as CSSProperties)
    : undefined;
  const pan = fit === "scroll" ? Math.min(14, Math.max(4, ((h / w / SCREEN_RATIO[device]) - 1) * 3)) : 0;
  return (
    <span className={`dev dev--${device} dev--${fit} ${className}`} style={pan ? ({ "--pan": `${pan}s` } as CSSProperties) : undefined}>
      {device === "desktop" ? (
        <span className="dev__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="dev__url" />
        </span>
      ) : (
        <span className="dev__island" aria-hidden="true" />
      )}
      <span className="dev__screen">
        {fit === "contain" && <Image src={src} alt="" fill sizes={sizes} className="dev__blur" aria-hidden="true" />}
        <Image src={src} alt={alt} fill sizes={sizes} className="dev__img" style={cropStyle} />
      </span>
    </span>
  );
}

const Shot = ({ s, sizes, className }: { s: Shot; sizes: string; className?: string }) => (
  <Device src={s.url} device={s.device} w={s.w} h={s.h} sizes={sizes} className={className} crop={s.crop} />
);

export function ProjectIcon({ p, size, className = "" }: { p: Project; size: number; className?: string }) {
  if (!p.media) return <Art name={`icon-${p.slug}`} themed alt="" className={className} sizes={`${size}px`} />;
  if (p.media.icon) return <Image src={p.media.icon} alt="" width={size} height={size} className={`picon ${className}`} />;
  return (
    <span className={`picon picon--letter ${className}`} style={{ ...tint(p), width: size, height: size }} aria-hidden="true">
      {p.name.slice(0, 1)}
    </span>
  );
}

/** Picks the composition: phones fanned out, a window, or a window with a phone in front. */
function compose(p: Project) {
  const shots = shotsOf(p.media!);
  const phones = shots.filter((x) => x.device === "phone");
  const desks = shots.filter((x) => x.device === "desktop");
  const layout = desks.length && phones.length ? "mixed" : desks.length ? "desktop" : "phone";
  return { phones, desks, layout };
}

/** Work-card stage (380 × 262). */
export function StageArt({ p }: { p: Project }) {
  if (!p.media) return <Art name={`stage-${p.slug}`} themed alt="" sizes="400px" />;
  const { phones, desks, layout } = compose(p);
  return (
    <span className={`mstage mstage--${layout}`} style={tint(p)}>
      {layout === "phone" && (
        <>
          {phones[1] && <Shot s={phones[1]} sizes="140px" className="mstage__back" />}
          {phones[0] && <Shot s={phones[0]} sizes="160px" className="mstage__front" />}
        </>
      )}
      {layout !== "phone" && desks[0] && <Shot s={desks[0]} sizes="360px" className="mstage__win" />}
      {layout === "mixed" && <Shot s={phones[0]} sizes="120px" className="mstage__phone" />}
    </span>
  );
}

/** Case-study hero (600 × 430). */
export function HeroArt({ p }: { p: Project }) {
  if (!p.media) {
    return <Art name={`cs-${p.slug}-hero`} alt={`${p.name} product screens`} priority sizes="(max-width: 1024px) 92vw, 600px" />;
  }
  const { phones, desks, layout } = compose(p);
  const fan = phones.slice(0, 3);
  return (
    <span className={`mhero mhero--${layout} mhero--n${fan.length}`} style={tint(p)} role="img" aria-label={`${p.name} product screens`}>
      {layout === "phone" &&
        fan.map((s, i) => <Shot key={s.url} s={s} sizes="(max-width: 1024px) 40vw, 240px" className={`mhero__d mhero__d--${i}`} />)}
      {layout !== "phone" && (
        <>
          <Shot s={desks[0]} sizes="(max-width: 1024px) 80vw, 520px" className="mhero__win" />
        </>
      )}
      {layout === "mixed" && <Shot s={phones[0]} sizes="(max-width: 1024px) 24vw, 160px" className="mhero__phone" />}
    </span>
  );
}

/** Every screenshot, each in its own frame, for the case-study gallery. */
export function GalleryArt({ p }: { p: Project }) {
  if (!p.media) return null;
  const shots = shotsOf(p.media);
  const phones = shots.filter((x) => x.device === "phone");
  const desks = shots.filter((x) => x.device === "desktop");
  const caption = (s: Shot) => p.galleryCaptions[shots.indexOf(s)];
  return (
    <>
      {desks.length > 0 && (
        <div className="mgal mgal--desktop">
          {desks.map((s, i) => (
            <figure key={s.url}>
              <Device src={s.url} device="desktop" w={s.w} h={s.h} crop={s.crop} alt={`${p.name} screen ${i + 1}`} sizes="(max-width: 900px) 92vw, 620px" />
              {caption(s) && <figcaption>{caption(s)}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {phones.length > 0 && (
        <div className="mgal mgal--phone" style={{ "--n": Math.min(phones.length, 4) } as CSSProperties}>
          {phones.map((s, i) => (
            <figure key={s.url}>
              <Device src={s.url} device="phone" w={s.w} h={s.h} crop={s.crop} alt={`${p.name} screen ${i + 1}`} sizes="160px" />
              {caption(s) && <figcaption>{caption(s)}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

/** Finder folder, with the project's icon on a blank folder. */
export function FolderArt({ p }: { p: Project }) {
  if (!p.media) return <Art name={`folder-${p.slug}`} themed alt="" className="folder__art" sizes="96px" />;
  return (
    <span className="folder__art folder__art--custom">
      <Art name="folder-generic" themed alt="" sizes="96px" />
      <ProjectIcon p={p} size={40} className="folder__glyph" />
    </span>
  );
}

/** The two screens and icon that rise out of a folder on hover. */
export function PopArt({ p }: { p: Project }) {
  if (!p.media) {
    return (
      <>
        <Art name={`pop-${p.slug}-l`} alt="" className="pop-l" sizes="70px" />
        <Art name={`pop-${p.slug}-r`} alt="" className="pop-r" sizes="70px" />
        <Art name={`icon-${p.slug}`} themed alt="" className="pop-icon" sizes="44px" />
      </>
    );
  }
  const [a, b] = shotsOf(p.media);
  return (
    <>
      {a && <Shot s={a} sizes="80px" className={`pop-l pop-dev`} />}
      {(b ?? a) && <Shot s={b ?? a} sizes="80px" className={`pop-r pop-dev`} />}
      <ProjectIcon p={p} size={44} className="pop-icon" />
    </>
  );
}

/** The art on the closing card of a case study. */
export function ClosingArt({ p }: { p: Project }) {
  if (!p.media) return <Art name={`cs-${p.slug}-closing`} alt="" className="closing__icons" sizes="320px" />;
  return (
    <span className="closing__icons closing__icons--custom" style={tint(p)} aria-hidden="true">
      <ProjectIcon p={p} size={72} />
    </span>
  );
}
