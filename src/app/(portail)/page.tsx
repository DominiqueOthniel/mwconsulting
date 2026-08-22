import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { NotificationsList } from "@/components/app/NotificationsList";
import { DESTINATIONS, ETAPES_AGENCE } from "@/lib/portail";

function salutation() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon apres-midi";
  return "Bonsoir";
}

export default function HomeAppPage() {
  const featured = DESTINATIONS.slice(0, 6);

  return (
    <AppShell title="Le TGV de l Immigration">
      <section className="app-hero">
        <div className="app-hero-panel">
          <p className="app-kicker">{salutation()}</p>
          <h1 className="app-h1">MW Consulting</h1>
          <p className="app-lead app-lead-on-dark">
            Un pays, une procedure, un accompagnement clair jusqu au rendez-vous.
          </p>
          <div className="app-actions">
            <Link href="/destinations" className="app-btn app-btn-gold">
              Choisir une destination
            </Link>
          </div>
        </div>
      </section>

      <section className="app-block" aria-labelledby="titre-pays">
        <div className="app-block-head">
          <h2 id="titre-pays" className="app-h2">
            Destinations
          </h2>
          <Link href="/destinations" className="app-text-link">
            Tout voir
          </Link>
        </div>
        <div className="app-scroll" role="list">
          {featured.map((d) => (
            <Link
              key={d.slug}
              href={`/pays/${d.slug}`}
              className="app-chip-card"
              role="listitem"
            >
              <span className="app-chip-flag" aria-hidden>
                {d.drapeau}
              </span>
              <span className="app-chip-name">{d.nom}</span>
              <span className="app-chip-meta">{d.procedures.length} procedures</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="app-block" aria-labelledby="titre-alertes">
        <div className="app-block-head">
          <h2 id="titre-alertes" className="app-h2">
            Alertes
          </h2>
          <Link href="/notifications" className="app-text-link">
            Voir tout
          </Link>
        </div>
        <NotificationsList limit={2} />
      </section>

      <section className="app-block" aria-labelledby="titre-parcours">
        <div className="app-block-head">
          <h2 id="titre-parcours" className="app-h2">
            En 4 etapes
          </h2>
        </div>
        <ol className="app-steps">
          {ETAPES_AGENCE.map((etape, i) => (
            <li key={etape.titre} className="app-step">
              <span className="app-step-num" aria-hidden>
                {i + 1}
              </span>
              <div>
                <h3>{etape.titre}</h3>
                <p>{etape.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
