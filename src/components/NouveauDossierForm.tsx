"use client";

import { useActionState } from "react";
import { creerDossierAction, type ActionState } from "@/lib/actions";
import { PROGRAMMES } from "@/lib/labels";

const initial: ActionState = {};

export function NouveauDossierForm() {
  const [state, action, pending] = useActionState(creerDossierAction, initial);

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="lbl" htmlFor="prenom">
            Prenom du principal
          </label>
          <input className="field" id="prenom" name="prenom" required />
        </div>
        <div>
          <label className="lbl" htmlFor="nom">
            Nom du principal
          </label>
          <input className="field" id="nom" name="nom" required />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="dateNaissance">
          Date de naissance
        </label>
        <input className="field" id="dateNaissance" name="dateNaissance" type="date" />
      </div>
      <div>
        <label className="lbl" htmlFor="programme">
          Programme
        </label>
        <select className="field" id="programme" name="programme" defaultValue="Residence permanente">
          {PROGRAMMES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="lbl" htmlFor="iuc">
            IUC IRCC (optionnel)
          </label>
          <input className="field" id="iuc" name="iuc" />
        </div>
        <div>
          <label className="lbl" htmlFor="numeroDossier">
            Numero de dossier (optionnel)
          </label>
          <input className="field" id="numeroDossier" name="numeroDossier" />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="notes">
          Notes internes
        </label>
        <textarea className="field" id="notes" name="notes" rows={3} />
      </div>
      {state.error ? <p className="text-sm text-clay">{state.error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Creation..." : "Ouvrir le dossier"}
      </button>
    </form>
  );
}
