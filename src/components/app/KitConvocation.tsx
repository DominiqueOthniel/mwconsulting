"use client";

import { useEffect, useState } from "react";
import type { KitItem } from "@/lib/tgv";

function storageKey(dossierId: string) {
  return `mw_kit_${dossierId}`;
}

export function KitConvocation({
  dossierId,
  items,
}: {
  dossierId: string;
  items: KitItem[];
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(dossierId));
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [dossierId]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey(dossierId), JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const total = items.length;
  const ok = items.filter((i) => done[i.id]).length;
  const pct = total ? Math.round((ok / total) * 100) : 0;

  return (
    <div className="app-kit">
      <div className="app-kit-head">
        <div>
          <p className="app-kicker">Kit convocation</p>
          <p className="app-kit-progress-label">
            {ok}/{total} prets · {pct}%
          </p>
        </div>
        <div className="app-kit-ring" style={{ ["--p" as string]: `${pct}%` }}>
          <span>{pct}%</span>
        </div>
      </div>
      <ul className="app-kit-list">
        {items.map((item) => (
          <li key={item.id}>
            <label className={`app-kit-item ${done[item.id] ? "is-done" : ""}`}>
              <input
                type="checkbox"
                checked={Boolean(done[item.id])}
                onChange={() => toggle(item.id)}
              />
              <span>
                <strong>{item.label}</strong>
                {item.detail ? <em>{item.detail}</em> : null}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
