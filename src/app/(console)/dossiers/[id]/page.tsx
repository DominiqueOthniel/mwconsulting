import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { StatusBadge } from "@/components/StatusBadge";
import { PersonneForm } from "@/components/PersonneForm";
import { EvenementForm } from "@/components/EvenementForm";
import { EmploiForm } from "@/components/EmploiForm";
import { BulletinForm } from "@/components/BulletinForm";
import {
  STATUTS,
  STATUTS_EVENEMENT,
  formatDateTime,
  formatFcfa,
  labelsEvenement,
  labelsRole,
  labelsStatut,
  principalName,
} from "@/lib/labels";
import { PaysDestinationSelect } from "@/components/PaysDestinationSelect";
import { configPays } from "@/lib/pays";
import {
  majNotesAction,
  majPaysDestinationAction,
  majStatutDossierAction,
  majStatutEvenementAction,
  prendreEnChargeAction,
  retirerPersonneAction,
} from "@/lib/actions";

export default async function DossierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dossier = await prisma.dossier.findUnique({
    where: { id },
    include: {
      personnes: { orderBy: { createdAt: "asc" } },
      evenements: { orderBy: { dateHeure: "asc" } },
      conseiller: true,
      emplois: { include: { bulletins: { orderBy: { annee: "desc" } } } },
    },
  });

  if (!dossier) notFound();

  const config = configPays(dossier.paysDestination);
  const entretien = dossier.evenements.find(
    (e) => e.type === "ENTRETIEN" && e.statut === "PLANIFIE",
  );
  const nonAccompagnants = dossier.personnes.filter(
    (p) =>
      p.roleFamilial !== "PRINCIPAL" &&
      p.doitAssisterEntretien &&
      !p.accompagne,
  );

  return (
    <PageFrame
      kicker={dossier.referenceInterne}
      title={principalName(dossier.personnes)}
      actions={
        <div className="console-actions">
          {dossier.source === "PORTAIL" ? (
            <form action={prendreEnChargeAction}>
              <input type="hidden" name="id" value={dossier.id} />
              <button className="btn btn-primary" type="submit">
                Prendre en charge
              </button>
            </form>
          ) : null}
          <Link href={`/dossiers/${dossier.id}/fiche`} className="btn btn-ghost">
            Fiche convocation
          </Link>
          <form action={majPaysDestinationAction} className="console-action-row">
            <input type="hidden" name="id" value={dossier.id} />
            <div className="console-action-field">
              <label className="lbl" htmlFor="paysDestination">
                Pays
              </label>
              <PaysDestinationSelect
                value={dossier.paysDestination}
                className="field-inline"
                inline
              />
            </div>
            <button className="btn btn-ghost" type="submit">
              Maj
            </button>
          </form>
          <form action={majStatutDossierAction} className="console-action-row">
            <input type="hidden" name="id" value={dossier.id} />
            <div className="console-action-field">
              <label className="lbl" htmlFor="statut">
                Statut
              </label>
              <select
                className="field-inline"
                id="statut"
                name="statut"
                defaultValue={dossier.statut}
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {labelsStatut[s]}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="submit">
              Maj
            </button>
          </form>
        </div>
      }
    >
      <p className="-mt-5 mb-6 text-sm text-sage">
        {dossier.paysDestination} · {dossier.programme} · {config.autorite} ·{" "}
        {dossier.conseiller.nom}
        {dossier.source === "PORTAIL" ? " · Origine portail" : ""}
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="Destination" value={dossier.paysDestination} />
        <Meta
          label={config.identifiant}
          value={dossier.iuc ?? "Non renseigne"}
        />
        <Meta
          label={config.numeroDossier}
          value={dossier.numeroDossier ?? "Non renseigne"}
        />
        <Meta label="Residence" value={dossier.paysResidence} />
        <Meta label="Email" value={dossier.email ?? "Non renseigne"} />
        <Meta label="Telephone" value={dossier.telephone ?? "Non renseigne"} />
        <Meta
          label="Source"
          value={dossier.source === "PORTAIL" ? "Portail client" : "Relais"}
        />
        <Meta label="Statut" value={labelsStatut[dossier.statut] ?? dossier.statut} />
      </div>

      {entretien && nonAccompagnants.length > 0 ? (
        <div className="alert-clay mb-6">
          <p className="font-medium text-clay">Presence obligatoire a l'entretien</p>
          <p className="mt-1 text-sm text-ink">
            Convocation le {formatDateTime(entretien.dateHeure)} a {entretien.lieu}.
            Les personnes suivantes n'accompagnent pas la demande mais doivent
            assister:{" "}
            {nonAccompagnants.map((p) => `${p.prenom} ${p.nom}`).join(", ")}.
          </p>
          <p className="mt-2 text-sm text-sage">{config.alerteFamille}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-4 font-serif text-xl text-forest">Famille</h2>
          <ul className="mb-6 divide-y divide-rule">
            {dossier.personnes.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">
                    {p.prenom} {p.nom}
                  </p>
                  <p className="text-xs text-sage">
                    {labelsRole[p.roleFamilial]}
                    {p.dateNaissance ? ` · ${p.dateNaissance}` : ""}
                  </p>
                  <p className="mt-1 text-xs">
                    {p.accompagne ? "Accompagne" : "N'accompagne pas"}
                    {p.doitAssisterEntretien ? " · assiste a l'entretien" : ""}
                  </p>
                </div>
                {p.roleFamilial !== "PRINCIPAL" ? (
                  <form action={retirerPersonneAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="dossierId" value={dossier.id} />
                    <button className="btn btn-danger" type="submit">
                      Retirer
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
          <PersonneForm dossierId={dossier.id} />
        </section>

        <section className="card card-pad">
          <h2 className="mb-4 font-serif text-xl text-forest">Echeances</h2>
          <ul className="mb-6 space-y-3">
            {dossier.evenements.length === 0 ? (
              <li className="text-sm text-sage">Aucune echeance.</li>
            ) : (
              dossier.evenements.map((e) => (
                <li key={e.id} className="rounded-md border border-rule p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{labelsEvenement[e.type]}</p>
                    <StatusBadge kind="evenement" value={e.statut} />
                  </div>
                  <p className="text-sm text-sage">
                    {formatDateTime(e.dateHeure)} · {e.lieu}
                  </p>
                  {e.arriverMinutesAvant > 0 ? (
                    <p className="text-xs text-sage">
                      Arrivee {e.arriverMinutesAvant} min avant
                    </p>
                  ) : null}
                  {e.consignes ? (
                    <p className="mt-1 text-sm">{e.consignes}</p>
                  ) : null}
                  <form action={majStatutEvenementAction} className="mt-2 flex gap-2">
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="dossierId" value={dossier.id} />
                    <select
                      className="field-inline"
                      name="statut"
                      defaultValue={e.statut}
                    >
                      {STATUTS_EVENEMENT.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-ghost" type="submit">
                      Maj
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
          <EvenementForm dossierId={dossier.id} lieuPlaceholder={config.rdvLieu} />
        </section>
      </div>

      <section className="card card-pad mt-6">
        <h2 className="mb-1 font-serif text-xl text-forest">Emploi et bulletins</h2>
        <p className="mb-4 text-sm text-sage">
          Preuves d'experience professionnelle pour l'admissibilite. Le nom de
          l'employeur n'est enregistre que s'il figure sur le bulletin.
        </p>
        {dossier.emplois.length === 0 ? (
          <EmploiForm dossierId={dossier.id} />
        ) : (
          dossier.emplois.map((emploi) => (
            <div key={emploi.id}>
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Meta label="Poste" value={emploi.poste} />
                <Meta label="Departement" value={emploi.departement ?? "Non renseigne"} />
                <Meta label="Embauche" value={emploi.dateEmbauche ?? "Non renseigne"} />
                <Meta label="Anciennete" value={emploi.anciennete ?? "Non renseigne"} />
                <Meta label="Ville" value={emploi.ville || "Non renseigne"} />
                <Meta label="NIU" value={emploi.niu ?? "Non renseigne"} />
                <Meta label="Telephone" value={emploi.telephone ?? "Non renseigne"} />
                <Meta
                  label="Employeur"
                  value={emploi.raisonSociale || "Non indique sur le bulletin"}
                />
              </div>
              {emploi.bulletins.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Periode</th>
                        <th>Base</th>
                        <th>CNPS</th>
                        <th>IRPP</th>
                        <th>Deductions</th>
                        <th>Net</th>
                        <th>Visa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emploi.bulletins.map((b) => (
                        <tr key={b.id}>
                          <td data-label="Periode">
                            {b.periode} {b.annee}
                          </td>
                          <td data-label="Base">{formatFcfa(b.salaireBase)}</td>
                          <td data-label="CNPS">
                            {formatFcfa(b.cnpsRetraite + b.cnpsLogement)}
                          </td>
                          <td data-label="IRPP">{formatFcfa(b.irpp)}</td>
                          <td data-label="Deductions">
                            {formatFcfa(b.totalDeductions)}
                          </td>
                          <td data-label="Net">{formatFcfa(b.salaireNet)}</td>
                          <td data-label="Visa">{b.dateVisa ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-sage">Aucun bulletin saisi.</p>
              )}
              <BulletinForm emploiId={emploi.id} dossierId={dossier.id} />
            </div>
          ))
        )}
      </section>

      <section className="card card-pad mt-6">
        <h2 className="mb-3 font-serif text-xl text-forest">Notes internes</h2>
        <form action={majNotesAction}>
          <input type="hidden" name="id" value={dossier.id} />
          <textarea className="field" name="notes" rows={4} defaultValue={dossier.notes} />
          <button className="btn btn-primary mt-3" type="submit">
            Enregistrer les notes
          </button>
        </form>
      </section>
    </PageFrame>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-4 py-3">
      <p className="kicker">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
