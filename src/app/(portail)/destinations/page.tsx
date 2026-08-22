import { AppShell } from "@/components/app/AppShell";
import { DestinationBrowser } from "@/components/app/DestinationBrowser";
import { SoftCover } from "@/components/app/SoftCover";
import { FALLBACK_IMAGE } from "@/lib/images";
import { DESTINATIONS } from "@/lib/portail";

export default function DestinationsPage() {
  return (
    <AppShell title="Destinations">
      <section className="app-page-banner">
        <SoftCover src={FALLBACK_IMAGE} className="app-media-banner" />
        <div className="app-page-banner-veil" aria-hidden />
        <div className="app-page-banner-content">
          <h1 className="app-h1 app-h1-on-dark">Ou voulez-vous aller ?</h1>
          <p className="app-lead app-lead-on-dark">
            Tapez un pays ou une procedure. Chaque fiche explique les etapes en
            langage simple.
          </p>
        </div>
      </section>
      <DestinationBrowser destinations={DESTINATIONS} />
    </AppShell>
  );
}
