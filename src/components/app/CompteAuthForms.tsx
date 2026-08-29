"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  connexionClientAction,
  inscriptionClientAction,
  type ActionState,
} from "@/lib/actions";

const initial: ActionState = {};

export function CompteAuthForms({
  modeDefaut = "connexion",
}: {
  modeDefaut?: "connexion" | "inscription";
}) {
  const [mode, setMode] = useState<"connexion" | "inscription">(modeDefaut);

  return (
    <div className="app-compte">
      <div className="app-compte-tabs" role="tablist" aria-label="Compte">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "connexion"}
          className={`app-compte-tab ${mode === "connexion" ? "is-active" : ""}`}
          onClick={() => setMode("connexion")}
        >
          Connexion
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "inscription"}
          className={`app-compte-tab ${mode === "inscription" ? "is-active" : ""}`}
          onClick={() => setMode("inscription")}
        >
          Creer un compte
        </button>
      </div>

      {mode === "connexion" ? <ConnexionForm /> : <InscriptionForm />}

      <p className="app-muted app-center" style={{ marginTop: 16 }}>
        Espace agence Relais ?{" "}
        <Link href="/login" className="app-text-link">
          Connexion equipe
        </Link>
      </p>
    </div>
  );
}

function ConnexionForm() {
  const [state, action, pending] = useActionState(
    connexionClientAction,
    initial,
  );

  return (
    <form action={action} className="app-profil-form">
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
        <label className="lbl" htmlFor="password">
          Mot de passe
        </label>
        <input
          className="field"
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {state.error ? <p className="app-form-error">{state.error}</p> : null}
      <button
        className="app-btn app-btn-primary app-btn-block"
        type="submit"
        disabled={pending}
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

function InscriptionForm() {
  const [state, action, pending] = useActionState(
    inscriptionClientAction,
    initial,
  );

  return (
    <form action={action} className="app-profil-form">
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
            autoComplete="family-name"
          />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="email-ins">
          Email
        </label>
        <input
          className="field"
          id="email-ins"
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
        />
      </div>
      <div>
        <label className="lbl" htmlFor="password-ins">
          Mot de passe
        </label>
        <input
          className="field"
          id="password-ins"
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
      {state.error ? <p className="app-form-error">{state.error}</p> : null}
      <button
        className="app-btn app-btn-primary app-btn-block"
        type="submit"
        disabled={pending}
      >
        {pending ? "Creation..." : "Creer mon compte"}
      </button>
    </form>
  );
}
