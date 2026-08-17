"use client";

import { useActionState } from "react";
import { ajouterEmploiAction, type ActionState } from "@/lib/actions";

const initial: ActionState = {};

export function EmploiForm({ dossierId }: { dossierId: string }) {
  const [state, action, pending] = useActionState(ajouterEmploiAction, initial);

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="dossierId" value={dossierId} />
      <div>
        <label className="lbl" htmlFor="poste">
          Poste
        </label>
        <input className="field" id="poste" name="poste" required />
      </div>
      <div>
        <label className="lbl" htmlFor="departement">
          Departement
        </label>
        <input className="field" id="departement" name="departement" />
      </div>
      <div>
        <label className="lbl" htmlFor="dateEmbauche">
          Date d'embauche
        </label>
        <input className="field" id="dateEmbauche" name="dateEmbauche" type="date" />
      </div>
      <div>
        <label className="lbl" htmlFor="anciennete">
          Anciennete
        </label>
        <input className="field" id="anciennete" name="anciennete" />
      </div>
      <div className="sm:col-span-2">
        <label className="lbl" htmlFor="raisonSociale">
          Employeur
        </label>
        <input className="field" id="raisonSociale" name="raisonSociale" />
      </div>
      <div>
        <label className="lbl" htmlFor="ville">
          Ville
        </label>
        <input className="field" id="ville" name="ville" />
      </div>
      <div>
        <label className="lbl" htmlFor="telephone">
          Telephone
        </label>
        <input className="field" id="telephone" name="telephone" />
      </div>
      <div className="sm:col-span-2">
        <label className="lbl" htmlFor="niu">
          NIU
        </label>
        <input className="field" id="niu" name="niu" />
      </div>
      {state.error ? (
        <p className="sm:col-span-2 text-sm text-clay">{state.error}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Ajouter l'emploi"}
        </button>
      </div>
    </form>
  );
}
