import { connection } from "next/server";
import { CalendarCheck, CalendarClock, CalendarX, Clock, Mail, Video } from "lucide-react";
import { bookings, type Booking } from "@/lib/analytics";
import { config } from "@/lib/config";
import { Card, Empty, PageHead } from "../../_ui/kit";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Bookings" };

const fmt = (iso: string | null, o: Intl.DateTimeFormatOptions) => (iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Kolkata", ...o }) : "—");

function Row({ b }: { b: Booking }) {
  const cancelled = b.status === "cancelled";
  return (
    <li className={`ad-book ${cancelled ? "is-cancelled" : ""}`}>
      <span className="ad-book__date">
        <small>{fmt(b.start_time, { month: "short" })}</small>
        <b>{fmt(b.start_time, { day: "numeric" })}</b>
      </span>
      <span className="ad-book__who">
        <b>{b.name ?? "Someone"}</b>
        <small>
          <Clock /> {fmt(b.start_time, { weekday: "short", hour: "2-digit", minute: "2-digit" })} IST · {b.title ?? "30 min meeting"}
        </small>
        {b.notes && <span className="ad-book__notes">“{b.notes}”</span>}
      </span>
      <span className={`ad-status ad-status--${b.status}`}>{b.status}</span>
      {b.email && (
        <a className="ad-iconbtn" href={`mailto:${b.email}`} aria-label={`Email ${b.name}`} title={b.email}>
          <Mail />
        </a>
      )}
    </li>
  );
}

export default async function Bookings() {
  await connection(); // reads the clock: always per request
  const all = await bookings();
  const now = new Date().toISOString();
  const upcoming = all.filter((b) => (b.start_time ?? "") >= now && b.status !== "cancelled").reverse();
  const past = all.filter((b) => !upcoming.includes(b));
  const webhook = Boolean(process.env.CAL_WEBHOOK_SECRET);

  return (
    <>
      <PageHead title="Bookings" sub="Calls booked through the Cal.com pop-up on the site.">
        {config.calLink && (
          <a className="ad-btn" href={`https://app.cal.com/bookings/upcoming`} target="_blank" rel="noopener">
            <Video />
            Open Cal.com
          </a>
        )}
      </PageHead>

      {!all.length ? (
        <div className="ad-card ad-empty ad-empty--big">
          <span className="ad-empty__icon">
            <CalendarCheck />
          </span>
          <h2>No bookings yet</h2>
          {webhook ? (
            <p>Bookings appear here the moment someone books a call.</p>
          ) : (
            <>
              <p>The booking pop-up already works. To see who booked here, connect Cal.com once the site is live:</p>
              <ol className="ad-steps">
                <li>Cal.com → Settings → Developer → Webhooks → New</li>
                <li>
                  Subscriber URL: <code>https://&lt;your-domain&gt;/api/cal/webhook</code>
                </li>
                <li>Add a secret and set the same value as CAL_WEBHOOK_SECRET in Vercel</li>
                <li>Events: Booking created, rescheduled and cancelled</li>
              </ol>
            </>
          )}
        </div>
      ) : (
        <div className="ad-grid ad-grid--split">
          <Card title={`Upcoming · ${upcoming.length}`} icon={CalendarClock}>
            {upcoming.length ? (
              <ul className="ad-books">
                {upcoming.map((b) => (
                  <Row key={b.id} b={b} />
                ))}
              </ul>
            ) : (
              <Empty icon={CalendarClock} text="Nothing on the calendar." />
            )}
          </Card>
          <Card title={`Past & cancelled · ${past.length}`} icon={CalendarX}>
            {past.length ? (
              <ul className="ad-books">
                {past.map((b) => (
                  <Row key={b.id} b={b} />
                ))}
              </ul>
            ) : (
              <Empty text="No past calls yet." />
            )}
          </Card>
        </div>
      )}
    </>
  );
}
