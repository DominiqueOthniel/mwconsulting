"use client";

import { useActionState } from "react";
import { ajouterEvenementAction, type ActionState } from "@/lib/actions";
import { TYPES_EVENEMENT, labelsEvenement } from "@/lib/labels";

const initial: ActionState = {};

export function EvenementForm({
  dossierId,
  lieuPlaceholder,
}: {
  dossierId: string;
  lieuPlaceholder?: string;
}) {
  const [state, action, pending] = useActionState(ajouterEvenementAction, initial);

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="dossierId" value={dossierId} />
      <div>
        <label className="lbl" htmlFor="type">
          Type
        </label>
        <select className="field" id="type" name="type" defaultValue="ENTRETIEN">
          {TYPES_EVENEMENT.map((type) => (
            <option key={type} value={type}>
              {labelsEvenement[type]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="dateHeure">
          Date et heure
        </label>
        <input className="field" id="dateHeure" name="dateHeure" type="datetime-local" required />
      </div>
      <div className="sm:col-span-2">
        <label className="lbl" htmlFor="lieu">
          Lieu
        </label>
        <input
          className="field"
          id="lieu"
          name="lieu"
          placeholder={lieuPlaceholder ?? "Consulat, VAC, clinique..."}
          required
        />
      </div>
      <div>
        <label className="lbl" htmlFor="arriverMinutesAvant">
          Minutes d'avance
        </label>
        <input
          className="field"
          id="arriverMinutesAvant"
          name="arriverMinutesAvant"
          type="number"
          min={0}
          defaultValue={30}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="lbl" htmlFor="consignes">
          Consignes
        </label>
        <textarea className="field" id="consignes" name="consignes" rows={2} />
      </div>
      {state.error ? (
        <p className="sm:col-span-2 text-sm text-clay">{state.error}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Planifier"}
        </button>
      </div>
    </form>
  );
}
