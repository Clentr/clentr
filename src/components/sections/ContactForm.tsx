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
 * No backend: on submit the form opens the visitor's mail client with everything
 * pre-filled, addressed to the studio. Nothing is stored or sent by the site.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string>("");

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("");
      const first = ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`);
      first?.focus();
      return;
    }
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const kind = get("kind") || "Not specified";
    const subject = `New project — ${kind}${get("company") ? ` · ${get("company")}` : ""}`;
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      get("company") && `Company: ${get("company")}`,
      `Building: ${kind}`,
      "",
      get("message"),
    ]
      .filter((l) => l !== "")
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(`Your email app should open with the message ready to send. If it doesn't, write to ${site.email}.`);
  }

  const field = (name: keyof Errors) => ({
    "data-invalid": errors[name] ? "true" : undefined,
  });

  return (
    <form className="form glass" onSubmit={onSubmit} noValidate aria-describedby="form-note">
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
          Sending opens your email app with the details filled in.
        </p>
        <Button type="submit" variant="primary">
          Send message
        </Button>
      </div>
      <p className="form__status" role="status" aria-live="polite" style={{ margin: 0 }}>
        {status}
      </p>
    </form>
  );
}
