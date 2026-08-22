import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";

const faqs = [
  {
    q: "Par ou commencer ?",
    a: "Ouvrez Destinations, choisissez un pays, puis une procedure. Ensuite contactez l agence pour ouvrir votre dossier.",
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
          Une question, un doute, un rendez-vous a preparer: ecrivez-nous ou
          passez a l agence.
        </p>
      </section>

      <section className="app-block">
        <div className="app-actions app-actions-stack">
          <a className="app-btn app-btn-primary" href="mailto:contact@mwconsulting.cm">
            Ecrire a MW Consulting
          </a>
          <Link href="/destinations" className="app-btn app-btn-secondary">
            Voir les destinations
          </Link>
        </div>
        <p className="app-muted app-center">Douala · Yaounde · Sur rendez-vous</p>
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
