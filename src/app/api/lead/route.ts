import type { NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
import { getSite } from "@/lib/content";
import { FORM_ORIGIN } from "@/lib/config";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/**
 * Contact-form submissions: stored for the admin panel and emailed to the studio inbox via
 * FormSubmit. The enquiry counts as received if either one succeeds.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // Bots fill the hidden honeypot; pretend it worked.
  if (clip(body._honey, 10)) return Response.json({ ok: true });
  const lead = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    building: clip(body.building, 200) || "Not specified",
    budget: clip(body.budget, 60) || "Not specified",
    details: clip(body.details, 5000),
  };
  if (!lead.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const db = serviceClient();
  const [stored, emailed] = await Promise.all([
    db
      ? db
          .from("leads")
          .insert({ ...lead, path: clip(body.path, 300), country: req.headers.get("x-vercel-ip-country") })
          .then(({ error }) => !error)
      : false,
    sendEmail(lead),
  ]);
  return Response.json({ ok: stored || emailed, stored, emailed }, { status: stored || emailed ? 200 : 502 });
}

async function sendEmail(lead: Record<string, string>) {
  // Local testing would send FormSubmit activation emails for localhost.
  if (process.env.NODE_ENV !== "production") return false;
  try {
    const to = (await getSite()).content.contact.email;
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...FORM_ORIGIN },
      body: JSON.stringify({ _subject: `New project enquiry — ${lead.building}`, _replyto: lead.email, _template: "table", ...lead }),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    if (!res.ok || String(json.success) === "false") {
      console.warn("[lead] FormSubmit did not send:", json.message ?? res.status);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[lead] FormSubmit error:", e);
    return false;
  }
}
