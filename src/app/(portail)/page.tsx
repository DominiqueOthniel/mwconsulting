import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { SoftCover } from "@/components/app/SoftCover";
import { TemoignagesList } from "@/components/app/TemoignagesList";
import { TgvTrack } from "@/components/app/TgvTrack";
import { AGENCE, anneesExperience } from "@/lib/agence";
import { getSession, isClientRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HERO_IMAGE } from "@/lib/images";
import { DESTINATIONS, ETAPES_AGENCE } from "@/lib/portail";
import { TEMOIGNAGES } from "@/lib/temoignages";
import { gareCourante } from "@/lib/tgv";

function salutation() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon apres-midi";
  return "Bonsoir";
}

export default async function HomeAppPage() {
  const featured = DESTINATIONS.slice(0, 6);
  const session = await getSession();
  const annees = anneesExperience();
  let wagon: {
    id: string;
    statut: string;
    pays: string;
    reference: string;
  } | null = null;

  if (session && isClientRole(session.role)) {
    const d = await prisma.dossier.findFirst({
      where: {
        OR: [
          { clientId: session.id },
          { email: session.email, source: "PORTAIL" },
        ],
        statut: { not: "CLOS" },
      },
      orderBy: { updatedAt: "desc" },
    });
    if (d) {
      wagon = {
        id: d.id,
        statut: d.statut,
        pays: d.paysDestination,
        reference: d.referenceInterne,
      };
    }
  }

  return (
    <AppShell title="Le TGV de l Immigration">
      <section className="app-hero">
        <div className="app-hero-panel">
          <SoftCover src={HERO_IMAGE} priority className="app-media-hero" />
          <div className="app-hero-veil" aria-hidden />
          <div className="app-hero-content">
            <p className="app-kicker">{salutation()}</p>
            <h1 className="app-h1">MW Consulting</h1>
            <p className="app-lead app-lead-on-dark">
              Cabinet d accompagnement aux demarches d immigration, depuis{" "}
              {AGENCE.fondee}, a Douala et Yaounde.
            </p>
            <div className="app-actions">
              <Link href="/boussole" className="app-btn app-btn-gold">
                Evaluer mon projet de voyage
              </Link>
              <Link href="/rendez-vous" className="app-btn app-btn-secondary">
                Prendre un rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="app-proof" aria-label="Preuves de l agence">
        <article>
          <strong>{AGENCE.fondee}</strong>
          <span>Annee de creation</span>
        </article>
        <article>
          <strong>{annees} ans</strong>
          <span>D experience au Cameroun</span>
        </article>
        <article>
          <strong>2 bureaux</strong>
          <span>Douala Akwa · Yaounde Bastos</span>
        </article>
        <article>
          <strong>{AGENCE.destCount} pays</strong>
          <span>Destinations accompagnees</span>
        </article>
      </section>

      <p className="app-proof-legal">
        {AGENCE.forme}. Siege au {AGENCE.paysSiege}. {AGENCE.horaires}
      </p>

      {wagon ? (
        <section className="app-block">
          <div className="app-block-head">
            <h2 className="app-h2">Votre wagon</h2>
            <Link href={`/profil/dossier/${wagon.id}`} className="app-text-link">
              Details
            </Link>
          </div>
          <TgvTrack statut={wagon.statut} compact />
          <p className="app-muted" style={{ marginTop: 10 }}>
            {wagon.reference} · Gare {gareCourante(wagon.statut).nom} ·{" "}
            {wagon.pays}
          </p>
        </section>
      ) : null}

      <section className="app-cta-band" aria-labelledby="titre-cta">
        <h2 id="titre-cta" className="app-h2">
          Par ou commencer ?
        </h2>
        <p className="app-muted">
          Evaluez votre cap en 3 questions, ou venez en agence pour un entretien
          conseil.
        </p>
        <div className="app-actions app-actions-stack">
          <Link href="/boussole" className="app-btn app-btn-primary">
            Evaluer mon projet de voyage
          </Link>
          <Link href="/rendez-vous" className="app-btn app-btn-secondary">
            Prendre un rendez-vous
          </Link>
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
        <div className="app-postcard-grid">
          {featured.map((d) => (
            <Link
              key={d.slug}
              href={`/pays/${d.slug}`}
              className="app-postcard"
            >
              <span className="app-postcard-media">
                <SoftCover
                  src={d.image}
                  sizes="(max-width: 720px) 90vw, 320px"
                  className="app-media-postcard"
                />
                <span className="app-postcard-veil" />
                <span className="app-postcard-flag">{d.drapeau}</span>
              </span>
              <span className="app-postcard-body">
                <span className="app-postcard-name">{d.nom}</span>
                <span className="app-postcard-hook">{d.ambiance}</span>
                <span className="app-postcard-meta">
                  {d.procedures.length} procedures
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="app-block" aria-labelledby="titre-temoins">
        <div className="app-block-head">
          <h2 id="titre-temoins" className="app-h2">
            Dossiers accompagnes
          </h2>
        </div>
        <p className="app-muted" style={{ marginBottom: 14 }}>
          Temoignages de clients, prenoms et villes seulement. Resultats
          individuels, jamais une garantie.
        </p>
        <TemoignagesList items={TEMOIGNAGES.slice(0, 4)} />
      </section>

      <section className="app-block" aria-labelledby="titre-bureaux">
        <h2 id="titre-bureaux" className="app-h2">
          Nos bureaux
        </h2>
        <ul className="app-office-list">
          {AGENCE.bureaux.map((b) => (
            <li key={b.ville} className="app-office-card">
              <strong>
                {b.ville} · {b.quartier}
              </strong>
              <span>{b.detail}</span>
            </li>
          ))}
        </ul>
        <Link href="/rendez-vous" className="app-text-link">
          Reserver un creneau
        </Link>
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
