"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChatReply } from "@/lib/chatbot";

type Msg = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: ChatReply["links"];
  suggestions?: string[];
};

const WELCOME: Msg = {
  id: "welcome",
  role: "bot",
  text: "Bonjour, je suis l assistant MW. Posez une question sur un pays, une procedure, un delai ou un rendez-vous.",
  suggestions: [
    "Quels pays proposez-vous ?",
    "Visa etudes Canada",
    "Comment ca marche ?",
  ],
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, pending]);

  async function envoyer(texte: string) {
    const clean = texte.trim();
    if (!clean || pending) return;

    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: clean,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });
      const data = (await res.json()) as ChatReply;
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: data.text,
          links: data.links,
          suggestions: data.suggestions,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: "Impossible de repondre pour le moment. Reessayez ou passez par la page Aide.",
          links: [{ label: "Aide", href: "/aide" }],
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="chat">
      {open ? (
        <section
          className="chat-panel"
          role="dialog"
          aria-label="Assistant MW Consulting"
        >
          <header className="chat-head">
            <div>
              <p className="chat-title">Assistant MW</p>
              <p className="chat-sub">Reponses sur pays et procedures</p>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Fermer le chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="chat-body" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.role === "user" ? "is-user" : "is-bot"}`}
              >
                <p className="chat-text">{msg.text}</p>
                {msg.links?.length ? (
                  <div className="chat-links">
                    {msg.links.map((l) => (
                      <Link key={l.href + l.label} href={l.href} className="chat-link">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
                {msg.role === "bot" && msg.suggestions?.length ? (
                  <div className="chat-suggestions">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="chat-chip"
                        onClick={() => envoyer(s)}
                        disabled={pending}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {pending ? (
              <div className="chat-bubble is-bot">
                <p className="chat-text chat-typing">Reflection...</p>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              void envoyer(input);
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Votre question
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Visa etudes Canada"
              maxLength={500}
              disabled={pending}
              autoComplete="off"
            />
            <button
              type="submit"
              className="chat-send"
              disabled={pending || !input.trim()}
              aria-label="Envoyer"
            >
              Envoyer
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className={`chat-fab ${open ? "is-open" : ""}`}
        aria-label={open ? "Fermer l assistant" : "Ouvrir l assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          "×"
        ) : (
          <>
            <span className="chat-fab-icon" aria-hidden>
              ✦
            </span>
            <span className="chat-fab-label">Assistant</span>
          </>
        )}
      </button>
    </div>
  );
}
