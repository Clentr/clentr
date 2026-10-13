import type { CSSProperties } from "react";
import Image from "next/image";
import {
  ArrowUp, Check, ClipboardList, Fingerprint, Keyboard, MessageSquare, MousePointer2, ScanLine, Settings2,
  Sparkles, TrendingUp, Wifi, WifiOff, Workflow,
} from "lucide-react";
import { Mark } from "../ui/Logo";

/*
 * Looping illustrations for the eight service cards. Built in code so they follow the theme and
 * stay sharp; they only animate while the card is on screen. Figures are illustrative.
 */

const v = (o: Record<string, string | number>) => o as CSSProperties;

function Mobile() {
  const apps = ["episode", "c24-cardio", "between-us", "resumemint"];
  return (
    <div className="ss ss-mobile">
      <div className="ss-phone">
        {apps.map((a, k) => (
          <Image
            key={a}
            src={`/f/cs-${a}-g1.webp`}
            alt=""
            width={350}
            height={644}
            sizes="120px"
            style={v({ "--k": k })}
          />
        ))}
      </div>
      <span className="ss-tag ss-tag--l">
        <Fingerprint />
        Face ID
      </span>
      <span className="ss-tag ss-tag--r">
        <WifiOff />
        Works offline
      </span>
      <span className="ss-tag ss-tag--b">
        <Check />
        Shipped
      </span>
    </div>
  );
}

function Web() {
  const bars = [42, 58, 50, 66, 48, 72, 64, 88];
  return (
    <div className="ss ss-web">
      <div className="ss-browser">
        <div className="ss-browser__bar">
          <i />
          <i />
          <i />
          <span>app.yourproduct.com</span>
        </div>
        <div className="ss-browser__body">
          <small>Revenue</small>
          <div className="ss-web__row">
            <b className="ss-count">$12.4k</b>
            <span className="ss-up">
              <TrendingUp />
              +8%
            </span>
          </div>
          <div className="ss-bars">
            {bars.map((h, k) => (
              <i key={k} style={v({ "--h": `${h}%`, "--k": k })} />
            ))}
          </div>
        </div>
      </div>
      <MousePointer2 className="ss-cursor ss-cursor--web" />
    </div>
  );
}

function Ai() {
  return (
    <div className="ss ss-ai">
      <p className="ss-ai__q">Summarise this week’s customer feedback.</p>
      <div className="ss-ai__a">
        <span className="ss-ai__who">
          <Sparkles />
        </span>
        <span className="ss-ai__lines">
          <i style={v({ "--w": "92%", "--k": 0 })} />
          <i style={v({ "--w": "78%", "--k": 1 })} />
          <i style={v({ "--w": "56%", "--k": 2 })} />
        </span>
      </div>
      <div className="ss-ai__json">
        <span>
          <em>themes</em> 3
        </span>
        <span>
          <em>checkout</em> 14
        </span>
        <span>
          <em>dark_mode</em> 9
        </span>
      </div>
      <div className="ss-ai__input">
        <Sparkles />
        Ask anything…
        <span>
          <ArrowUp />
        </span>
      </div>
    </div>
  );
}

function Vision() {
  return (
    <div className="ss ss-vision">
      <div className="ss-feed">
        <span className="ss-feed__rec">
          <i />
          CAM 2
        </span>
        <span className="ss-shelf ss-shelf--1" />
        <span className="ss-shelf ss-shelf--2" />
        <span className="ss-obj ss-obj--person">
          <i />
        </span>
        <span className="ss-obj ss-obj--bag" />
        <span className="ss-obj ss-obj--box" />
        <span className="ss-box ss-box--a">
          <em>person 0.97</em>
        </span>
        <span className="ss-box ss-box--b">
          <em>bag 0.88</em>
        </span>
        <span className="ss-box ss-box--c">
          <em>parcel 0.91</em>
        </span>
        <span className="ss-scanline">
          <ScanLine />
        </span>
      </div>
    </div>
  );
}

