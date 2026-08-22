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

function IconChat() {
  return (
    <svg
      className="chat-fab-svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8v6.4A2.8 2.8 0 0 1 16.2 16H10l-3.6 2.7c-.55.4-1.3.01-1.3-.66V16A2.8 2.8 0 0 1 5 13.2V6.8Z"
        fill="currentColor"
      />
      <circle cx="9" cy="10" r="1.05" fill="#0a2744" />
      <circle cx="12" cy="10" r="1.05" fill="#0a2744" />
      <circle cx="15" cy="10" r="1.05" fill="#0a2744" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const endRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = endRef.current;
    if (node && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [open, messages, pending]);

  function ouvrirFermer() {
    if (open) {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
      setOpen(false);
      return;
    }
    setOpen(true);
  }

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
          aria-modal="true"
        >
          <header className="chat-head">
            <div className="chat-head-brand">
              <span className="chat-head-icon" aria-hidden>
                <IconChat />
              </span>
              <div>
                <p className="chat-title">Assistant MW</p>
                <p className="chat-sub">Pays, procedures, delais</p>
              </div>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Fermer le chat"
              onClick={ouvrirFermer}
            >
              <IconClose />
            </button>
          </header>

          <div className="chat-body" ref={bodyRef} aria-live="polite">
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
              id="chat-input"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question..."
              maxLength={500}
              disabled={pending}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              enterKeyHint="send"
              inputMode="text"
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
        onClick={ouvrirFermer}
      >
        {open ? (
          <IconClose />
        ) : (
          <>
            <IconChat />
            <span className="chat-fab-label">Assistant</span>
          </>
        )}
      </button>
    </div>
  );
}
