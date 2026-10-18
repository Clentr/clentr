/** Sends a lead notice from the browser when the server couldn't (see notifyTeam). Never throws. */
export function relayNotice(notice: unknown) {
  const n = notice as { url?: unknown; body?: unknown } | null;
  if (!n || typeof n.url !== "string" || !n.url.startsWith("https://formsubmit.co/ajax/") || typeof n.body !== "object") return;
  fetch(n.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(n.body),
    keepalive: true,
  }).catch(() => {});
}
