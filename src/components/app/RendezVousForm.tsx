"use client";

import { useActionState } from "react";
import { prendreRendezVousAction, type ActionState } from "@/lib/actions";
import { NOMS_PAYS } from "@/lib/pays";

const initial: ActionState = {};

export function RendezVousForm({
  prenom,
  nom,
  email,
  telephone,
}: {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
}) {
  const [state, action, pending] = useActionState(
    prendreRendezVousAction,
    initial,
  );

  return (
    <form action={action} className="app-demande-form">
      <div className="app-demande-grid">
        <div>
          <label className="lbl" htmlFor="prenom">
            Prenom
          </label>
          <input
            className="field"
            id="prenom"
            name="prenom"
            required
            defaultValue={prenom ?? ""}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className="lbl" htmlFor="nom">
            Nom
          </label>
          <input
            className="field"
            id="nom"
            name="nom"
            required
            defaultValue={nom ?? ""}
            autoComplete="family-name"
          />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="email">
          Email
        </label>
        <input
          className="field"
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email ?? ""}
          autoComplete="email"
          inputMode="email"
        />
      </div>
      <div>
        <label className="lbl" htmlFor="telephone">
          Telephone / WhatsApp
        </label>
        <input
          className="field"
          id="telephone"
          name="telephone"
          type="tel"
          required
          defaultValue={telephone ?? ""}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      <div>
        <label className="lbl" htmlFor="bureau">
          Bureau
        </label>
        <select className="field" id="bureau" name="bureau" required defaultValue="">
          <option value="" disabled>
            Choisir un bureau
          </option>
          <option value="Douala (Akwa)">Douala, Akwa</option>
          <option value="Yaounde (Bastos)">Yaounde, Bastos</option>
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="creneau">
          Moment souhaite
        </label>
        <select className="field" id="creneau" name="creneau" defaultValue="Matin semaine">
          <option value="Matin semaine">Matin, en semaine</option>
          <option value="Apres-midi semaine">Apres-midi, en semaine</option>
          <option value="Samedi matin">Samedi matin</option>
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="paysDestination">
          Destination visee (si deja choisie)
        </label>
        <select className="field" id="paysDestination" name="paysDestination" defaultValue="Canada">
          {NOMS_PAYS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="message">
          Votre projet en quelques lignes
        </label>
        <textarea
          className="field"
          id="message"
          name="message"
          rows={3}
          placeholder="Etudes, travail, famille, delai, questions..."
        />
      </div>
      {state.error ? <p className="app-form-error">{state.error}</p> : null}
      <button
        className="app-btn app-btn-primary app-btn-block"
        type="submit"
        disabled={pending}
      >
        {pending ? "Envoi..." : "Demander un rendez-vous"}
      </button>
      <p className="app-muted app-center">
        Un conseiller confirme le creneau par telephone ou WhatsApp.
      </p>
    </form>
  );
}
