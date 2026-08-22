"use client";

import { useActionState } from "react";
import {
  soumettreDemandePortailAction,
  type ActionState,
} from "@/lib/actions";

const initial: ActionState = {};

export function DemandeForm({
  paysDestination,
  programme,
}: {
  paysDestination: string;
  programme: string;
}) {
  const [state, action, pending] = useActionState(
    soumettreDemandePortailAction,
    initial,
  );

  return (
    <form action={action} className="app-demande-form">
      <input type="hidden" name="paysDestination" value={paysDestination} />
      <input type="hidden" name="programme" value={programme} />

      <div className="app-demande-recap">
        <p className="app-kicker">Votre projet</p>
        <p className="app-demande-recap-line">
          <strong>{paysDestination}</strong> · {programme}
        </p>
      </div>

      <div className="app-demande-grid">
        <div>
          <label className="lbl" htmlFor="prenom">
            Prenom
          </label>
          <input className="field" id="prenom" name="prenom" required autoComplete="given-name" />
        </div>
        <div>
          <label className="lbl" htmlFor="nom">
            Nom
          </label>
          <input className="field" id="nom" name="nom" required autoComplete="family-name" />
        </div>
      </div>

      <div>
        <label className="lbl" htmlFor="dateNaissance">
          Date de naissance
        </label>
        <input className="field" id="dateNaissance" name="dateNaissance" type="date" />
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
          autoComplete="tel"
          inputMode="tel"
          placeholder="Ex: +237 6XX XXX XXX"
        />
      </div>

      <div>
        <label className="lbl" htmlFor="paysResidence">
          Pays de residence
        </label>
        <input
          className="field"
          id="paysResidence"
          name="paysResidence"
          defaultValue="Cameroun"
        />
      </div>

      <div>
        <label className="lbl" htmlFor="message">
          Precisions (optionnel)
        </label>
        <textarea
          className="field"
          id="message"
          name="message"
          rows={3}
          placeholder="Situation familiale, delai souhaite, questions..."
        />
      </div>

      {state.error ? <p className="app-form-error">{state.error}</p> : null}

      <button className="app-btn app-btn-primary app-btn-block" type="submit" disabled={pending}>
        {pending ? "Envoi en cours..." : "Soumettre ma demande"}
      </button>
      <p className="app-muted app-center">
        Un conseiller MW Consulting recoit votre dossier dans Relais et vous
        recontacte.
      </p>
    </form>
  );
}
