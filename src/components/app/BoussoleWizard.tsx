"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  rangerBoussole,
  type FamilleBoussole,
  type ObjectifBoussole,
  type TempoBoussole,
} from "@/lib/tgv";
import { slugify } from "@/lib/portail";

const OBJECTIFS: { id: ObjectifBoussole; label: string; hint: string }[] = [
  { id: "etudes", label: "Etudier", hint: "Campus, admission, fonds" },
  { id: "travail", label: "Travailler", hint: "Offre, talent, permis" },
  { id: "famille", label: "Rejoindre la famille", hint: "Parrainage, conjoint" },
  { id: "visiteur", label: "Visiter", hint: "Sejour court, tourisme" },
];

const TEMPOS: { id: TempoBoussole; label: string }[] = [
  { id: "rapide", label: "Le plus vite possible" },
  { id: "standard", label: "Delai raisonnable" },
  { id: "patient", label: "Je prepare un vrai projet" },
];

const FAMILLES: { id: FamilleBoussole; label: string }[] = [
  { id: "seul", label: "Je pars seul(e)" },
  { id: "couple", label: "Avec mon conjoint" },
  { id: "enfants", label: "Avec enfants" },
];

export function BoussoleWizard() {
  const [step, setStep] = useState(0);
  const [objectif, setObjectif] = useState<ObjectifBoussole | null>(null);
  const [tempo, setTempo] = useState<TempoBoussole | null>(null);
  const [famille, setFamille] = useState<FamilleBoussole | null>(null);

  const resultats = useMemo(() => {
    if (!objectif || !tempo || !famille) return [];
    return rangerBoussole({ objectif, tempo, famille }).slice(0, 5);
  }, [objectif, tempo, famille]);

  return (
    <div className="app-boussole">
      <div className="app-boussole-steps" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i <= step ? "is-on" : ""} />
        ))}
      </div>

      {step === 0 ? (
        <section>
          <h2 className="app-h2">Quel est votre cap ?</h2>
          <p className="app-muted">Un objectif, une direction claire.</p>
          <div className="app-boussole-grid">
            {OBJECTIFS.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`app-boussole-card ${objectif === o.id ? "is-active" : ""}`}
                onClick={() => {
                  setObjectif(o.id);
                  setStep(1);
                }}
              >
                <strong>{o.label}</strong>
                <span>{o.hint}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section>
          <h2 className="app-h2">Votre tempo</h2>
          <p className="app-muted">Le Radar tiendra compte de votre patience.</p>
          <div className="app-boussole-stack">
            {TEMPOS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`app-boussole-row ${tempo === t.id ? "is-active" : ""}`}
                onClick={() => {
                  setTempo(t.id);
                  setStep(2);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="app-text-link" onClick={() => setStep(0)}>
            Retour
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section>
          <h2 className="app-h2">Composition du voyage</h2>
          <p className="app-muted">
            Certains pays convoquent toute la famille declaree.
          </p>
          <div className="app-boussole-stack">
            {FAMILLES.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`app-boussole-row ${famille === f.id ? "is-active" : ""}`}
                onClick={() => {
                  setFamille(f.id);
                  setStep(3);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button type="button" className="app-text-link" onClick={() => setStep(1)}>
            Retour
          </button>
        </section>
      ) : null}

      {step === 3 && resultats.length > 0 ? (
        <section>
          <h2 className="app-h2">Votre classement</h2>
          <p className="app-muted">
            Indicatif, pour demarrer la conversation avec MW. Pas une promesse
            d eligibilite.
          </p>
          <ol className="app-boussole-results">
            {resultats.map((r, i) => (
              <li key={r.destination.slug} className="app-boussole-result">
                <div className="app-boussole-result-top">
                  <span className="app-boussole-rank">{i + 1}</span>
                  <div>
                    <p className="app-boussole-name">
                      {r.destination.drapeau} {r.destination.nom}
                    </p>
                    <p className="app-muted">{r.procedureSuggeree}</p>
                  </div>
                  <span className="app-boussole-score">{r.score}</span>
                </div>
                <ul className="app-boussole-raisons">
                  {r.raisons.map((raison) => (
                    <li key={raison}>{raison}</li>
                  ))}
                </ul>
                <div className="app-actions" style={{ marginTop: 12 }}>
                  <Link
                    href={`/pays/${r.destination.slug}`}
                    className="app-btn app-btn-primary"
                  >
                    Voir {r.destination.nom}
                  </Link>
                  {r.procedureSuggeree ? (
                    <Link
                      href={`/pays/${r.destination.slug}/${slugify(r.procedureSuggeree)}/demander`}
                      className="app-btn app-btn-secondary"
                    >
                      Demarrer
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="app-btn app-btn-ghost app-btn-block"
            onClick={() => {
              setStep(0);
              setObjectif(null);
              setTempo(null);
              setFamille(null);
            }}
          >
            Recalculer ma boussole
          </button>
        </section>
      ) : null}
    </div>
  );
}
