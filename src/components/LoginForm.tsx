"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions";

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="lbl" htmlFor="email">
          Email
        </label>
        <input
          className="field"
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue="jean.mbarga@relais.cm"
          required
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
          autoComplete="current-password"
          defaultValue="RelaisDemo2026"
          required
        />
      </div>
      {state.error ? <p className="text-sm text-clay">{state.error}</p> : null}
      <button className="btn btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Connexion..." : "Entrer dans Relais"}
      </button>
    </form>
  );
}
