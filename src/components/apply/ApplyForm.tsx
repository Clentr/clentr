"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BEFORE, BUDGETS, COUNTRIES, EXPECTS, flagOf, groupDigits, instagramHandle, phoneProblem, STAGES, TIMELINES, type Application } from "@/content/apply";
import { Icon } from "../ui/Icon";
import { relayNotice } from "@/lib/relay-notice";

type Key = keyof Application;
const EMPTY: Application = { name: "", email: "", phone: "", instagram: "", idea: "", stage: "", problem: "", budget: "", timeline: "", expect: "", before: "", why: "", extra: "" };

const STEPS: { title: string; sub: string; keys: Key[] }[] = [
  { title: "About you", sub: "So we know who we’re talking to.", keys: ["name", "email", "phone", "instagram"] },
  { title: "Your product", sub: "Simple words are perfect.", keys: ["idea", "stage", "problem"] },
  { title: "The fit", sub: "Honest answers help us both.", keys: ["budget", "timeline", "expect", "before", "why"] },
];

const MSG: Partial<Record<Key, string>> = {
  name: "Please add your name.",
  email: "Please add a valid email.",
  instagram: "That isn’t a valid Instagram username.",
  idea: "A line or two about the product, please.",
  stage: "Pick the closest one.",
  problem: "Tell us who it’s for and what it solves.",
  budget: "Pick a range.",
  timeline: "Pick a timeline.",
  expect: "Pick one.",
  before: "Pick one.",
  why: "A line is enough.",
};

/** Phone is kept as "+91 98765 43210"; this splits it back into country and digits. */
const splitPhone = (v: string) => {
  const c = COUNTRIES.find((x) => v.startsWith(`${x.code} `)) ?? COUNTRIES[0];
  return { c, digits: v.slice(c.code.length).replace(/\D/g, "") };
};

function problem(k: Key, v: string): string | null {
  if (k === "phone") {
    const { c, digits } = splitPhone(v);
    return phoneProblem(c, digits);
  }
  if (k === "instagram") return v.trim() && !instagramHandle(v) ? MSG.instagram! : null;
  return check(k, v) ? null : MSG[k]!;
}

function check(k: Key, v: string): boolean {
  const s = v.trim();
  if (k === "extra") return true;
  if (k === "phone" || k === "instagram") return !problem(k, v);
  if (k === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  if (k === "idea" || k === "problem") return s.length >= 10;
  return s.length > 0;
}

/** Three short steps; answers go to /api/apply and the team replies with a booking link if it’s a fit. */
export function ApplyForm({ email }: { email: string }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Application>({ ...EMPTY, phone: `${COUNTRIES[0].code} ` });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const honey = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLFormElement>(null);

  // The thank-you card is shorter than the form; bring it into view.
  useEffect(() => {
    if (sent) document.querySelector(".apply__sent")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [sent]);

  const set = (k: Key) => (v: string) => {
    setA((x) => ({ ...x, [k]: v }));
    if (errors[k] && check(k, v)) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function validate() {
    const bad = STEPS[step].keys.filter((k) => !check(k, a[k]));
    setErrors(Object.fromEntries(bad.map((k) => [k, problem(k, a[k])])));
    if (bad.length) card.current?.querySelector<HTMLElement>(`[data-k="${bad[0]}"] input, [data-k="${bad[0]}"] textarea`)?.focus();
    return !bad.length;
  }

  function go(n: number) {
    setStep(n);
    requestAnimationFrame(() => {
      const top = card.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) card.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      card.current?.querySelector<HTMLElement>(".apply__step input, .apply__step textarea")?.focus({ preventScroll: true });
    });
  }

  async function submit() {
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, instagram: a.instagram.trim() ? instagramHandle(a.instagram) : "", _honey: honey.current?.value ?? "" }),
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
      <div className="form card sent apply__sent" role="status">
        <span className="icon-tile">
          <Icon name="check" />
        </span>
        <h2>Request received</h2>
        <p>
          Thanks, {a.name.split(" ")[0]}. We read every request ourselves. If it’s a fit, you’ll get a link to pick a time from {email} within one working day.
        </p>
      </div>
    );
  }

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <form
      ref={card}
      className="form card apply"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!validate()) return;
        if (last) void submit();
        else go(step + 1);
      }}
    >
      <input ref={honey} type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <div className="apply__top">
        <ol className="apply__steps" aria-label="Steps">
          {STEPS.map((x, i) => (
            <li key={x.title} className={i === step ? "is-on" : i < step ? "is-done" : undefined} aria-current={i === step ? "step" : undefined}>
              <span>{i < step ? <Icon name="check" /> : i + 1}</span>
              {x.title}
            </li>
          ))}
        </ol>
        <div className="apply__bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
        </div>
      </div>

      <header className="apply__head">
        <h2>{s.title}</h2>
        <p>{s.sub}</p>
      </header>

      <div className="apply__step" key={step}>
        {step === 0 && (
          <>
            <div className="form__row">
              <Text k="name" label="Full name" value={a.name} onChange={set("name")} error={errors.name} auto="name" placeholder="Your name" />
              <Text k="email" label="Email" value={a.email} onChange={set("email")} error={errors.email} auto="email" type="email" placeholder="you@company.com" />
            </div>
            <div className="form__row">
              <Phone value={a.phone} onChange={set("phone")} error={errors.phone} />
              <Text k="instagram" label="Instagram" hint="Optional" value={a.instagram} onChange={set("instagram")} error={errors.instagram} placeholder="@yourhandle" />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <Text k="idea" label="What do you want to build?" hint="Describe it in simple terms" value={a.idea} onChange={set("idea")} error={errors.idea} long placeholder="An app that helps local gyms take bookings and payments…" />
            <Choice k="stage" label="What stage are you at?" options={STAGES} value={a.stage} onChange={set("stage")} error={errors.stage} />
            <Text k="problem" label="What problem are you solving?" hint="The core use case, and who it’s for" value={a.problem} onChange={set("problem")} error={errors.problem} long placeholder="Gym owners lose members because booking is done over WhatsApp…" />
          </>
        )}
        {step === 2 && (
          <>
            <Choice k="budget" label="Budget range" options={BUDGETS} value={a.budget} onChange={set("budget")} error={errors.budget} />
            <Choice k="timeline" label="Timeline" options={TIMELINES} value={a.timeline} onChange={set("timeline")} error={errors.timeline} />
            <Choice k="expect" label="What are you expecting from us?" options={EXPECTS} value={a.expect} onChange={set("expect")} error={errors.expect} />
            <Choice k="before" label="Have you worked with developers before?" options={BEFORE} value={a.before} onChange={set("before")} error={errors.before} />
            <Text k="why" label="Why Clentr?" hint="What made you reach out to us" value={a.why} onChange={set("why")} error={errors.why} long rows={3} placeholder="Saw your work on…" />
            <Text k="extra" label="Anything else we should know?" hint="Optional" value={a.extra} onChange={set("extra")} long rows={3} placeholder="Links, deadlines, an investor demo…" />
          </>
        )}
      </div>

      <div className="form__foot apply__foot">
        {step > 0 && (
          <button type="button" className="btn btn--ghost" onClick={() => go(step - 1)}>
            <Icon name="arrow-left" />
            Back
          </button>
        )}
        <button type="submit" className="btn btn--ink" disabled={sending}>
          {last ? (sending ? "Sending…" : "Send request") : "Continue"}
          <Icon name={last ? "send" : "arrow-right"} />
        </button>
        <small>
          <Icon name="lock" />
          {last ? "Read only by our team. NDA on request." : `Step ${step + 1} of ${STEPS.length} · about 2 minutes`}
        </small>
      </div>
      <p role="status" className="form__fail">
        {failed ? `Something went wrong sending your request. Please write to ${email} directly.` : ""}
      </p>
    </form>
  );
}

