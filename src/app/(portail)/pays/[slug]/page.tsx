import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { SoftCover } from "@/components/app/SoftCover";
import { DESTINATIONS, destinationParSlug, slugify } from "@/lib/portail";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export default async function PaysAppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = destinationParSlug(slug);
  if (!destination) notFound();

  return (
    <AppShell title={destination.nom} backHref="/destinations">
      <section className="app-country-banner">
        <SoftCover src={destination.image} priority className="app-media-banner" />
        <div className="app-country-veil" aria-hidden />
        <div className="app-country-banner-content">
          <p className="app-country-flag" aria-hidden>
            {destination.drapeau}
          </p>
          <h1 className="app-h1 app-h1-on-dark">{destination.nom}</h1>
          <p className="app-lead app-lead-on-dark">{destination.accroche}</p>
        </div>
      </section>

      <p className="app-muted app-country-for">{destination.pourQui}</p>

      <section className="app-block" aria-labelledby="procs">
        <div className="app-block-head">
          <h2 id="procs" className="app-h2">
            Procedures
          </h2>
        </div>
        <ul className="app-proc-list" role="list">
          {destination.procedures.map((proc) => (
            <li key={proc.nom}>
              <Link
                href={`/pays/${destination.slug}/${slugify(proc.nom)}`}
                className="app-proc-row"
              >
                <span className="app-proc-copy">
                  <span className="app-proc-name">{proc.nom}</span>
                  <span className="app-proc-resume">{proc.resume}</span>
                  <span className="app-proc-delai">{proc.delai}</span>
                </span>
                <span className="app-chevron" aria-hidden>
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="app-block">
        <div className="app-actions app-actions-stack">
          <Link
            href={`/pays/${destination.slug}/${slugify(destination.procedures[0].nom)}/demander`}
            className="app-btn app-btn-primary"
          >
            Demarrer mon dossier
          </Link>
          <Link href="/destinations" className="app-btn app-btn-secondary">
            Autre pays
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
