import Link from "next/link";
import { notFound } from "next/navigation";
import { PortailShell } from "@/components/PortailShell";
import { DESTINATIONS, destinationParSlug, slugify } from "@/lib/portail";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export default async function PaysPortailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = destinationParSlug(slug);
  if (!destination) notFound();

  return (
    <PortailShell>
      <section className="portail-country-hero">
        <div className="portail-country-hero-inner">
          <Link href="/#destinations" className="portail-back">
            Toutes les destinations
          </Link>
          <p className="portail-country-flag" aria-hidden>
            {destination.drapeau}
          </p>
          <h1 className="portail-hero-brand">{destination.nom}</h1>
          <p className="portail-hero-line">{destination.ambiance}</p>
          <p className="portail-hero-lead">{destination.accroche}</p>
          <p className="portail-country-for">
            Pour qui: {destination.pourQui}
          </p>
        </div>
      </section>

      <section className="portail-section">
        <div className="portail-section-head">
          <p className="portail-kicker">Procedures</p>
          <h2 className="portail-title">
            Ce que nous proposons pour {destination.nom}
          </h2>
          <p className="portail-lead">
            Cliquez une procedure pour voir les etapes typiques. Votre dossier
            sera toujours personnalise avec un conseiller.
          </p>
        </div>
        <div className="portail-proc-list">
          {destination.procedures.map((proc) => (
            <Link
              key={proc.nom}
              href={`/pays/${destination.slug}/${slugify(proc.nom)}`}
              className="portail-proc"
            >
              <div>
                <h3>{proc.nom}</h3>
                <p>{proc.resume}</p>
              </div>
              <div className="portail-proc-side">
                <span className="portail-proc-delai">{proc.delai}</span>
                <span className="portail-proc-go">Voir les etapes</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="portail-section portail-section-alt">
        <div className="portail-contact">
          <div>
            <p className="portail-kicker">Et apres ?</p>
            <h2 className="portail-title">On prepare votre dossier {destination.nom}</h2>
            <p className="portail-lead">
              Un conseiller MW Consulting vous recoit, verifie votre eligibilite
              et construit la checklist adaptee a votre situation.
            </p>
          </div>
          <div className="portail-contact-actions">
            <a className="btn btn-primary" href="mailto:contact@mwconsulting.cm">
              Prendre contact
            </a>
            <Link href="/#destinations" className="btn btn-ghost">
              Autre destination
            </Link>
          </div>
        </div>
      </section>
    </PortailShell>
  );
}
