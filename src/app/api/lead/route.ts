import type { NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
import { buildNotice, notifyTeam } from "@/lib/notify";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/**
 * Contact-form submissions: stored for the admin panel and emailed to the team via
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

  const notice = buildNotice(`New project enquiry — ${lead.building}`, lead.email, lead);
  const db = serviceClient();
  const [stored, emailed] = await Promise.all([
    db
      ? db
          .from("leads")
          .insert({ ...lead, path: clip(body.path, 300), country: req.headers.get("x-vercel-ip-country") })
          .then(({ error }) => !error)
      : false,
    notifyTeam("lead", notice),
  ]);
  // If the server couldn't email the team, the browser sends the same notice.
  return Response.json({ ok: stored || emailed, stored, emailed, ...(emailed ? {} : { notice }) }, { status: stored || emailed ? 200 : 502 });
}
