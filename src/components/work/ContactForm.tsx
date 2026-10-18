"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "../ui/Icon";
import { BookCall } from "../ui/BookCall";
import { relayNotice } from "@/lib/relay-notice";

const KINDS: [string, string][] = [
  ["Mobile app", "smartphone"],
  ["Web platform", "app-window"],
  ["AI / automation", "sparkles"],
  ["Desktop", "monitor"],
  ["Design", "pen-tool"],
];
const BUDGETS = ["< $10k", "$10–25k", "$25–50k", "$50k+", "Not sure"];

type Errors = Partial<Record<"name" | "email" | "details", string>>;

/**
 * Submissions go to /api/lead, which stores them for the admin panel and emails the
 * studio inbox via FormSubmit.
 */
export function ContactForm({ email }: { email: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const next: Errors = {};
    if (!get("name")) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = "Please add a valid email.";
    if (get("details").length < 10) next.details = "A line or two about the project helps us reply properly.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    const kinds = d.getAll("kind").map(String);
    const building = kinds.join(", ") || "Not specified";
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          building,
          budget: get("budget") || "Not specified",
          details: get("details"),
          path: location.pathname,
          _honey: get("_honey"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; notice?: unknown };
      if (json.notice) relayNotice(json.notice);
      if (!json.ok) throw new Error("send failed");
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="form card sent" role="status">
        <span className="icon-tile">
          <Icon name="check" />
        </span>
        <h2>Message sent</h2>
        <p>Thanks — a real person will reply from {email} within one working day.</p>
        <BookCall where="form_sent" className="btn btn--ink btn--sm">
          <Icon name="calendar" />
          Or request a call
        </BookCall>
      </div>
    );
  }

  const err = (k: keyof Errors) => (errors[k] ? { "data-error": "" } : {});

  return (
    <form className="form card" onSubmit={onSubmit} noValidate>
      <h2>Tell us about your project</h2>
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <div className="form__row">
        <label className="field" {...err("name")}>
          <span>Name</span>
          <input name="name" autoComplete="name" placeholder="Jane Appleseed" aria-invalid={!!errors.name} />
          {errors.name && <small>{errors.name}</small>}
        </label>
        <label className="field" {...err("email")}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" aria-invalid={!!errors.email} />
          {errors.email && <small>{errors.email}</small>}
        </label>
      </div>
      <fieldset className="field">
        <legend>What are you building?</legend>
        <div className="toggles">
          {KINDS.map(([k, icon]) => (
            <label key={k} className="toggle">
              <input type="checkbox" name="kind" value={k} />
              <span>
                <Icon name={icon} />
                {k}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>Budget</legend>
        <div className="toggles">
          {BUDGETS.map((b) => (
            <label key={b} className="toggle">
              <input type="radio" name="budget" value={b} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field" {...err("details")}>
        <span>Project details</span>
        <textarea name="details" placeholder="A few lines about the problem, the people and any deadlines…" aria-invalid={!!errors.details} />
        {errors.details && <small>{errors.details}</small>}
      </label>
      <div className="form__foot">
        <button type="submit" className="btn btn--ink" disabled={sending}>
          <Icon name="send" />
          {sending ? "Sending…" : "Send message"}
        </button>
        <small>
          <Icon name="lock" />
          We reply within one working day. NDA on request.
        </small>
      </div>
      <p role="status" className="form__fail">
        {failed ? `Something went wrong sending your message. Please write to ${email} directly.` : ""}
      </p>
    </form>
  );
}
