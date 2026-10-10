"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./Icon";

type Mode = "light" | "dark" | "system";

const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const read = (): Mode => {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
};

export function applyTheme(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function ThemeSwitch() {
  const mode = useSyncExternalStore(subscribe, read, () => "system" as Mode);
  const set = (m: Mode) => {
    try {
      if (m === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", m);
    } catch {
      /* storage blocked — still apply for this visit */
    }
    applyTheme(m);
    window.dispatchEvent(new Event("themechange"));
  };
  const opts: [Mode, string, string][] = [
    ["light", "sun", "Light theme"],
    ["dark", "moon", "Dark theme"],
    ["system", "monitor", "Match system"],
  ];
  return (
    <div className="theme-switch" role="group" aria-label="Theme">
      {opts.map(([m, icon, label]) => (
        <button key={m} type="button" aria-pressed={mode === m} aria-label={label} title={label} onClick={() => set(m)}>
          <Icon name={icon} />
        </button>
      ))}
    </div>
  );
}
