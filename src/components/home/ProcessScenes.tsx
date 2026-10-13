import type { CSSProperties } from "react";
import Image from "next/image";
import { Check, CircleAlert, GitCommitHorizontal, Inbox, Loader, RotateCw, Smartphone, X } from "lucide-react";

/*
 * The artefact each stage actually produces, drawn in code. Animations replay when a stage opens.
 * Notes, commits and figures are illustrative.
 */

const v = (o: Record<string, string | number>) => o as CSSProperties;

/** Week 1 — the wall of sticky notes, and the one problem worth solving circled by hand. */
function Discover() {
  const notes = [
    { t: "Who opens this at 7 am?", c: "#fde68a", x: 6, y: 8, r: -4 },
    { t: "Works on the metro — offline", c: "#bfdbfe", x: 52, y: 4, r: 3 },
    { t: "Payments: UPI first, cards later", c: "#fbcfe8", x: 4, y: 37, r: 2 },
    { t: "Staff re-type every order twice", c: "#fde68a", x: 50, y: 34, r: -3, key: true },
    { t: "v1 = 3 screens, not 12", c: "#bbf7d0", x: 18, y: 64, r: -2 },
  ];
  return (
    <div className="ps ps-discover">
      {notes.map((n, k) => (
        <span
          key={n.t}
          className={`ps-note ${n.key ? "ps-note--key" : ""}`}
          style={v({ "--c": n.c, left: `${n.x}%`, top: `${n.y}%`, "--r": `${n.r}deg`, "--k": k })}
        >
          {n.t}
          {n.key && (
            <svg className="ps-circle" viewBox="0 0 120 80" preserveAspectRatio="none" aria-hidden="true">
              <path d="M62 6C30 4 6 16 7 40c1 24 30 34 60 33 30-1 48-16 46-36C111 16 86 5 55 9" />
            </svg>
          )}
        </span>
      ))}
      <span className="ps-pin-label">The real problem</span>
    </div>
  );
}

/** Weeks 1–3 — a wireframe firms up into the interface, then every state gets drawn. */
function Design() {
  // States written for the app on screen (Episode), shown as iOS-style banners over the real UI.
  const states = [
    { k: "Empty", icon: Inbox, t: "No entries yet", s: "Write tonight’s episode" },
    { k: "Loading", icon: Loader, t: "Writing your episode…", s: "Usually 5 seconds" },
    { k: "Error", icon: CircleAlert, t: "You’re offline", s: "Saved — we’ll sync later" },
    { k: "Success", icon: Check, t: "Episode 5 is ready", s: "Your poster is done" },
  ];
  return (
    <div className="ps ps-design">
      <div className="ps-device">
        <span className="ps-device__island" />
        {/* The sketch is redrawn as the real product: a shipped screen wipes in over the wireframe. */}
        <span className="ps-real" aria-hidden="true">
          <Image src="/screens/ep-7.webp" alt="" fill sizes="160px" />
        </span>
        <span className="ps-pen" aria-hidden="true" />
        <div className="ps-wire">
          <i className="ps-wire__hero" />
          <i />
          <i />
          <i className="ps-wire__short" />
        </div>
        <div className="ps-states">
          {states.map(({ k, icon: I, t, s }, n) => (
            <div key={k} className={`ps-state ps-state--${k.toLowerCase()}`} style={v({ "--k": n })}>
              <span className="ps-state__icon">
                <I />
              </span>
              <b>{t}</b>
              {s && <small>{s}</small>}
            </div>
          ))}
        </div>
      </div>
      <div className="ps-tabs">
        {states.map((s, n) => (
          <span key={s.k} style={v({ "--k": n })}>
            {s.k}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Weeks 3–8 — small commits, each one checked before it lands. */
function Build() {
  const commits = [
    ["feat", "order list + offline cache"],
    ["test", "refund edge cases"],
    ["fix", "retry when sync drops"],
    ["feat", "staff PIN sign-in"],
    ["chore", "build 14 → TestFlight"],
  ];
  return (
    <div className="ps ps-build">
      <div className="ps-git">
        <span className="ps-git__line" />
        {commits.map(([type, msg], k) => (
          <div key={msg} className="ps-commit" style={v({ "--k": k })}>
            <span className="ps-commit__dot">
              <GitCommitHorizontal />
            </span>
            <span className="ps-commit__msg">
              <em className={`ps-type ps-type--${type}`}>{type}</em>
              {msg}
            </span>
            <span className="ps-check">
              <Loader className="ps-check__run" />
              <Check className="ps-check__ok" />
            </span>
          </div>
        ))}
      </div>
      <div className="ps-cov">
        <span>Test coverage</span>
        <b>
          <i />
        </b>
        <em>86%</em>
      </div>
    </div>
  );
}

/** Week 8+ — live. A spike is caught, a fix ships, the line settles. */
function Launch() {
  return (
    <div className="ps ps-launch">
      <div className="ps-store">
        <span className="ps-store__icon">
          <Smartphone />
        </span>
        <span>
          <b>v1.0</b>
          <small className="ps-store__status">
            <i />
            <span className="ps-flip">
              <span>In review</span>
              <span>Ready for sale</span>
            </span>
          </small>
        </span>
      </div>
      <div className="ps-mon">
        <div className="ps-mon__head">
          <small>Errors / min</small>
          <span className="ps-uptime">99.98% uptime</span>
        </div>
        <svg className="ps-mon__chart" viewBox="0 0 240 110" preserveAspectRatio="none" aria-hidden="true">
          <path className="ps-mon__grid" d="M0 27H240M0 55H240M0 83H240" />
          <path
            className="ps-mon__line"
            d="M0 92 L20 90 L40 93 L60 89 L80 91 L96 88 L108 30 L118 22 L128 60 L140 86 L160 90 L180 92 L200 91 L220 93 L240 92"
          />
        </svg>
        <span className="ps-alert">
          <CircleAlert />
          Spike on checkout
        </span>
        <span className="ps-hotfix">
          <RotateCw />
          v1.0.1 hotfix · 18 min
        </span>
      </div>
      <div className="ps-iter">
        {["Crash on Android 12", "Slow first load"].map((t, k) => (
          <span key={t} style={v({ "--k": k })}>
            <X className="ps-iter__x" />
            <Check className="ps-iter__ok" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export const PROCESS_SCENES = [Discover, Design, Build, Launch];
