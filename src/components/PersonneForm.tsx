"use client";

import { useActionState } from "react";
import { ajouterPersonneAction, type ActionState } from "@/lib/actions";
import { ROLES_FAMILLE, labelsRole } from "@/lib/labels";

const initial: ActionState = {};

export function PersonneForm({ dossierId }: { dossierId: string }) {
  const [state, action, pending] = useActionState(ajouterPersonneAction, initial);

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="dossierId" value={dossierId} />
      <div>
        <label className="lbl" htmlFor="prenom">
          Prenom
        </label>
        <input className="field" id="prenom" name="prenom" required />
      </div>
      <div>
        <label className="lbl" htmlFor="nom">
          Nom
        </label>
        <input className="field" id="nom" name="nom" required />
      </div>
      <div>
        <label className="lbl" htmlFor="roleFamilial">
          Lien
        </label>
        <select className="field" id="roleFamilial" name="roleFamilial" defaultValue="CONJOINT">
          {ROLES_FAMILLE.filter((r) => r !== "PRINCIPAL").map((role) => (
            <option key={role} value={role}>
              {labelsRole[role]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="dateNaissance">
          Naissance
        </label>
        <input className="field" id="dateNaissance" name="dateNaissance" type="date" />
      </div>
      <label className="check">
        <input type="checkbox" name="accompagne" defaultChecked />
        Accompagne le demandeur
      </label>
      <label className="check">
        <input type="checkbox" name="doitAssisterEntretien" defaultChecked />
        Doit assister a l'entretien
      </label>
      {state.error ? (
        <p className="sm:col-span-2 text-sm text-clay">{state.error}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Ajout..." : "Ajouter a la famille"}
        </button>
      </div>
    </form>
  );
}
