import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
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
      <section className="app-country">
        <p className="app-country-flag" aria-hidden>
          {destination.drapeau}
        </p>
        <h1 className="app-h1">{destination.nom}</h1>
        <p className="app-lead">{destination.accroche}</p>
        <p className="app-muted">{destination.pourQui}</p>
      </section>

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
          <a className="app-btn app-btn-primary" href="mailto:contact@mwconsulting.cm">
            Demarrer avec un conseiller
          </a>
          <Link href="/destinations" className="app-btn app-btn-secondary">
            Autre pays
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
