"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";

const WAIT_MS = 5000;

/**
 * Visitors from the Instagram link (clentr.com/free → /?r=free) meet the brand first: once the logo
 * intro has played, a small card counts down five seconds and then opens the resource library.
 * They can go straight away or stay on the home page. Everyone else never sees it.
 */
export function ResourceHandoff() {
  const router = useRouter();
  const [phase, setPhase] = useState<"off" | "on" | "leaving">("off");
  const timer = useRef(0);
  const invited = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("r") === "free") {
      invited.current = true;
      // Tidy the address bar; a refresh or a shared link then shows the plain home page.
      params.delete("r");
      history.replaceState(history.state, "", `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`);
    }
    if (!invited.current) return;
    router.prefetch("/resources");

    const root = document.documentElement;
    let wait = 0;
    const show = () => {
      if (root.dataset.intro) {
        wait = window.setTimeout(show, 150); // still playing the logo intro
        return;
      }
      setPhase("on");
    };
    wait = window.setTimeout(show, 400);
    return () => clearTimeout(wait);
  }, [router]);

  useEffect(() => {
    if (phase !== "on") return;
    let left = WAIT_MS;
    let started = performance.now();
    const arm = () => {
      started = performance.now();
      timer.current = window.setTimeout(go, left);
    };
    // Pause while the tab is in the background, so nobody misses it.
    const onVis = () => {
      if (document.hidden) {
        clearTimeout(timer.current);
        left = Math.max(0, left - (performance.now() - started));
      } else arm();
    };
    arm();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function go() {
    clearTimeout(timer.current);
    setPhase("leaving");
    document.documentElement.classList.add("is-handoff");
    window.setTimeout(() => {
      router.push("/resources");
      window.setTimeout(() => document.documentElement.classList.remove("is-handoff"), 400);
    }, 320);
  }

  function stay() {
    clearTimeout(timer.current);
    setPhase("off");
  }

  if (phase === "off") return null;
  return (
    <aside className={`handoff ${phase === "leaving" ? "is-leaving" : ""}`} role="status" aria-live="polite">
      <span className="handoff__icon" aria-hidden="true">
        <Icon name="book-open" />
      </span>
      <div className="handoff__text">
        <b>Your free resources are ready</b>
        <small>Opening the library in a moment…</small>
        <span className="handoff__bar" aria-hidden="true">
          <i style={{ animationDuration: `${WAIT_MS}ms` }} />
        </span>
      </div>
      <div className="handoff__actions">
        <button type="button" className="btn btn--ink btn--xs" onClick={go} data-track="resource_handoff:open">
          Open now
          <Icon name="arrow-right" className="arrow" />
        </button>
        <button type="button" className="handoff__stay" onClick={stay} data-track="resource_handoff:stay">
          Stay here
        </button>
      </div>
    </aside>
  );
}
