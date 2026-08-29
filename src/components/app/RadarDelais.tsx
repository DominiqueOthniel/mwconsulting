"use client";

import Link from "next/link";
import { useState } from "react";
import { lignesRadar, type ObjectifBoussole } from "@/lib/tgv";

const MODES: { id: ObjectifBoussole | "residence"; label: string }[] = [
  { id: "etudes", label: "Etudes" },
  { id: "travail", label: "Travail" },
  { id: "famille", label: "Famille" },
  { id: "visiteur", label: "Visiteur" },
  { id: "residence", label: "Residence" },
];

export function RadarDelais() {
  const [mode, setMode] = useState<ObjectifBoussole | "residence">("etudes");
  const lignes = lignesRadar(mode);

  return (
    <div className="app-radar">
      <div className="app-radar-modes" role="tablist" aria-label="Type de projet">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            className={`app-radar-mode ${mode === m.id ? "is-active" : ""}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="app-muted app-radar-note">
        Delais typiques en semaines, a titre indicatif. Votre conseiller precisera
        selon votre dossier.
      </p>

      <ul className="app-radar-list">
        {lignes.map((l, i) => (
          <li key={l.destination.slug} className="app-radar-row">
            <div className="app-radar-row-top">
              <span className="app-radar-pos">{i + 1}</span>
              <Link href={`/pays/${l.destination.slug}`} className="app-radar-link">
                {l.destination.drapeau} {l.destination.nom}
              </Link>
              <strong>{l.semaines} sem.</strong>
            </div>
            <div className="app-radar-bar" aria-hidden>
              <span style={{ width: `${Math.max(12, 100 - l.intensite + 20)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
