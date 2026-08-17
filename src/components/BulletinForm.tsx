"use client";

import { useActionState } from "react";
import { ajouterBulletinAction, type ActionState } from "@/lib/actions";

const initial: ActionState = {};

export function BulletinForm({
  emploiId,
  dossierId,
}: {
  emploiId: string;
  dossierId: string;
}) {
  const [state, action, pending] = useActionState(ajouterBulletinAction, initial);

  return (
    <form action={action} className="mt-4 grid gap-3 sm:grid-cols-3">
      <input type="hidden" name="emploiId" value={emploiId} />
      <input type="hidden" name="dossierId" value={dossierId} />
      <div>
        <label className="lbl" htmlFor="annee">
          Annee
        </label>
        <input className="field" id="annee" name="annee" type="number" defaultValue={2025} required />
      </div>
      <div>
        <label className="lbl" htmlFor="periode">
          Periode
        </label>
        <input className="field" id="periode" name="periode" placeholder="Juillet" required />
      </div>
      <div>
        <label className="lbl" htmlFor="dateVisa">
          Visa employeur
        </label>
        <input className="field" id="dateVisa" name="dateVisa" type="date" />
      </div>
      <div>
        <label className="lbl" htmlFor="salaireBase">
          Salaire de base
        </label>
        <input className="field" id="salaireBase" name="salaireBase" type="number" required />
      </div>
      <div>
        <label className="lbl" htmlFor="cnpsRetraite">
          CNPS retraite
        </label>
        <input className="field" id="cnpsRetraite" name="cnpsRetraite" type="number" defaultValue={0} />
      </div>
      <div>
        <label className="lbl" htmlFor="cnpsLogement">
          CNPS logement
        </label>
        <input className="field" id="cnpsLogement" name="cnpsLogement" type="number" defaultValue={0} />
      </div>
      <div>
        <label className="lbl" htmlFor="irpp">
          IRPP
        </label>
        <input className="field" id="irpp" name="irpp" type="number" defaultValue={0} />
      </div>
      <div>
        <label className="lbl" htmlFor="salaireNet">
          Net a payer
        </label>
        <input className="field" id="salaireNet" name="salaireNet" type="number" />
      </div>
      {state.error ? (
        <p className="sm:col-span-3 text-sm text-clay">{state.error}</p>
      ) : null}
      <div className="sm:col-span-3">
        <button className="btn btn-ghost" type="submit" disabled={pending}>
          {pending ? "Ajout..." : "Ajouter un bulletin"}
        </button>
      </div>
    </form>
  );
}
