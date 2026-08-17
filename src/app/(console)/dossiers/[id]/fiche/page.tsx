import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PrintButton } from "@/components/PrintButton";
import { BrandLogo } from "@/components/BrandLogo";
import {
  formatDateTime,
  labelsEvenement,
  labelsRole,
  principalName,
} from "@/lib/labels";

export default async function FichePage({
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
    },
  });
  if (!dossier) notFound();

  const entretien = dossier.evenements.find(
    (e) => e.type === "ENTRETIEN" && e.statut === "PLANIFIE",
  );

  return (
    <div className="mx-auto max-w-2xl bg-white px-10 py-12 print:max-w-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <BrandLogo size={64} />
          <p className="mt-3 text-xs uppercase tracking-widest text-sage">MW Consulting</p>
          <h1 className="mt-2 font-serif text-3xl text-forest">Fiche de convocation</h1>
          <p className="mt-1 text-sm text-sage">{dossier.referenceInterne}</p>
        </div>
        <PrintButton />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs uppercase text-sage">Demandeur</dt>
          <dd className="font-medium">{principalName(dossier.personnes)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-sage">Programme</dt>
          <dd>{dossier.programme}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-sage">IUC</dt>
          <dd>{dossier.iuc ?? "Non renseigne"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-sage">Dossier IRCC</dt>
          <dd>{dossier.numeroDossier ?? "Non renseigne"}</dd>
        </div>
      </dl>

      {entretien ? (
        <section className="mt-8 border border-rule p-4">
          <h2 className="font-serif text-xl text-forest">Rendez-vous</h2>
          <p className="mt-2 text-sm">
            {labelsEvenement[entretien.type]} le {formatDateTime(entretien.dateHeure)}
          </p>
          <p className="text-sm">{entretien.lieu}</p>
          <p className="mt-2 text-sm">
            Se presenter {entretien.arriverMinutesAvant} minutes avant l heure
            indiquee.
          </p>
          {entretien.consignes ? (
            <p className="mt-2 text-sm">{entretien.consignes}</p>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 text-sm text-sage">Aucun entretien planifie.</p>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-xl text-forest">Personnes concernees</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-xs uppercase text-sage">
              <th className="py-2 font-medium">Nom</th>
              <th className="py-2 font-medium">Lien</th>
              <th className="py-2 font-medium">Accompagne</th>
              <th className="py-2 font-medium">Assiste entretien</th>
            </tr>
          </thead>
          <tbody>
            {dossier.personnes.map((p) => (
              <tr key={p.id} className="border-b border-rule">
                <td className="py-2">
                  {p.prenom} {p.nom}
                </td>
                <td className="py-2">{labelsRole[p.roleFamilial]}</td>
                <td className="py-2">{p.accompagne ? "Oui" : "Non"}</td>
                <td className="py-2">{p.doitAssisterEntretien ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-10 text-xs text-sage">
        Document interne d agence. Ne pas deposer tel quel a IRCC. Imprimer via
        le navigateur.
      </p>
    </div>
  );
}
