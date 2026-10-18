import { FORM_ORIGIN } from "./config";

/** Who hears about every new lead. LEAD_EMAILS (comma-separated) overrides it; the first address is the main one. */
export function leadEmails() {
  const list = (process.env.LEAD_EMAILS || "dineshkotipalli@clentr.com,shaikazad@clentr.com,maddy@clentr.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list;
}

/**
 * Emails the team about a new lead through FormSubmit: sent to the first address, copied to the rest.
 * FormSubmit asks the first address to activate the form once, from an email it sends there.
 */
export async function notifyTeam(tag: string, subject: string, replyTo: string, rows: Record<string, string>) {
  // Local testing would send FormSubmit activation emails for localhost.
  if (process.env.NODE_ENV !== "production") return false;
  const [to, ...cc] = leadEmails();
  if (!to) return false;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...FORM_ORIGIN },
      body: JSON.stringify({ _subject: subject, _replyto: replyTo, _template: "table", ...(cc.length ? { _cc: cc.join(",") } : {}), ...rows, "Open in Leads": "https://www.clentr.com/admin/leads" }),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    if (!res.ok || String(json.success) === "false") {
      console.warn(`[${tag}] FormSubmit did not send:`, json.message ?? res.status);
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`[${tag}] FormSubmit error:`, e);
    return false;
  }
}
