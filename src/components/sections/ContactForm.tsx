"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { Button } from "../ui/Button";

const KINDS = ["Mobile app", "Web platform", "AI product", "Desktop tool", "Something else"] as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!String(d.get("name") ?? "").trim()) e.name = "Please tell us your name.";
  if (!EMAIL_RE.test(String(d.get("email") ?? "").trim())) e.email = "Please enter a valid email address.";
  if (String(d.get("message") ?? "").trim().length < 10) e.message = "A sentence or two helps us reply properly.";
  return e;
}

/**
 * Submissions are relayed to the studio inbox by FormSubmit (formsubmit.co).
 * The first submission sends a one-time activation email to that inbox.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string>("");
  const [sending, setSending] = useState(false);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("");
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const kind = get("kind") || "Not specified";

    setSending(true);
    setStatus("Sending…");
    try {
      // FormSubmit relays the message to the studio inbox; no backend of our own.
      const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New project enquiry — ${kind}${get("company") ? ` · ${get("company")}` : ""}`,
          _replyto: get("email"),
          _template: "table",
          _honey: get("_honey"),
          name: get("name"),
          email: get("email"),
          company: get("company") || "—",
          building: kind,
          message: get("message"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) === "false") throw new Error("send failed");
      form.reset();
      setStatus("Thanks — your message is on its way. We'll reply personally.");
    } catch {
      setStatus(`Something went wrong sending your message. Please write to ${site.email} directly.`);
    } finally {
      setSending(false);
    }
  }

  const field = (name: keyof Errors) => ({
    "data-invalid": errors[name] ? "true" : undefined,
  });

  return (
    <form className="form glass" onSubmit={onSubmit} noValidate aria-describedby="form-note">
      {/* Honeypot: hidden from people, filled in by bots. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <div className="form__row">
        <div className="field" {...field("name")}>
          <label className="field__label label" htmlFor="f-name">
            Name
          </label>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "e-name" : undefined}
          />
          {errors.name && (
            <span className="field__error" id="e-name">
              {errors.name}
            </span>
          )}
        </div>
        <div className="field" {...field("email")}>
          <label className="field__label label" htmlFor="f-email">
            Email
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "e-email" : undefined}
          />
          {errors.email && (
            <span className="field__error" id="e-email">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label className="field__label label" htmlFor="f-company">
          Company <span>Optional</span>
        </label>
        <input id="f-company" name="company" autoComplete="organization" placeholder="Company or project name" />
      </div>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="label" style={{ marginBottom: 12 }}>
          What are you building?
        </legend>
        <div className="chips">
          {KINDS.map((k) => (
            <label key={k} className="chip">
              <input type="radio" name="kind" value={k} />
              <span>{k}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field" {...field("message")}>
        <label className="field__label label" htmlFor="f-message">
          Message
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={4}
          placeholder="What's the idea, who is it for, and where are you today?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "e-message" : undefined}
        />
        {errors.message && (
          <span className="field__error" id="e-message">
            {errors.message}
          </span>
        )}
      </div>

      <div className="form__foot">
        <p className="form__note" id="form-note">
          We reply personally, usually within a working day.
        </p>
        <Button type="submit" variant="primary" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </Button>
      </div>
      <p className="form__status" role="status" aria-live="polite" style={{ margin: 0 }}>
        {status}
      </p>
    </form>
  );
}
