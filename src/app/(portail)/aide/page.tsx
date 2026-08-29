import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";

const faqs = [
  {
    q: "Par ou commencer ?",
    a: "Ouvrez Destinations, choisissez un pays, puis une procedure. Cliquez sur Demarrer mon dossier et envoyez vos infos dans l app.",
  },
  {
    q: "Ou suivre ma demande ?",
    a: "Ouvrez Profil (onglet en bas). Vous y voyez vos demandes, le statut de procedure, vos infos et votre mot de passe.",
  },
  {
    q: "Que se passe-t-il apres l envoi ?",
    a: "Votre demande arrive dans Relais chez MW Consulting. Un conseiller prend en charge et vous recontacte. Le statut se met a jour dans votre profil.",
  },
  {
    q: "Combien de temps ca prend ?",
    a: "Cela depend du pays et du programme. Chaque fiche indique un delai typique. Votre conseiller precisera selon votre cas.",
  },
  {
    q: "Toute la famille doit-elle venir ?",
    a: "Parfois oui, surtout pour le Canada. Lisez les alertes et demandez confirmation a votre conseiller avant le rendez-vous.",
  },
];

export default function AidePage() {
  return (
    <AppShell title="Aide et contact">
      <section className="app-page-head">
        <h1 className="app-h1">On est la pour vous</h1>
        <p className="app-lead">
          Tout se passe dans l app: choix du pays, procedure, puis envoi de votre
          demande a l equipe MW.
        </p>
      </section>

      <section className="app-block">
        <div className="app-actions app-actions-stack">
          <Link href="/rendez-vous" className="app-btn app-btn-primary">
            Prendre un rendez-vous
          </Link>
          <Link href="/boussole" className="app-btn app-btn-secondary">
            Evaluer mon projet
          </Link>
          <Link href="/destinations" className="app-btn app-btn-ghost">
            Choisir une destination
          </Link>
        </div>
        <p className="app-muted app-center">Douala · Yaounde · Suivi dans Relais</p>
      </section>

      <section className="app-block" aria-labelledby="faq">
        <h2 id="faq" className="app-h2">
          Questions frequentes
        </h2>
        <ul className="app-faq" role="list">
          {faqs.map((item) => (
            <li key={item.q} className="app-faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
