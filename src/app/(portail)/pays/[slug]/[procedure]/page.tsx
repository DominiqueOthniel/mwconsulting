import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { SoftCover } from "@/components/app/SoftCover";
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

export default async function ProcedureAppPage({
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
    <AppShell title={procedure.nom} backHref={`/pays/${destination.slug}`}>
      <section className="app-country-banner">
        <SoftCover src={destination.image} className="app-media-banner" />
        <div className="app-country-veil" aria-hidden />
        <div className="app-country-banner-content">
          <Link href={`/pays/${destination.slug}`} className="app-text-link app-link-on-dark">
            {destination.drapeau} {destination.nom}
          </Link>
          <h1 className="app-h1 app-h1-on-dark">{procedure.nom}</h1>
          <p className="app-lead app-lead-on-dark">{procedure.resume}</p>
          <p className="app-pill app-pill-info">{procedure.delai}</p>
        </div>
      </section>

      <section className="app-block" aria-labelledby="etapes">
        <h2 id="etapes" className="app-h2">
          Etapes typiques
        </h2>
        <ol className="app-steps">
          {procedure.etapes.map((etape, i) => (
            <li key={etape} className="app-step">
              <span className="app-step-num" aria-hidden>
                {i + 1}
              </span>
              <div>
                <h3>Etape {i + 1}</h3>
                <p>{etape}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="app-block">
        <div className="app-actions app-actions-stack">
          <Link
            href={`/pays/${destination.slug}/${slugify(procedure.nom)}/demander`}
            className="app-btn app-btn-primary"
          >
            Demarrer mon dossier
          </Link>
          <Link href="/rendez-vous" className="app-btn app-btn-secondary">
            Prendre un rendez-vous
          </Link>
          <Link
            href={`/pays/${destination.slug}`}
            className="app-btn app-btn-ghost"
          >
            Autres procedures
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
