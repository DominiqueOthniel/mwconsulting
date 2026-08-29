"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  soumettreDemandePortailAction,
  type ActionState,
} from "@/lib/actions";

const initial: ActionState = {};

export type DemandeClientPrefill = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
};

export function DemandeForm({
  paysDestination,
  programme,
  client,
}: {
  paysDestination: string;
  programme: string;
  client?: DemandeClientPrefill | null;
}) {
  const [state, action, pending] = useActionState(
    soumettreDemandePortailAction,
    initial,
  );
  const connecte = Boolean(client);

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

      {connecte ? (
        <p className="app-demande-account">
          Connecte en tant que <strong>{client!.email}</strong>. La demande sera
          visible dans{" "}
          <Link href="/profil" className="app-text-link">
            Mon profil
          </Link>
          .
        </p>
      ) : (
        <p className="app-demande-account">
          Deja un compte ?{" "}
          <Link href="/compte" className="app-text-link">
            Connectez-vous
          </Link>{" "}
          pour retrouver vos demandes.
        </p>
      )}

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
            defaultValue={client?.prenom ?? ""}
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
            defaultValue={client?.nom ?? ""}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div>
        <label className="lbl" htmlFor="dateNaissance">
          Date de naissance
        </label>
        <input className="field" id="dateNaissance" name="dateNaissance" type="date" />
      </div>

      {!connecte ? (
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
      ) : null}

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
          defaultValue={client?.telephone ?? ""}
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

      {!connecte ? (
        <div className="app-demande-securite">
          <p className="app-demande-securite-title">Creer mon espace client</p>
          <p className="app-muted">
            Un compte vous permet de suivre le statut de vos procedures.
          </p>
          <div>
            <label className="lbl" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="field"
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="lbl" htmlFor="passwordConfirm">
              Confirmer le mot de passe
            </label>
            <input
              className="field"
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>
      ) : null}

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
