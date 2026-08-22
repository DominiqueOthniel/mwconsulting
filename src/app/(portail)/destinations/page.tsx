import { AppShell } from "@/components/app/AppShell";
import { DestinationBrowser } from "@/components/app/DestinationBrowser";
import { DESTINATIONS } from "@/lib/portail";

export default function DestinationsPage() {
  return (
    <AppShell title="Destinations">
      <section className="app-page-head">
        <h1 className="app-h1">Ou voulez-vous aller ?</h1>
        <p className="app-lead">
          Tapez un pays ou une procedure. Chaque fiche explique les etapes en
          langage simple.
        </p>
      </section>
      <DestinationBrowser destinations={DESTINATIONS} />
    </AppShell>
  );
}
