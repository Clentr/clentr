"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { bookCallHref, faqs, site } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { SectionHead } from "../ui/SectionHead";

type Msg = { from: "bot" | "me"; text: string };

const GREETING: Msg = {
  from: "bot",
  text: "Hi! I can answer anything about working with Clentr. Pick a question below or type your own.",
};

const KEYWORDS: [RegExp, number][] = [
  [/build|make|do you|service|offer/i, 0],
  [/cost|price|budget|how much|rate/i, 1],
  [/start|soon|fast|when|timeline/i, 2],
  [/existing|legacy|take over|half|already/i, 3],
  [/own|code|ip|nda/i, 4],
  [/after|launch|support|maintain/i, 5],
];

/** Answers the common questions instantly; anything else goes to a person. */
export function Faq() {
  const [log, setLog] = useState<Msg[]>([GREETING]);
  const [asked, setAsked] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, typing]);

  function reply(question: string, answer: string, idx?: number) {
    setLog((l) => [...l, { from: "me", text: question }]);
    if (idx !== undefined) setAsked((a) => [...a, idx]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setLog((l) => [...l, { from: "bot", text: answer }]);
    }, 900);
  }

  function ask(i: number) {
    if (typing) return;
    reply(faqs[i].q, faqs[i].a, i);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = draft.trim();
    if (!q || typing) return;
    setDraft("");
    const hit = KEYWORDS.find(([re]) => re.test(q));
    reply(
      q,
      hit
        ? faqs[hit[1]].a
        : `Good question — a real person should answer that one. Email ${site.email} and we'll reply within one working day.`,
    );
  }

  return (
    <section className="section" id="faqs" aria-labelledby="faqs-title">
      <div className="container">
        <SectionHead
          id="faqs-title"
          chip="FAQs"
          icon="message-circle"
          title="Questions,"
          dim="answered."
          lead="Tap a question — our assistant answers instantly, and a real person follows up within a day."
        />
        <div className="bot card">
          <div className="bot__bar">
            <span className="bot__avatar">
              <Mark ink="#0a0a0b" lit="#2d46ff" />
            </span>
            <span>
              <span className="bot__name">Clentr assistant</span>
              <span className="bot__status">
                <span className="dot-live" />
                Online · answers instantly, humans reply within a day
              </span>
            </span>
            <a href={bookCallHref}>
              <Icon name="calendar" />
              Book a call
            </a>
          </div>
          <div className="bot__log" ref={logRef} aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`msg msg--${m.from}`}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="msg msg--bot typing" aria-label="Assistant is typing">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
          <div className="bot__qs">
            {faqs.map((f, i) => (
              <button key={f.q} type="button" onClick={() => ask(i)} disabled={typing || asked.includes(i)}>
                <Icon name="message-circle" />
                {f.q}
              </button>
            ))}
          </div>
          <form className="bot__input" onSubmit={onSubmit}>
            <label htmlFor="bot-q" className="sr-only">
              Ask us anything
            </label>
            <input id="bot-q" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask us anything…" autoComplete="off" />
            <button type="submit" aria-label="Send" disabled={!draft.trim() || typing}>
              <Icon name="send" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
