import type { ReactNode } from "react";
import { CalendarCheck, CheckCircle2, CircleAlert, Database, Mail, ShieldCheck, Webhook } from "lucide-react";
import { adminEmails, config, hasSupabase } from "@/lib/config";
import { getSite } from "@/lib/content";
import { Card, PageHead } from "../../_ui/kit";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Settings" };

function Status({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span className={`ad-check ${ok ? "is-ok" : "is-todo"}`}>
      {ok ? <CheckCircle2 /> : <CircleAlert />}
      {children}
    </span>
  );
}

export default async function Settings() {
  const { content } = await getSite();
  const service = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const webhook = Boolean(process.env.CAL_WEBHOOK_SECRET);
  const items = [
    {
      icon: Database,
      name: "Database",
      about: "Stores visits, leads, bookings, projects and page content (Supabase).",
      ok: hasSupabase && service,
      detail: hasSupabase && service ? "Connected" : "Add the Supabase keys to the environment",
    },
    {
      icon: CalendarCheck,
      name: "Booking pop-up",
      about: "Every “Book a call” button opens Cal.com on the page.",
      ok: Boolean(config.calLink),
      detail: config.calLink ? `cal.com/${config.calLink}` : "Set NEXT_PUBLIC_CAL_LINK",
    },
    {
      icon: Webhook,
      name: "Booking details",
      about: "Cal.com sends each booking’s name, email and time to the Bookings page.",
      ok: webhook,
      detail: webhook ? "Webhook secret set" : "Needs the live site — see Bookings for the steps",
    },
    {
      icon: Mail,
      name: "Contact form email",
      about: "Messages are emailed via FormSubmit and stored under Leads.",
      ok: true,
      detail: content.contact.email,
    },
  ];

  return (
    <>
      <PageHead title="Settings" sub="How the site is connected. Secrets live in the environment, never in the database." />
      <div className="ad-grid ad-grid--split">
        <Card title="Connections" icon={Webhook}>
          <ul className="ad-integrations">
            {items.map(({ icon: I, name, about, ok, detail }) => (
              <li key={name}>
                <span className="ad-integrations__icon">
                  <I />
                </span>
                <span>
                  <b>{name}</b>
                  <small>{about}</small>
                </span>
                <Status ok={ok}>{detail}</Status>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Admin access" icon={ShieldCheck}>
          <p className="ad-muted">Only these emails can sign in. Each needs a user in Supabase → Authentication.</p>
          <ul className="ad-people">
            {adminEmails().map((e) => (
              <li key={e}>
                <span className="ad-avatar">{e.slice(0, 1).toUpperCase()}</span>
                <span className="ad-people__who">
                  <b>{e.split("@")[0]}</b>
                  <small>{e}</small>
                </span>
              </li>
            ))}
          </ul>
          <p className="ad-muted ad-small">To change the list, edit ADMIN_EMAILS in Vercel → Settings → Environment Variables and redeploy.</p>
        </Card>
      </div>
    </>
  );
}
