import Link from "next/link";
import { notFound } from "next/navigation";
import { PortailShell } from "@/components/PortailShell";
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

export default async function ProcedurePortailPage({
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
    <PortailShell>
      <section className="portail-country-hero portail-proc-hero">
        <div className="portail-country-hero-inner">
          <Link href={`/pays/${destination.slug}`} className="portail-back">
            Retour a {destination.nom}
          </Link>
          <p className="portail-kicker">
            {destination.drapeau} {destination.nom}
          </p>
          <h1 className="portail-hero-brand portail-proc-title">
            {procedure.nom}
          </h1>
          <p className="portail-hero-lead">{procedure.resume}</p>
          <p className="portail-proc-badge">{procedure.delai}</p>
        </div>
      </section>

      <section className="portail-section">
        <div className="portail-section-head">
          <p className="portail-kicker">Deroule typique</p>
          <h2 className="portail-title">Les etapes avec MW Consulting</h2>
          <p className="portail-lead">
            Voici le chemin le plus courant. Votre conseiller ajuste chaque
            etape a votre dossier.
          </p>
        </div>
        <ol className="portail-steps">
          {procedure.etapes.map((etape, i) => (
            <li key={etape} className="portail-step">
              <span className="portail-step-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>Etape {i + 1}</h3>
                <p>{etape}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="portail-section portail-section-alt">
        <div className="portail-contact">
          <div>
            <p className="portail-kicker">Demarrer</p>
            <h2 className="portail-title">
              {procedure.nom} · {destination.nom}
            </h2>
            <p className="portail-lead">
              On verifie ensemble si cette procedure vous convient, puis on
              ouvre votre dossier a l agence.
            </p>
          </div>
          <div className="portail-contact-actions">
            <a className="btn btn-primary" href="mailto:contact@mwconsulting.cm">
              Contacter un conseiller
            </a>
            <Link
              href={`/pays/${destination.slug}`}
              className="btn btn-ghost"
            >
              Autres procedures {destination.nom}
            </Link>
          </div>
        </div>
      </section>
    </PortailShell>
  );
}
