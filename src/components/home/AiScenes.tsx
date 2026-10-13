import type { CSSProperties } from "react";
import {
  ArrowUp, Bell, BookOpen, Bot, Calendar, CalendarCheck, Check, CircleCheck, Database, FileText, Flower2, Headphones,
  Inbox, Loader, Mic, PhoneOff, Repeat, ScanText, Search, ShoppingBag, Sparkles, TriangleAlert, UserRound,
} from "lucide-react";

/*
 * Illustrative product scenes for the AI showcase. Built in code so they follow the theme,
 * stay sharp at any size and animate each time their tab opens. Names and figures are sample data.
 */

function Assistant() {
  return (
    <div className="sc sc-assist">
      <div className="sc-win">
        <div className="sc-win__bar">
          <i />
          <i />
          <i />
          <span className="sc-win__url">bloomandco.shop</span>
        </div>
        <div className="sc-shop">
          <div className="sc-shop__nav">
            <b>Bloom &amp; Co.</b>
            <span>Bouquets</span>
            <span>Plants</span>
            <ShoppingBag />
          </div>
          <div className="sc-shop__hero">
            <span className="sc-chip">Spring edit</span>
            <b>Fresh flowers, delivered same day.</b>
          </div>
          <div className="sc-shop__grid">
            {[
              ["Peony blush", "£38", "a"],
              ["Wild meadow", "£32", "b"],
            ].map(([n, pr, k]) => (
              <div key={n} className="sc-prod">
                <span className={`sc-prod__img sc-prod__img--${k}`}>
                  <Flower2 />
                </span>
                <span className="sc-prod__name">{n}</span>
                <span className="sc-prod__price">{pr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sc-chat sc-pop">
        <div className="sc-chat__head">
          <span className="sc-chat__av">
            <Sparkles />
          </span>
          <span>
            <b>Bloom assistant</b>
            <small>
              <i className="sc-live" />
              Replies instantly
            </small>
          </span>
        </div>
        <div className="sc-chat__log">
          <p className="sc-msg sc-msg--me sc-in" style={{ "--d": "0.3s" } as CSSProperties}>
            Do you deliver on Sundays?
          </p>
          <p className="sc-typing sc-flash" aria-hidden="true">
            <i />
            <i />
            <i />
          </p>
          <p className="sc-msg sc-in" style={{ "--d": "1.9s" } as CSSProperties}>
            Yes — Sunday delivery runs 9 am–2 pm across the city. Want me to schedule one for this week?
          </p>
          <div className="sc-quick sc-in" style={{ "--d": "2.5s" } as CSSProperties}>
            <span>
              <Calendar />
              Schedule delivery
            </span>
            <span>
              <Headphones />
              Talk to a person
            </span>
          </div>
        </div>
        <div className="sc-chat__input">
          Type a message…
          <span>
            <ArrowUp />
          </span>
        </div>
      </div>
    </div>
  );
}

function Agents() {
  return (
    <div className="sc sc-agents">
      <div className="sc-board">
        <div className="sc-col">
          <h4>
            <span className="sc-ring" />
            To do <em>2</em>
          </h4>
          <div className="sc-task">
            <b>Chase overdue invoices</b>
            <small>3 customers · 30+ days</small>
          </div>
          <div className="sc-task">
            <b>Send April statements</b>
            <small>Scheduled · Fri</small>
          </div>
        </div>
        <div className="sc-col sc-col--live">
          <h4>
            <Loader className="sc-spin" />
            Agent working <em>1</em>
          </h4>
          <div className="sc-task sc-task--live">
            <b>Match payments to bank feed</b>
            <small>
              <Bot />
              Reading statement…
            </small>
            <span className="sc-bar">
              <i />
            </span>
          </div>
        </div>
        <div className="sc-col">
          <h4>
            <CircleCheck className="sc-ok" />
            Done <em>1</em>
          </h4>
          <div className="sc-task sc-task--done sc-in" style={{ "--d": "0.6s" } as CSSProperties}>
            <b>Reconcile March invoices</b>
            <small>
              <span className="sc-bot">
                <Bot />
              </span>
              Completed · 2 min
            </small>
          </div>
        </div>
      </div>
      <div className="sc-log">
        <p className="sc-in" style={{ "--d": "0.9s" } as CSSProperties}>
          <FileText className="sc-ok" />
          Read 42 invoices
        </p>
        <p className="sc-in" style={{ "--d": "1.6s" } as CSSProperties}>
          <CircleCheck className="sc-ok" />
          Matched 40 to bank feed
        </p>
        <p className="sc-in" style={{ "--d": "2.3s" } as CSSProperties}>
          <TriangleAlert className="sc-warn" />
          Flagged 2 for your approval
          <span className="sc-approve">Review</span>
        </p>
      </div>
    </div>
  );
}

function Flow() {
  const steps = [
    { icon: Inbox, t: "New lead", s: "Form submitted" },
    { icon: Sparkles, t: "Enrich & score", s: "Company · fit 92" },
    { icon: Database, t: "Update CRM", s: "Deal created" },
    { icon: Bell, t: "Notify sales", s: "Posted to #sales" },
  ];
  return (
    <div className="sc sc-flow">
      <div className="sc-flow__row">
        {steps.map(({ icon: I, t, s }, k) => (
          <div key={t} className="sc-node" style={{ "--k": k } as CSSProperties}>
            <span className="sc-node__tile">
              <I />
              <Check className="sc-node__ok" />
            </span>
            <b>{t}</b>
            <small>{s}</small>
          </div>
        ))}
        <span className="sc-wire" aria-hidden="true">
          <i />
        </span>
      </div>
      <div className="sc-pill sc-in" style={{ "--d": "2.6s" } as CSSProperties}>
        <Repeat />
        Runs 1,204 times a month · 0 manual steps
      </div>
    </div>
  );
}

function Knowledge() {
  const src = [
    ["1", "Refund policy.pdf", "p. 4", FileText],
    ["2", "Billing handbook", "§2.3", BookOpen],
    ["3", "Enterprise MSA", "§9", FileText],
  ] as const;
  return (
    <div className="sc sc-know">
      <div className="sc-search">
        <Search />
        <span className="sc-type">What’s our refund policy for annual plans?</span>
      </div>
      <div className="sc-answer sc-in" style={{ "--d": "1.4s" } as CSSProperties}>
        <h5>
          <Sparkles />
          Answer
        </h5>
        <p>
          Annual plans can be refunded in full within 30 days <sup>1</sup>. After that, unused months are credited pro rata{" "}
          <sup>2</sup>, except for enterprise contracts <sup>3</sup>.
        </p>
      </div>
      <div className="sc-sources">
        {src.map(([n, t, s, I], k) => (
          <div key={n} className="sc-src sc-in" style={{ "--d": `${2 + k * 0.25}s` } as CSSProperties}>
            <span className="sc-src__n">{n}</span>
            <I className="sc-src__i" />
            <b>{t}</b>
            <small>{s}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Voice() {
  return (
    <div className="sc sc-voice">
      <div className="sc-call">
        <span className="sc-call__av">
          <UserRound />
        </span>
        <b className="sc-call__num">+44 20 •••• 4821</b>
        <small className="sc-call__state">
          <i className="sc-live" />
          On call · AI agent
        </small>
        <span className="sc-wave" aria-hidden="true">
          {Array.from({ length: 28 }, (_, k) => (
            <i key={k} style={{ "--k": k } as CSSProperties} />
          ))}
        </span>
        <div className="sc-say">
          <p className="sc-in" style={{ "--d": "0.4s" } as CSSProperties}>
            <em>Caller</em> Table for four tonight, around half seven?
          </p>
          <p className="sc-in" style={{ "--d": "1.3s" } as CSSProperties}>
            <em>Agent</em> 7:30 is free — booked under your number.
          </p>
        </div>
        <div className="sc-book sc-in" style={{ "--d": "2.2s" } as CSSProperties}>
          <CalendarCheck />
          <span>
            <b>Table for 4 · 7:30 pm</b>
            <small>Confirmation sent by SMS</small>
          </span>
        </div>
        <div className="sc-call__ctl">
          <span>
            <Mic />
          </span>
          <span className="sc-end">
            <PhoneOff />
          </span>
        </div>
      </div>
    </div>
  );
}

function Docs() {
  const lines = [
    ["A4 copy paper × 20", "£96.00"],
    ["Toner cartridge × 4", "£312.00"],
    ["Desk chairs × 6", "£1,140.00"],
    ["Standing desk × 2", "£780.00"],
    ["Cable kits × 10", "£152.00"],
  ];
  const fields = [
    ["Vendor", "Northwind Supplies Ltd"],
    ["Invoice #", "NW-2026-0381"],
    ["Line items", "5 · all matched"],
    ["Total", "£ 2,480.00"],
  ];
  return (
    <div className="sc sc-docs">
      <div className="sc-paper">
        <div className="sc-paper__head">
          <span>
            <b>INVOICE</b>
            <small>Northwind Supplies Ltd</small>
          </span>
          <small>NW-2026-0381</small>
        </div>
        <div className="sc-paper__lines">
          {lines.map(([a, b]) => (
            <p key={a}>
              <span>{a}</span>
              <span>{b}</span>
            </p>
          ))}
        </div>
        <p className="sc-paper__total">
          <span>Total due</span>
          <b>£2,480.00</b>
        </p>
        <span className="sc-scan" aria-hidden="true" />
      </div>
      <div className="sc-fields">
        <h5>
          <ScanText />
          Extracted fields
        </h5>
        {fields.map(([l, v], k) => (
          <label key={l} className="sc-in" style={{ "--d": `${0.8 + k * 0.45}s` } as CSSProperties}>
            <small>{l}</small>
            <span>
              {v}
              <Check />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export const AI_SCENES = {
  "personal-ai-assistants": Assistant,
  "ai-agents": Agents,
  "workflow-automation": Flow,
  "knowledge-assistants": Knowledge,
  "voice-agents": Voice,
  "document-ai": Docs,
} as const;
