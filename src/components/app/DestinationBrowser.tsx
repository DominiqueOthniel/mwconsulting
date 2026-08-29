"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SoftCover } from "@/components/app/SoftCover";
import type { DestinationPortail } from "@/lib/portail";

export function DestinationBrowser({
  destinations,
}: {
  destinations: DestinationPortail[];
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return destinations;
    return destinations.filter(
      (d) =>
        d.nom.toLowerCase().includes(needle) ||
        d.accroche.toLowerCase().includes(needle) ||
        d.ambiance.toLowerCase().includes(needle) ||
        d.procedures.some((p) => p.nom.toLowerCase().includes(needle)),
    );
  }, [destinations, q]);

  return (
    <div className="app-browse">
      <label className="app-search" htmlFor="recherche-pays">
        <span className="sr-only">Rechercher un pays ou une procedure</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          id="recherche-pays"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Chercher Canada, etudes, travail..."
          autoComplete="off"
        />
      </label>

      <p className="app-result-count" aria-live="polite">
        {filtered.length} destination{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="app-empty">
          <p>Aucun resultat pour « {q} ».</p>
          <button type="button" className="app-text-btn" onClick={() => setQ("")}>
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="app-postcard-grid">
          {filtered.map((d) => (
            <Link key={d.slug} href={`/pays/${d.slug}`} className="app-postcard">
              <span className="app-postcard-media">
                <SoftCover
                  src={d.image}
                  sizes="(max-width: 720px) 90vw, 320px"
                  className="app-media-postcard"
                />
                <span className="app-postcard-veil" />
                <span className="app-postcard-flag">{d.drapeau}</span>
              </span>
              <span className="app-postcard-body">
                <span className="app-postcard-name">{d.nom}</span>
                <span className="app-postcard-hook">{d.accroche}</span>
                <span className="app-postcard-meta">
                  {d.procedures.length} procedures
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
