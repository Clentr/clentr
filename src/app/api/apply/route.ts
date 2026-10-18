import type { NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
import { notifyTeam } from "@/lib/notify";
import { instagramHandle, LABELS, LIMITS, packApplication, phoneValid, type Application } from "@/content/apply";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/**
 * "Request a call" applications: stored with the leads for the admin panel and emailed to the
 * team. Nobody gets the booking link until the team has read the answers.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (clip(body._honey, 10)) return Response.json({ ok: true });

  const a = Object.fromEntries(Object.entries(LIMITS).map(([k, n]) => [k, clip(body[k], n)])) as Application;
  if (a.instagram) a.instagram = instagramHandle(a.instagram) || a.instagram;
  const missing = (Object.keys(LIMITS) as (keyof Application)[]).filter((k) => k !== "extra" && k !== "instagram" && !a[k]);
  if (missing.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email) || !phoneValid(a.phone))
    return Response.json({ ok: false, error: "invalid", missing }, { status: 400 });

  const db = serviceClient();
  const [stored, emailed] = await Promise.all([
    db
      ? db
          .from("leads")
          .insert({
            name: a.name,
            email: a.email,
            building: a.idea.slice(0, 200),
            budget: a.budget,
            details: packApplication(a),
            path: "/apply",
            country: req.headers.get("x-vercel-ip-country"),
          })
          .then(({ error }) => !error)
      : false,
    notifyTeam(
      "apply",
      `Call request — ${a.name} · ${a.budget}`,
      a.email,
      Object.fromEntries((Object.keys(LABELS) as (keyof Application)[]).map((k) => [LABELS[k], a[k] || "—"])),
    ),
  ]);
  return Response.json({ ok: stored || emailed, stored, emailed }, { status: stored || emailed ? 200 : 502 });
}
