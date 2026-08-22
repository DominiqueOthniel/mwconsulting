"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  NOTIFICATIONS,
  STORAGE_KEY,
  labelsType,
  type AppNotification,
} from "@/lib/notifications";

function loadLues(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLues(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("mw-notifs"));
}

export function NotificationsList({ limit }: { limit?: number }) {
  const [lues, setLues] = useState<string[]>([]);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    setLues(loadLues());
    setPret(true);
  }, []);

  const items = useMemo(() => {
    const list = [...NOTIFICATIONS];
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [limit]);

  function marquerLue(id: string) {
    if (lues.includes(id)) return;
    const next = [...lues, id];
    setLues(next);
    saveLues(next);
  }

  function toutLire() {
    const next = NOTIFICATIONS.map((n) => n.id);
    setLues(next);
    saveLues(next);
  }

  if (!pret) {
    return <div className="app-skel" aria-hidden />;
  }

  return (
    <div className="app-notif-wrap">
      {!limit ? (
        <div className="app-notif-toolbar">
          <p className="app-muted">
            {NOTIFICATIONS.filter((n) => !lues.includes(n.id)).length} non lue
            {NOTIFICATIONS.filter((n) => !lues.includes(n.id)).length > 1 ? "s" : ""}
          </p>
          <button type="button" className="app-text-btn" onClick={toutLire}>
            Tout marquer lu
          </button>
        </div>
      ) : null}

      <ul className="app-notif-list" role="list">
        {items.map((n) => (
          <NotificationItem
            key={n.id}
            notif={n}
            lue={lues.includes(n.id)}
            onOpen={() => marquerLue(n.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function NotificationItem({
  notif,
  lue,
  onOpen,
}: {
  notif: AppNotification;
  lue: boolean;
  onOpen: () => void;
}) {
  const body = (
    <>
      <div className="app-notif-head">
        <span className={`app-pill app-pill-${notif.type}`}>
          {labelsType(notif.type)}
        </span>
        <time className="app-muted">{notif.quand}</time>
      </div>
      <h3 className="app-notif-title">{notif.titre}</h3>
      <p className="app-notif-msg">{notif.message}</p>
    </>
  );

  if (notif.lien) {
    return (
      <li>
        <Link
          href={notif.lien}
          className={`app-notif ${lue ? "is-read" : "is-unread"}`}
          onClick={onOpen}
        >
          {body}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        className={`app-notif ${lue ? "is-read" : "is-unread"}`}
        onClick={onOpen}
      >
        {body}
      </button>
    </li>
  );
}