function Label({ label, hint }: { label: string; hint?: string }): ReactNode {
  return (
    <>
      {label}
      {hint && <em className={hint === "Optional" ? "is-opt" : undefined}>{hint}</em>}
    </>
  );
}

function Text({
  k, label, hint, value, onChange, error, long, rows = 4, type = "text", auto, placeholder,
}: {
  k: Key; label: string; hint?: string; value: string; onChange: (v: string) => void; error?: string; long?: boolean; rows?: number; type?: string; auto?: string; placeholder?: string;
}) {
  return (
    <label className="field" data-k={k} {...(error ? { "data-error": "" } : {})}>
      <span>
        <Label label={label} hint={hint} />
      </span>
      {long ? (
        <textarea name={k} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} />
      ) : (
        <input name={k} type={type} autoComplete={auto} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} />
      )}
      {error && <small>{error}</small>}
    </label>
  );
}

/** Country code picker + national number, formatted as you type. */
function Phone({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const { c, digits } = splitPhone(value);
  const max = c.len[1];
  return (
    <div className="field" data-k="phone" {...(error ? { "data-error": "" } : {})}>
      <span id="apply-phone">Phone / WhatsApp</span>
      <div className="phone">
        <label className="phone__cc">
          <span aria-hidden="true">
            <i>{flagOf(c.iso)}</i>
            {c.code}
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
          <select
            aria-label="Country code"
            value={c.iso}
            onChange={(e) => {
              const n = COUNTRIES.find((x) => x.iso === e.target.value) ?? COUNTRIES[0];
              onChange(`${n.code} ${groupDigits(digits.slice(0, n.len[1]), n.iso)}`);
            }}
          >
            {COUNTRIES.map((x) => (
              <option key={x.iso} value={x.iso}>
                {flagOf(x.iso)} {x.name} ({x.code})
              </option>
            ))}
          </select>
        </label>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          aria-labelledby="apply-phone"
          aria-invalid={!!error}
          placeholder={c.sample}
          value={groupDigits(digits, c.iso)}
          onChange={(e) => {
            let d = e.target.value.replace(/\D/g, "");
            // Pasted with the country code, or a leading trunk 0: keep the national number only.
            const cc = c.code.slice(1);
            if (e.target.value.trim().startsWith("+") && d.startsWith(cc)) d = d.slice(cc.length);
            else if (d.length > max && d.startsWith(cc)) d = d.slice(cc.length);
            d = d.replace(/^0+/, "").slice(0, max);
            onChange(`${c.code} ${groupDigits(d, c.iso)}`);
          }}
        />
      </div>
      {error && <small>{error}</small>}
    </div>
  );
}

function Choice({ k, label, options, value, onChange, error }: { k: Key; label: string; options: readonly string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="field" data-k={k} {...(error ? { "data-error": "" } : {})}>
      <legend>{label}</legend>
      <div className="toggles">
        {options.map((o) => (
          <label key={o} className="toggle">
            <input type="radio" name={k} value={o} checked={value === o} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && <small>{error}</small>}
    </fieldset>
  );
}
