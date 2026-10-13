import { userAgent, type NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : null);

/** Anonymous page views and clicks from the site. No cookies, no personal data. */
export async function POST(req: NextRequest) {
  const db = serviceClient();
  if (!db) return new Response(null, { status: 204 });
  const ua = userAgent(req);
  if (ua.isBot) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const type = body.type === "click" ? "click" : body.type === "page_view" ? "page_view" : null;
  const path = clip(body.path, 300);
  if (!type || !path || path.startsWith("/admin")) return new Response(null, { status: 204 });

  const device = ua.device.type === "mobile" ? "mobile" : ua.device.type === "tablet" ? "tablet" : "desktop";
  let referrer = clip(body.referrer, 300);
  try {
    // Keep only the referring site, and drop our own domain.
    const host = referrer ? new URL(referrer).hostname : null;
    referrer = host && host !== req.nextUrl.hostname ? host : null;
  } catch {
    referrer = null;
  }

  await db.from("events").insert({
    type,
    label: clip(body.label, 120),
    path,
    referrer,
    country: req.headers.get("x-vercel-ip-country"),
    device,
    session: clip(body.session, 40),
  });
  return new Response(null, { status: 204 });
}
