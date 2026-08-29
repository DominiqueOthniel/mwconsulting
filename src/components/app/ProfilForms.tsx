"use client";

import { useActionState } from "react";
import {
  changerMotDePasseClientAction,
  majProfilClientAction,
  type ActionState,
} from "@/lib/actions";

const initial: ActionState = {};

export function ProfilInfosForm({
  nom,
  email,
  telephone,
}: {
  nom: string;
  email: string;
  telephone: string;
}) {
  const [state, action, pending] = useActionState(majProfilClientAction, initial);

  return (
    <form action={action} className="app-profil-form">
      <div>
        <label className="lbl" htmlFor="nom">
          Nom complet
        </label>
        <input
          className="field"
          id="nom"
          name="nom"
          required
          defaultValue={nom}
          autoComplete="name"
        />
      </div>
      <div>
        <label className="lbl" htmlFor="email">
          Email
        </label>
        <input
          className="field"
          id="email"
          defaultValue={email}
          readOnly
          aria-readonly="true"
        />
        <p className="app-field-hint">L email sert d identifiant et ne change pas.</p>
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
          defaultValue={telephone}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      {state.error ? <p className="app-form-error">{state.error}</p> : null}
      {state.ok ? (
        <p className="app-form-ok">Informations enregistrees.</p>
      ) : null}
      <button
        className="app-btn app-btn-primary app-btn-block"
        type="submit"
        disabled={pending}
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}

export function ProfilMotDePasseForm() {
  const [state, action, pending] = useActionState(
    changerMotDePasseClientAction,
    initial,
  );

  return (
    <form action={action} className="app-profil-form">
      <div>
        <label className="lbl" htmlFor="passwordActuel">
          Mot de passe actuel
        </label>
        <input
          className="field"
          id="passwordActuel"
          name="passwordActuel"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <div>
        <label className="lbl" htmlFor="passwordNouveau">
          Nouveau mot de passe
        </label>
        <input
          className="field"
          id="passwordNouveau"
          name="passwordNouveau"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="lbl" htmlFor="passwordConfirm">
          Confirmer le nouveau
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
      {state.ok ? (
        <p className="app-form-ok">Mot de passe mis a jour.</p>
      ) : null}
      <button
        className="app-btn app-btn-primary app-btn-block"
        type="submit"
        disabled={pending}
      >
        {pending ? "Mise a jour..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}
