import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatDateTime,
  labelsEvenement,
  principalName,
} from "@/lib/labels";

export default async function DashboardPage() {
  const maintenant = new Date();
  const dansSeptJours = new Date(maintenant.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dansDeuxMois = new Date(maintenant.getTime() + 60 * 24 * 60 * 60 * 1000);

  const [total, actifs, semaine, evenements, alertesDossiers] = await Promise.all([
    prisma.dossier.count(),
    prisma.dossier.count({ where: { statut: { not: "CLOS" } } }),
    prisma.evenement.count({
      where: {
        statut: "PLANIFIE",
        dateHeure: { gte: maintenant, lte: dansSeptJours },
      },
    }),
    prisma.evenement.findMany({
      where: {
        statut: "PLANIFIE",
        dateHeure: { gte: maintenant, lte: dansDeuxMois },
      },
      include: { dossier: { include: { personnes: true } } },
      orderBy: { dateHeure: "asc" },
    }),
    prisma.dossier.findMany({
      include: { personnes: true, evenements: true },
    }),
  ]);

  const alertes = alertesDossiers.flatMap((dossier) => {
    const entretien = dossier.evenements.find(
      (e) => e.type === "ENTRETIEN" && e.statut === "PLANIFIE",
    );
    if (!entretien) return [];
    const concernes = dossier.personnes.filter(
      (p) =>
        p.roleFamilial !== "PRINCIPAL" &&
        p.doitAssisterEntretien &&
        !p.accompagne,
    );
    if (concernes.length === 0) return [];
    return [{ dossier, entretien, concernes }];
  });

  return (
    <PageFrame
      kicker="Aujourd'hui"
      title="Tableau de bord"
      actions={
        <Link href="/dossiers/nouveau" className="btn btn-primary">
          Nouveau dossier
        </Link>
      }
    >
      <section className="stat-grid">
        <article className="card stat">
          <p className="kicker">Dossiers</p>
          <p className="stat-value">{total}</p>
          <p className="stat-detail">Tous programmes</p>
        </article>
        <article className="card stat">
          <p className="kicker">Actifs</p>
          <p className="stat-value">{actifs}</p>
          <p className="stat-detail">Hors clos</p>
        </article>
        <article className="card stat">
          <p className="kicker">7 prochains jours</p>
          <p className="stat-value">{semaine}</p>
          <p className="stat-detail">Biometrie, medical, entretien</p>
        </article>
      </section>

      {alertes.length > 0 ? (
        <section className="alert-clay mb-7">
          <h2 className="font-serif text-xl text-clay">Composition familiale</h2>
          <p className="mt-1 text-sm text-sage">
            Conjoint, enfant ou partenaire non accompagnant: IRCC exige souvent
            leur presence a l'entretien.
          </p>
          <ul className="mt-4 space-y-3">
            {alertes.map(({ dossier, entretien, concernes }) => (
              <li key={dossier.id} className="border-t border-rule pt-3 text-sm">
                <Link href={`/dossiers/${dossier.id}`} className="link">
                  {dossier.referenceInterne} · {principalName(dossier.personnes)}
                </Link>
                <p className="muted">
                  {labelsEvenement[entretien.type]} le {formatDateTime(entretien.dateHeure)} ·{" "}
                  {concernes.map((p) => `${p.prenom} ${p.nom}`).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card overflow-hidden">
        <div className="border-b border-rule px-5 py-4">
          <h2 className="font-serif text-xl text-forest">Prochaines convocations</h2>
        </div>
        {evenements.length === 0 ? (
          <p className="px-5 py-8 text-sm text-sage">Rien de planifie.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quand</th>
                  <th>Type</th>
                  <th>Dossier</th>
                  <th>Lieu</th>
                </tr>
              </thead>
              <tbody>
                {evenements.map((e) => (
                  <tr key={e.id}>
                    <td>{formatDateTime(e.dateHeure)}</td>
                    <td>
                      <StatusBadge
                        value={e.type === "ENTRETIEN" ? "ENTRETIEN" : "SOUMIS"}
                      />
                      <span className="ml-2">{labelsEvenement[e.type]}</span>
                    </td>
                    <td>
                      <Link className="link" href={`/dossiers/${e.dossierId}`}>
                        {e.dossier.referenceInterne}
                      </Link>
                      <span className="mt-0.5 block text-sage">
                        {principalName(e.dossier.personnes)}
                      </span>
                    </td>
                    <td>{e.lieu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageFrame>
  );
}
