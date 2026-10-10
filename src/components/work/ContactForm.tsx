"use client";

import { useState, type FormEvent } from "react";
import { bookCallHref, site } from "@/content/site";
import { Icon } from "../ui/Icon";

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
 * Submissions are relayed to the studio inbox by FormSubmit (formsubmit.co);
 * there is no backend of our own.
 */
export function ContactForm() {
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
      const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New project enquiry — ${building}`,
          _replyto: get("email"),
          _template: "table",
          _honey: get("_honey"),
          name: get("name"),
          email: get("email"),
          building,
          budget: get("budget") || "Not specified",
          details: get("details"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) === "false") throw new Error("send failed");
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
        <p>Thanks — a real person will reply from {site.email} within one working day.</p>
        <a href={bookCallHref} className="btn btn--ink btn--sm">
          <Icon name="calendar" />
          Or book a call now
        </a>
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
        {failed ? `Something went wrong sending your message. Please write to ${site.email} directly.` : ""}
      </p>
    </form>
  );
}
