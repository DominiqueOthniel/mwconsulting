import Link from "next/link";
import { PortailShell } from "@/components/PortailShell";
import { DESTINATIONS, ETAPES_AGENCE } from "@/lib/portail";

export default function PortailHomePage() {
  return (
    <PortailShell>
      <section className="portail-hero">
        <div className="portail-hero-glow" aria-hidden />
        <div className="portail-hero-inner">
          <p className="portail-kicker animate-rise">Agence d immigration · Cameroun</p>
          <h1 className="portail-hero-brand animate-rise delay-1">
            MW Consulting
          </h1>
          <p className="portail-hero-line animate-rise delay-2">
            Le TGV de l Immigration
          </p>
          <p className="portail-hero-lead animate-rise delay-3">
            Choisissez votre destination. On vous accompagne sur chaque procedure,
            de la premiere piece jusqu au rendez-vous.
          </p>
          <div className="portail-hero-cta animate-rise delay-4">
            <a href="#destinations" className="btn btn-primary">
              Voir les destinations
            </a>
            <a href="#contact" className="btn btn-ghost portail-btn-ghost">
              Parler a un conseiller
            </a>
          </div>
        </div>
      </section>

      <section id="destinations" className="portail-section">
        <div className="portail-section-head">
          <p className="portail-kicker">Destinations</p>
          <h2 className="portail-title">Ou voulez-vous aller ?</h2>
          <p className="portail-lead">
            Chaque pays a ses regles. On vous explique les procedures possibles
            avec un langage simple, sans jargon inutile.
          </p>
        </div>
        <div className="portail-dest-grid">
          {DESTINATIONS.map((d, i) => (
            <Link
              key={d.slug}
              href={`/pays/${d.slug}`}
              className="portail-dest"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <span className="portail-dest-flag" aria-hidden>
                {d.drapeau}
              </span>
              <span className="portail-dest-body">
                <span className="portail-dest-name">{d.nom}</span>
                <span className="portail-dest-hook">{d.accroche}</span>
                <span className="portail-dest-meta">
                  {d.procedures.length} procedures
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="parcours" className="portail-section portail-section-alt">
        <div className="portail-section-head">
          <p className="portail-kicker">Notre methode</p>
          <h2 className="portail-title">Un parcours humain, etape par etape</h2>
          <p className="portail-lead">
            Vous n etes pas seul face aux formulaires. Un conseiller MW vous suit
            jusqu a la decision.
          </p>
        </div>
        <ol className="portail-steps">
          {ETAPES_AGENCE.map((etape, i) => (
            <li key={etape.titre} className="portail-step">
              <span className="portail-step-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{etape.titre}</h3>
                <p>{etape.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className="portail-section">
        <div className="portail-contact">
          <div>
            <p className="portail-kicker">Contact</p>
            <h2 className="portail-title">Pret a demarrer ?</h2>
            <p className="portail-lead">
              Passez a Douala ou Yaounde, ou ecrivez-nous. On vous oriente vers
              la bonne destination et la bonne procedure.
            </p>
          </div>
          <div className="portail-contact-actions">
            <a
              className="btn btn-primary"
              href="mailto:contact@mwconsulting.cm"
            >
              Ecrire a l agence
            </a>
            <p className="portail-contact-note">
              Douala · Yaounde · Sur rendez-vous
            </p>
          </div>
        </div>
      </section>
    </PortailShell>
  );
}
