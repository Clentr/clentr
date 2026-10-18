import { FORM_ORIGIN } from "./config";

/** Who hears about every new lead. LEAD_EMAILS (comma-separated) overrides it; the first address is the main one. */
export function leadEmails() {
  return (process.env.LEAD_EMAILS || "dineshkotipalli@clentr.com,shaikazad@clentr.com,maddy@clentr.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** A ready-to-send FormSubmit request: to the first address, copied to the rest. */
export type Notice = { url: string; body: Record<string, string> };

export function buildNotice(subject: string, replyTo: string, rows: Record<string, string>): Notice | null {
  // Local testing would send FormSubmit activation emails for localhost.
  if (process.env.NODE_ENV !== "production") return null;
  const [to, ...cc] = leadEmails();
  if (!to) return null;
  return {
    url: `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    body: {
      _subject: subject,
      _replyto: replyTo,
      _template: "table",
      ...(cc.length ? { _cc: cc.join(",") } : {}),
      ...rows,
      "Open in Leads": "https://www.clentr.com/admin/leads",
    },
  };
}

/**
 * Tries to email the team from the server. FormSubmit often turns away requests from cloud
 * servers, so when this fails the route hands the notice to the visitor's browser to send.
 * FormSubmit asks the first address to activate the form once, from an email it sends there.
 */
export async function notifyTeam(tag: string, notice: Notice | null) {
  if (!notice) return false;
  try {
    const res = await fetch(notice.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...FORM_ORIGIN },
      body: JSON.stringify(notice.body),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    if (!res.ok || String(json.success) !== "true") {
      console.warn(`[${tag}] FormSubmit did not send:`, res.status, json.message ?? "");
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`[${tag}] FormSubmit error:`, e);
    return false;
  }
}
