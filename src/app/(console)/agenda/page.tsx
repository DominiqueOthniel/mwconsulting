import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatDateTime,
  labelsEvenement,
  principalName,
} from "@/lib/labels";

export default async function AgendaPage() {
  const evenements = await prisma.evenement.findMany({
    include: { dossier: { include: { personnes: true } } },
    orderBy: { dateHeure: "asc" },
  });

  return (
    <PageFrame kicker="Calendrier" title="Agenda">
      <div className="space-y-3">
        {evenements.map((e) => (
          <article
            key={e.id}
            className="card flex flex-wrap items-start justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="kicker">{formatDateTime(e.dateHeure)}</p>
              <h2 className="mt-1 font-serif text-xl text-forest">
                {labelsEvenement[e.type]}
              </h2>
              <p className="text-sm">
                <span className="chip mr-2">{e.dossier.paysDestination}</span>
                <Link className="link" href={`/dossiers/${e.dossierId}`}>
                  {e.dossier.referenceInterne}
                </Link>{" "}
                · {principalName(e.dossier.personnes)}
              </p>
              <p className="text-sm text-sage">{e.lieu}</p>
              {e.consignes ? <p className="mt-1 text-sm">{e.consignes}</p> : null}
            </div>
            <StatusBadge kind="evenement" value={e.statut} />
          </article>
        ))}
        {evenements.length === 0 ? (
          <p className="text-sm text-sage">Aucun evenement.</p>
        ) : null}
      </div>
    </PageFrame>
  );
}
