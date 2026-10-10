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
 * No backend: a valid submission opens the visitor's email app with the
 * brief filled in, addressed to the studio, then shows the "sent" state.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const next: Errors = {};
    if (!get("name")) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = "Please add a valid email.";
    if (get("details").length < 10) next.details = "A line or two about the project helps us reply properly.";
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    const kinds = d.getAll("kind").map(String);
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Building: ${kinds.join(", ") || "Not specified"}`,
      `Budget: ${get("budget") || "Not specified"}`,
      "",
      get("details"),
    ].join("\n");
    const subject = `New project${kinds.length ? ` — ${kinds.join(", ")}` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form card sent" role="status">
        <span className="icon-tile">
          <Icon name="check" />
        </span>
        <h2>Message ready</h2>
        <p>
          Your email app should open with the brief filled in — send it, and a real person will reply from {site.email} within
          one working day.
        </p>
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
        <button type="submit" className="btn btn--ink">
          <Icon name="send" />
          Send message
        </button>
        <small>
          <Icon name="lock" />
          We reply within one working day. NDA on request.
        </small>
      </div>
    </form>
  );
}
