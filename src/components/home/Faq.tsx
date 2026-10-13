"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/content/cms";
import { Icon } from "../ui/Icon";
import { Mark } from "../ui/Logo";
import { SectionHead } from "../ui/SectionHead";
import { BookCall } from "../ui/BookCall";

type Msg = { from: "bot" | "me"; text: string };

/** Answers the common questions instantly; anything else goes to a person. */
export function Faq({ c }: { c: SiteContent["faq"]; email?: string }) {
  const faqs = c.items;
  const GREETING: Msg = { from: "bot", text: c.greeting };
  const [log, setLog] = useState<Msg[]>([GREETING]);
  const [asked, setAsked] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
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



  return (
    <section className="section" id="faqs" aria-labelledby="faqs-title">
      <div className="container">
        <SectionHead id="faqs-title" chip={c.chip} icon={c.icon} title={c.title} dim={c.dim} lead={c.lead} />
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
            <BookCall where="faq">
              <Icon name="calendar" />
              Book a call
            </BookCall>
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
              <button key={`${f.q}-${i}`} type="button" onClick={() => ask(i)} disabled={typing || asked.includes(i)}>
                <Icon name="message-circle" />
                {f.q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
