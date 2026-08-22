import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { StatusBadge } from "@/components/StatusBadge";
import { principalName } from "@/lib/labels";
import { NOMS_PAYS } from "@/lib/pays";

export default async function DossiersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pays?: string }>;
}) {
  const { q, pays } = await searchParams;
  const query = (q ?? "").trim();
  const paysFiltre = (pays ?? "").trim();

  const dossiers = await prisma.dossier.findMany({
    where: {
      AND: [
        paysFiltre ? { paysDestination: paysFiltre } : {},
        query
          ? {
              OR: [
                { referenceInterne: { contains: query } },
                { iuc: { contains: query } },
                { numeroDossier: { contains: query } },
                { programme: { contains: query } },
                { paysDestination: { contains: query } },
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
          : {},
      ],
    },
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
      <form className="mb-6 grid max-w-2xl gap-3 sm:grid-cols-[1fr_200px]">
        <div>
          <label className="lbl" htmlFor="q">
            Recherche
          </label>
          <input
            className="field"
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Nom, identifiant, reference..."
          />
        </div>
        <div>
          <label className="lbl" htmlFor="pays">
            Pays
          </label>
          <select className="field" id="pays" name="pays" defaultValue={paysFiltre}>
            <option value="">Tous</option>
            {NOMS_PAYS.map((nom) => (
              <option key={nom} value={nom}>
                {nom}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button className="btn btn-primary" type="submit">
            Filtrer
          </button>
        </div>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Principal</th>
                <th>Pays</th>
                <th>Programme</th>
                <th>Famille</th>
                <th>Statut</th>
                <th>Conseiller</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((d) => (
                <tr key={d.id}>
                  <td data-label="Reference">
                    <Link className="link" href={`/dossiers/${d.id}`}>
                      {d.referenceInterne}
                    </Link>
                    {d.source === "PORTAIL" ? (
                      <span className="mt-0.5 block text-xs text-leaf">
                        Portail
                      </span>
                    ) : null}
                    {d.numeroDossier ? (
                      <span className="mt-0.5 block text-xs text-sage">
                        {d.numeroDossier}
                      </span>
                    ) : null}
                  </td>
                  <td data-label="Principal">{principalName(d.personnes)}</td>
                  <td data-label="Pays">
                    <span className="chip">{d.paysDestination}</span>
                  </td>
                  <td data-label="Programme">{d.programme}</td>
                  <td data-label="Famille">{d.personnes.length}</td>
                  <td data-label="Statut">
                    <StatusBadge value={d.statut} />
                  </td>
                  <td data-label="Conseiller" className="text-sage">
                    {d.conseiller.nom}
                  </td>
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
