import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { StatusBadge } from "@/components/StatusBadge";
import { prendreEnChargeAction } from "@/lib/actions";
import { formatDateTime, principalName } from "@/lib/labels";

export default async function DemandesPage() {
  const demandes = await prisma.dossier.findMany({
    where: {
      source: "PORTAIL",
      statut: { in: ["SOUMIS", "BROUILLON"] },
    },
    include: { personnes: true, conseiller: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageFrame
      kicker="Portail"
      title="Nouvelles demandes"
      actions={
        <Link href="/dossiers" className="btn btn-ghost">
          Tous les dossiers
        </Link>
      }
    >
      <p className="mb-5 max-w-2xl text-sm text-sage">
        Demandes soumises par les clients depuis l app publique. Prenez en
        charge puis continuez le suivi dans le dossier.
      </p>

      {demandes.length === 0 ? (
        <div className="card card-pad">
          <p className="text-sage">Aucune nouvelle demande pour le moment.</p>
        </div>
      ) : (
        <ul className="mobile-card-list">
          {demandes.map((d) => (
            <li key={d.id} className="mobile-card">
              <div className="mobile-card-top">
                <div>
                  <Link href={`/dossiers/${d.id}`} className="link">
                    {d.referenceInterne}
                  </Link>
                  <p className="mt-1 text-xs text-sage">
                    {formatDateTime(d.createdAt)}
                  </p>
                </div>
                <StatusBadge value={d.statut} />
              </div>
              <p className="mobile-card-title">{principalName(d.personnes)}</p>
              <p className="text-sm text-sage">
                <span className="chip mr-2">{d.paysDestination}</span>
                {d.programme}
              </p>
              <p className="mt-2 text-sm">
                {d.telephone}
                <span className="block text-sage">{d.email}</span>
              </p>
              <div className="mobile-card-actions">
                <Link href={`/dossiers/${d.id}`} className="btn btn-ghost">
                  Ouvrir
                </Link>
                <form action={prendreEnChargeAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <button className="btn btn-primary" type="submit">
                    Prendre en charge
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageFrame>
  );
}
