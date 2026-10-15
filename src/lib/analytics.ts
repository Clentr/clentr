import "server-only";
import { serviceClient } from "./supabase/service";

export type LeadStatus = "new" | "contacted" | "won" | "archived";
export type Lead = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  building: string | null;
  budget: string | null;
  details: string | null;
  country: string | null;
  path: string | null;
  status: LeadStatus;
  notes: string | null;
};
export type Booking = {
  id: number;
  created_at: string;
  uid: string;
  status: string;
  name: string | null;
  email: string | null;
  start_time: string | null;
  end_time: string | null;
  title: string | null;
  notes: string | null;
};
type Event = { created_at: string; type: string; label: string | null; path: string; referrer: string | null; country: string | null; device: string | null; session: string | null };

const DAY = 864e5;
const top = (items: (string | null | undefined)[], n = 8) => {
  const m = new Map<string, number>();
  for (const i of items) if (i) m.set(i, (m.get(i) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
};
const pct = (now: number, before: number) => (before === 0 ? (now > 0 ? null : 0) : Math.round(((now - before) / before) * 100));

async function eventsSince(since: string) {
  const db = serviceClient()!;
  const out: Event[] = [];
  // PostgREST returns at most 1,000 rows per request.
  for (let from = 0; from < 100_000; from += 1000) {
    const { data, error } = await db
      .from("events")
      .select("created_at, type, label, path, referrer, country, device, session")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    out.push(...(data as Event[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

function summarise(events: Event[], leads: number, bookings: number) {
  const views = events.filter((e) => e.type === "page_view");
  const clicks = events.filter((e) => e.type === "click");
  const visitors = new Set(views.map((e) => e.session).filter(Boolean));
  const engaged = new Set(clicks.map((e) => e.session).filter(Boolean));
  const bookers = new Set(clicks.filter((e) => e.label?.startsWith("book_call")).map((e) => e.session).filter(Boolean));
  return {
    views: views.length,
    visitors: visitors.size,
    engaged: engaged.size,
    bookClicks: clicks.filter((e) => e.label?.startsWith("book_call")).length,
    bookers: bookers.size,
    conversions: leads + bookings,
    leads,
    bookings,
  };
}

/** Everything the dashboard shows for the last `days` days, compared with the `days` before. */
export async function dashboard(days: number) {
  const db = serviceClient();
  if (!db) return null;
  const now = Date.now();
  const since = new Date(now - days * DAY).toISOString();
  const prevSince = new Date(now - 2 * days * DAY).toISOString();

  const [all, { data: leadRows }, { data: bookingRows }] = await Promise.all([
    eventsSince(prevSince),
    db.from("leads").select("*").gte("created_at", prevSince).order("created_at", { ascending: false }).limit(500),
    db.from("bookings").select("*").gte("created_at", prevSince).order("created_at", { ascending: false }).limit(500),
  ]);
  const leadsAll = (leadRows ?? []) as Lead[];
  const bookingsAll = ((bookingRows ?? []) as Booking[]).filter((b) => b.status !== "cancelled");
  const cur = all.filter((e) => e.created_at >= since);
  const prev = all.filter((e) => e.created_at < since);
  const curLeads = leadsAll.filter((l) => l.created_at >= since);
  const curBookings = bookingsAll.filter((b) => b.created_at >= since);

  const a = summarise(cur, curLeads.length, curBookings.length);
  const b = summarise(prev, leadsAll.length - curLeads.length, bookingsAll.length - curBookings.length);

  // Daily series, oldest first, in the visitor's calendar days (UTC).
  const series = Array.from({ length: days }, (_, i) => ({
    d: new Date(now - (days - 1 - i) * DAY).toISOString().slice(0, 10),
    views: 0,
    visitors: 0,
    clicks: 0,
  }));
  const idx = new Map(series.map((s, i) => [s.d, i]));
  const seen = series.map(() => new Set<string>());
  for (const e of cur) {
    const i = idx.get(e.created_at.slice(0, 10));
    if (i === undefined) continue;
    if (e.type === "page_view") {
      series[i].views++;
      if (e.session) seen[i].add(e.session);
    } else series[i].clicks++;
  }
  seen.forEach((s, i) => (series[i].visitors = s.size));

  const views = cur.filter((e) => e.type === "page_view");
  const clicks = cur.filter((e) => e.type === "click");

  return {
    kpis: {
      visitors: { value: a.visitors, delta: pct(a.visitors, b.visitors) },
      views: { value: a.views, delta: pct(a.views, b.views) },
      bookClicks: { value: a.bookClicks, delta: pct(a.bookClicks, b.bookClicks) },
      conversions: { value: a.conversions, delta: pct(a.conversions, b.conversions) },
    },
    funnel: [
      { label: "Visitors", value: a.visitors },
      { label: "Clicked something", value: a.engaged },
      { label: "Clicked “Request a call”", value: a.bookers },
      { label: "Booked or wrote in", value: a.conversions },
    ],
    split: { leads: a.leads, bookings: a.bookings },
    series,
    projects: top(clicks.filter((e) => e.label?.startsWith("project:")).map((e) => e.label!.slice(8))),
    buttons: top(clicks.filter((e) => e.label?.startsWith("book_call:")).map((e) => e.label!.slice(10))),
    clicks: top(clicks.map((e) => e.label), 10),
    pages: top(views.map((e) => e.path.replace(/#.*$/, "") || "/")),
    sources: top(views.map((e) => e.referrer ?? "Direct")),
    countries: top(views.map((e) => e.country ?? "??")),
    devices: top(views.map((e) => e.device), 3),
    activity: [
      ...curLeads.slice(0, 12).map((l) => ({ kind: "lead" as const, at: l.created_at, title: l.name, sub: l.building ?? "Contact form", id: l.id })),
      ...curBookings.slice(0, 12).map((x) => ({ kind: "booking" as const, at: x.created_at, title: x.name ?? "Someone", sub: x.start_time ?? "", id: x.id })),
      ...clicks
        .filter((e) => e.label?.startsWith("book_call") || e.label?.startsWith("project:"))
        .slice(0, 16)
        .map((e) => ({ kind: "click" as const, at: e.created_at, title: e.label!, sub: `${e.device ?? ""} · ${e.country ?? ""}`, id: 0 })),
    ]
      .sort((x, y) => y.at.localeCompare(x.at))
      .slice(0, 14),
    newLeads: curLeads.filter((l) => l.status === "new").slice(0, 5),
  };
}

export async function leads() {
  const { data } = (await serviceClient()?.from("leads").select("*").order("created_at", { ascending: false }).limit(1000)) ?? {};
  return (data ?? []) as Lead[];
}

export async function bookings() {
  const { data } = (await serviceClient()?.from("bookings").select("*").order("start_time", { ascending: false }).limit(1000)) ?? {};
  return (data ?? []) as Booking[];
}

export async function newLeadCount() {
  const { count } = (await serviceClient()?.from("leads").select("id", { count: "exact", head: true }).eq("status", "new")) ?? {};
  return count ?? 0;
}