function Desktop() {
  const items = [
    [ScanLine, "Summarise screen", "⌘S"],
    [ClipboardList, "Clipboard history", "⌘⇧V"],
    [MessageSquare, "Ask this window", "⌘↵"],
    [Settings2, "Preferences…", "⌘,"],
  ] as const;
  return (
    <div className="ss ss-desk">
      <div className="ss-menubar">
        <Mark className="ss-menubar__logo" />
        <b>Edith</b>
        <span className="ss-menubar__icons">
          <Sparkles className="ss-menubar__on" />
          <Wifi />
          <Keyboard />
        </span>
      </div>
      <div className="ss-menu">
        <span className="ss-menu__hl" />
        {items.map(([I, t, k]) => (
          <span key={t} className="ss-menu__item">
            <I />
            {t}
            <kbd>{k}</kbd>
          </span>
        ))}
      </div>
    </div>
  );
}

function Backend() {
  const lines = [
    ["$ deploy api --env production", "cmd"],
    ["build container ······ 42s", "dim"],
    ["✓ 3 services healthy", "ok"],
    ["✓ migrations applied", "ok"],
    ["→ p95 128 ms · 0 errors", "acc"],
  ];
  return (
    <div className="ss ss-term">
      <div className="ss-term__bar">
        <i />
        <i />
        <i />
        <span>production</span>
        <em className="ss-term__live">
          <i />
          live
        </em>
      </div>
      <div className="ss-term__body">
        {lines.map(([t, c], k) => (
          <p key={t} className={`ss-term__l ss-term__l--${c}`} style={v({ "--k": k })}>
            {t}
          </p>
        ))}
        <span className="ss-term__caret" />
      </div>
    </div>
  );
}

/** Sketch → prototype → MVP: the same screen firms up, stage by stage. */
function Mvp() {
  return (
    <div className="ss ss-mvp">
      <div className="ss-mvp__stages">
        {["Sketch", "Prototype", "MVP"].map((t, k) => (
          <span key={t} style={v({ "--k": k })}>
            {t}
          </span>
        ))}
      </div>
      <div className="ss-mvp__phone">
        <i className="ss-mvp__hero" />
        <i />
        <i />
        <i className="ss-mvp__short" />
        <b className="ss-mvp__btn">Get started</b>
      </div>
      <span className="ss-mvp__live">
        <i /> Live in week 8
      </span>
    </div>
  );
}

/** A hub with the services clients rely on; requests flow along each line. */
function Integrations() {
  const nodes: [string, number, number][] = [
    ["Stripe", 54, 42],
    ["CRM", 210, 42],
    ["WhatsApp", 54, 142],
    ["Maps", 210, 142],
  ];
  return (
    <div className="ss ss-int">
      <svg className="ss-int__lines" viewBox="0 0 264 200" aria-hidden="true">
        {nodes.map(([t, x, y], k) => (
          <g key={t}>
            <line x1="132" y1="92" x2={x} y2={y} className="ss-int__track" />
            <line x1="132" y1="92" x2={x} y2={y} className="ss-int__flow" style={v({ "--k": k })} />
          </g>
        ))}
      </svg>
      <span className="ss-int__hub">
        <Workflow />
      </span>
      {nodes.map(([t, x, y], k) => (
        <span key={t} className="ss-int__node" style={v({ "--x": `${(x / 264) * 100}%`, "--y": `${(y / 200) * 100}%`, "--k": k })}>
          <i />
          {t}
        </span>
      ))}
      <span className="ss-int__ok">
        <i /> 1,284 webhooks · 0 failed
      </span>
    </div>
  );
}

export const SERVICE_SCENES = {
  "mobile-apps": Mobile,
  "web-platforms": Web,
  "applied-ai": Ai,
  "computer-vision": Vision,
  "desktop-native": Desktop,
  "backend-cloud": Backend,
  "mvp-prototypes": Mvp,
  integrations: Integrations,
} as const;
