import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { StatusBadge } from "@/components/StatusBadge";
import { principalName } from "@/lib/labels";

export default async function DossiersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const dossiers = await prisma.dossier.findMany({
    where: query
      ? {
          OR: [
            { referenceInterne: { contains: query } },
            { iuc: { contains: query } },
            { numeroDossier: { contains: query } },
            { programme: { contains: query } },
            {
              personnes: {
                some: {
                  OR: [
                    { nom: { contains: query } },
                    { prenom: { contains: query } },
                  ],
                },
              },
            },
          ],
        }
      : undefined,
    include: { personnes: true, conseiller: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <PageFrame
      kicker="Registre"
      title="Dossiers"
      actions={
        <Link href="/dossiers/nouveau" className="btn btn-primary">
          Nouveau dossier
        </Link>
      }
    >
      <form className="mb-6 max-w-md">
        <label className="lbl" htmlFor="q">
          Recherche
        </label>
        <input
          className="field"
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Nom, IUC, reference Relais..."
        />
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Principal</th>
                <th>Programme</th>
                <th>Famille</th>
                <th>Statut</th>
                <th>Conseiller</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link className="link" href={`/dossiers/${d.id}`}>
                      {d.referenceInterne}
                    </Link>
                    {d.numeroDossier ? (
                      <span className="mt-0.5 block text-xs text-sage">
                        {d.numeroDossier}
                      </span>
                    ) : null}
                  </td>
                  <td>{principalName(d.personnes)}</td>
                  <td>{d.programme}</td>
                  <td>{d.personnes.length}</td>
                  <td>
                    <StatusBadge value={d.statut} />
                  </td>
                  <td className="text-sage">{d.conseiller.nom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dossiers.length === 0 ? (
          <p className="px-5 py-8 text-sm text-sage">Aucun dossier.</p>
        ) : null}
      </div>
    </PageFrame>
  );
}
