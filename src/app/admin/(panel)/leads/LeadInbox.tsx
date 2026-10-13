"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { Archive, Check, CircleDot, Inbox, Mail, MapPin, Search, Trash2, Trophy, Wallet, Wrench } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/analytics";
import { deleteLead, updateLead } from "../../actions";

const STATUSES: { k: LeadStatus; label: string; icon: typeof Inbox }[] = [
  { k: "new", label: "New", icon: CircleDot },
  { k: "contacted", label: "Contacted", icon: Mail },
  { k: "won", label: "Won", icon: Trophy },
  { k: "archived", label: "Archived", icon: Archive },
];

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const short = (iso: string) => {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export function LeadInbox({ leads: initialLeads, initial }: { leads: Lead[]; initial: number | null }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [tab, setTab] = useState<LeadStatus | "all">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<number | null>(initial);
  const [, start] = useTransition();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const l of leads) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);

  const shown = leads.filter(
    (l) =>
      (tab === "all" ? l.status !== "archived" : l.status === tab) &&
      (!q || `${l.name} ${l.email} ${l.details} ${l.building}`.toLowerCase().includes(q.toLowerCase())),
  );
  const lead = leads.find((l) => l.id === sel) ?? null;

  function setStatus(status: LeadStatus) {
    if (!lead) return;
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    start(async () => {
      await updateLead(lead.id, { status });
      router.refresh();
    });
  }

  function remove() {
    if (!lead || !confirm(`Delete ${lead.name}’s message? This can’t be undone.`)) return;
    const next = shown.find((l) => l.id !== lead.id)?.id ?? null;
    setLeads((ls) => ls.filter((l) => l.id !== lead.id));
    setSel(next);
    start(async () => {
      await deleteLead(lead.id);
      router.refresh();
    });
  }

  if (!leads.length) {
    return (
      <div className="ad-card ad-empty ad-empty--big">
        <span className="ad-empty__icon">
          <Inbox />
        </span>
        <h2>No messages yet</h2>
        <p>When someone sends the contact form on clentr.com, it lands here — and in your email.</p>
      </div>
    );
  }

  return (
    <div className="ad-inbox ad-card">
      <div className="ad-inbox__list">
        <div className="ad-inbox__tools">
          <label className="ad-search">
            <Search />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or message" />
          </label>
          <div className="ad-tabs" role="tablist">
            {[{ k: "all", label: "Open" } as const, ...STATUSES].map((s) => (
              <button key={s.k} role="tab" aria-selected={tab === s.k} onClick={() => setTab(s.k)}>
                {s.label}
                <em>{s.k === "all" ? counts.all - (counts.archived ?? 0) : (counts[s.k] ?? 0)}</em>
              </button>
            ))}
          </div>
        </div>
        <ul>
          {shown.map((l) => (
            <li key={l.id}>
              <button className="ad-inbox__item" aria-current={l.id === sel} onClick={() => setSel(l.id)}>
                <span className="ad-avatar">{l.name.slice(0, 1).toUpperCase()}</span>
                <span className="ad-inbox__meta">
                  <span className="ad-inbox__row">
                    <b>{l.name}</b>
                    <time>{short(l.created_at)}</time>
                  </span>
                  <span className="ad-inbox__preview">{l.details}</span>
                  <span className={`ad-status ad-status--${l.status}`}>{l.status}</span>
                </span>
              </button>
            </li>
          ))}
          {!shown.length && <li className="ad-inbox__none">Nothing here.</li>}
        </ul>
      </div>

      <div className="ad-inbox__detail">
        {lead ? (
          <>
            <header className="ad-lead__head">
              <span className="ad-avatar ad-avatar--lg">{lead.name.slice(0, 1).toUpperCase()}</span>
              <div>
                <h2>{lead.name}</h2>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
              <div className="ad-lead__actions">
                <a
                  className="ad-btn ad-btn--primary"
                  href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your project with Clentr")}`}
                >
                  <Mail />
                  Reply
                </a>
                <button className="ad-iconbtn ad-iconbtn--danger" onClick={remove} aria-label="Delete lead" title="Delete">
                  <Trash2 />
                </button>
              </div>
            </header>

            <div className="ad-pipeline" role="radiogroup" aria-label="Status">
              {STATUSES.map(({ k, label, icon: I }) => (
                <button key={k} role="radio" aria-checked={lead.status === k} onClick={() => setStatus(k)}>
                  <I />
                  {label}
                </button>
              ))}
            </div>

            <dl className="ad-facts">
              <div>
                <dt>
                  <Wrench /> Building
                </dt>
                <dd>{lead.building || "—"}</dd>
              </div>
              <div>
                <dt>
                  <Wallet /> Budget
                </dt>
                <dd>{lead.budget || "—"}</dd>
              </div>
              <div>
                <dt>
                  <MapPin /> Country
                </dt>
                <dd>{lead.country || "—"}</dd>
              </div>
              <div>
                <dt>
                  <Inbox /> Received
                </dt>
                <dd>{when(lead.created_at)}</dd>
              </div>
            </dl>

            <section className="ad-message">
              <h3>Message</h3>
              <p>{lead.details}</p>
            </section>

            <Notes
              key={lead.id}
              lead={lead}
              onSaved={(notes) => setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, notes } : l)))}
            />
          </>
        ) : (
          <div className="ad-empty">
            <p>Select a message.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Private notes for one lead; saves itself a moment after typing stops. */
function Notes({ lead, onSaved }: { lead: Lead; onSaved: (notes: string) => void }) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <section className="ad-notes">
      <h3>
        Private notes
        <small>
          {state === "saving" ? (
            "Saving…"
          ) : state === "saved" ? (
            <>
              <Check /> Saved
            </>
          ) : (
            "Only admins see these"
          )}
        </small>
      </h3>
      <textarea
        value={notes}
        rows={5}
        placeholder="Call notes, next steps, quote sent…"
        onChange={(e) => {
          const v = e.target.value;
          setNotes(v);
          setState("saving");
          clearTimeout(timer.current);
          timer.current = setTimeout(async () => {
            await updateLead(lead.id, { notes: v });
            onSaved(v);
            setState("saved");
          }, 700);
        }}
      />
    </section>
  );
}
