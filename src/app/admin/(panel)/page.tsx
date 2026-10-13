import Link from "next/link";
import {
  Activity, ArrowRight, CalendarCheck, Eye, FolderOpen, Globe, Inbox, Laptop, MousePointerClick, PhoneCall, Sparkles, Target, Users,
} from "lucide-react";
import { ProjectIcon } from "@/components/work/ProjectArt";
import { config } from "@/lib/config";
import { dashboard } from "@/lib/analytics";
import { getProjects } from "@/lib/projects";
import { requireAdmin } from "@/lib/supabase/auth";
import { Card, Donut, Empty, Funnel, Kpi, PageHead, Ranked, ago, flag } from "../_ui/kit";
import { TrafficChart } from "../_ui/TrafficChart";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Dashboard" };

const RANGES = [
  { d: 7, label: "7 days" },
  { d: 30, label: "30 days" },
  { d: 90, label: "90 days" },
];

const cap = (s: string) => s.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());

function greeting() {
  const h = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const user = await requireAdmin();
  const q = await searchParams;
  const days = RANGES.some((r) => r.d === Number(q.range)) ? Number(q.range) : 30;
  const [d, projects] = await Promise.all([dashboard(days), getProjects()]);
  if (!d) return <Empty text="SUPABASE_SERVICE_ROLE_KEY is missing — see Settings." />;

  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const name = (user.email ?? "").split("@")[0].split(/[._-]/)[0];
  const trend = (k: "views" | "visitors" | "clicks") => d.series.map((s) => s[k]);
  const devices = Object.fromEntries(d.devices);

  return (
    <>
      <PageHead
        title={`${greeting()}, ${name.charAt(0).toUpperCase()}${name.slice(1)}`}
        sub={`Here’s how clentr.com did over the last ${days} days, compared with the ${days} before.`}
      >
        <nav className="ad-seg" aria-label="Date range">
          {RANGES.map((r) => (
            <Link key={r.d} href={`/admin?range=${r.d}`} aria-current={r.d === days ? "true" : undefined}>
              {r.label}
            </Link>
          ))}
        </nav>
      </PageHead>

      <div className="ad-kpis">
        <Kpi label="Visitors" icon={Users} value={d.kpis.visitors.value} delta={d.kpis.visitors.delta} trend={trend("visitors")} hint="Unique browser sessions" />
        <Kpi label="Page views" icon={Eye} value={d.kpis.views.value} delta={d.kpis.views.delta} trend={trend("views")} hint="Every page opened" />
        <Kpi label="“Book a call” clicks" icon={PhoneCall} value={d.kpis.bookClicks.value} delta={d.kpis.bookClicks.delta} trend={trend("clicks")} hint="Across all buttons" />
        <Kpi label="Conversions" icon={Target} value={d.kpis.conversions.value} delta={d.kpis.conversions.delta} trend={trend("clicks")} hint={`${d.split.bookings} calls booked · ${d.split.leads} messages`} />
      </div>

      <div className="ad-grid ad-grid--main">
        <Card
          title="Traffic"
          icon={Activity}
          action={
            <span className="ad-legend">
              <i className="v" /> Page views <i className="u" /> Visitors
            </span>
          }
        >
          <TrafficChart series={d.series} />
        </Card>
        <Card title="Conversion funnel" icon={Target}>
          <Funnel steps={d.funnel} />
        </Card>
      </div>

      <div className="ad-grid ad-grid--3">
        <Card title="Projects opened" icon={FolderOpen}>
          <Ranked
            rows={d.projects}
            lead={(slug) => (bySlug.get(slug) ? <ProjectIcon p={bySlug.get(slug)!} size={22} /> : <span className="ad-dot" />)}
            format={(slug) => bySlug.get(slug)?.name ?? cap(slug)}
          />
        </Card>
        <Card title="Which “Book a call”" icon={PhoneCall}>
          <Ranked rows={d.buttons} format={cap} empty={config.calLink ? "No clicks yet in this period." : "Cal.com isn’t linked yet."} />
        </Card>
        <Card title="Where visitors come from" icon={Globe}>
          <Ranked rows={d.sources} format={(s) => (s === "Direct" ? "Direct / typed in" : s.replace(/^www\./, ""))} />
        </Card>
        <Card title="Countries" icon={Globe}>
          <Ranked
            rows={d.countries}
            lead={(c) => <span className="ad-flag">{flag(c)}</span>}
            format={(c) => {
              try {
                return c === "??" ? "Unknown" : (new Intl.DisplayNames(["en"], { type: "region" }).of(c) ?? c);
              } catch {
                return c;
              }
            }}
          />
        </Card>
        <Card title="Devices" icon={Laptop}>
          <Donut
            parts={[
              { label: "Desktop", value: devices.desktop ?? 0, color: "var(--accent)" },
              { label: "Mobile", value: devices.mobile ?? 0, color: "#22c55e" },
              { label: "Tablet", value: devices.tablet ?? 0, color: "#f59e0b" },
            ]}
          />
        </Card>
        <Card title="Top pages" icon={Eye}>
          <Ranked rows={d.pages} format={(p) => (p === "/" ? "Home" : p)} />
        </Card>
      </div>

      <div className="ad-grid ad-grid--split">
        <Card
          title="New leads"
          icon={Inbox}
          action={
            <Link href="/admin/leads" className="ad-link">
              Open inbox <ArrowRight />
            </Link>
          }
        >
          {d.newLeads.length ? (
            <ul className="ad-people">
              {d.newLeads.map((l) => (
                <li key={l.id}>
                  <span className="ad-avatar">{l.name.slice(0, 1).toUpperCase()}</span>
                  <span className="ad-people__who">
                    <Link href={`/admin/leads?id=${l.id}`}>
                      <b>{l.name}</b>
                    </Link>
                    <small>{[l.building, l.budget].filter(Boolean).join(" · ") || l.email}</small>
                  </span>
                  <time>{ago(l.created_at)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={Inbox} text="No new leads — you’re all caught up." />
          )}
        </Card>
        <Card title="Recent activity" icon={Sparkles}>
          {d.activity.length ? (
            <ol className="ad-timeline">
              {d.activity.map((a, i) => (
                <li key={i} className={`ad-timeline__${a.kind}`}>
                  <span className="ad-timeline__icon">
                    {a.kind === "lead" ? <Inbox /> : a.kind === "booking" ? <CalendarCheck /> : <MousePointerClick />}
                  </span>
                  <span>
                    {a.kind === "lead" && (
                      <>
                        <b>{a.title}</b> sent the contact form <small>· {a.sub}</small>
                      </>
                    )}
                    {a.kind === "booking" && (
                      <>
                        <b>{a.title}</b> booked a call
                      </>
                    )}
                    {a.kind === "click" &&
                      (a.title.startsWith("project:") ? (
                        <>
                          Someone opened <b>{bySlug.get(a.title.slice(8))?.name ?? cap(a.title.slice(8))}</b>
                        </>
                      ) : (
                        <>
                          Someone clicked <b>Book a call</b> <small>· {cap(a.title.slice(10))}</small>
                        </>
                      ))}
                  </span>
                  <time>{ago(a.at)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <Empty icon={Sparkles} text="Activity shows up here as visitors use the site." />
          )}
        </Card>
      </div>
    </>
  );
}
