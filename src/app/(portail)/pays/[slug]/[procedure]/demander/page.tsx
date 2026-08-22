import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { DemandeForm } from "@/components/app/DemandeForm";
import {
  DESTINATIONS,
  destinationParSlug,
  procedureParSlug,
  slugify,
} from "@/lib/portail";

export function generateStaticParams() {
  return DESTINATIONS.flatMap((d) =>
    d.procedures.map((p) => ({
      slug: d.slug,
      procedure: slugify(p.nom),
    })),
  );
}

export default async function DemandePage({
  params,
}: {
  params: Promise<{ slug: string; procedure: string }>;
}) {
  const { slug, procedure: procedureSlug } = await params;
  const destination = destinationParSlug(slug);
  if (!destination) notFound();
  const procedure = procedureParSlug(destination, procedureSlug);
  if (!procedure) notFound();

  return (
    <AppShell
      title="Demarrer mon dossier"
      backHref={`/pays/${destination.slug}/${slugify(procedure.nom)}`}
    >
      <section className="app-page-head">
        <h1 className="app-h1">Demarrer dans l app</h1>
        <p className="app-lead">
          Remplissez vos infos. Votre demande arrive directement chez MW
          Consulting pour traitement.
        </p>
      </section>

      <DemandeForm
        paysDestination={destination.nom}
        programme={procedure.nom}
      />

      <p className="app-muted app-center" style={{ marginTop: 16 }}>
        <Link
          href={`/pays/${destination.slug}/${slugify(procedure.nom)}`}
          className="app-text-link"
        >
          Retour a la procedure
        </Link>
      </p>
    </AppShell>
  );
}
