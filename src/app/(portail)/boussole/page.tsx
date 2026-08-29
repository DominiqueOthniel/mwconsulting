import { AppShell } from "@/components/app/AppShell";
import { BoussoleWizard } from "@/components/app/BoussoleWizard";

export default function BoussolePage() {
  return (
    <AppShell title="Boussole" backHref="/">
      <section className="app-page-head">
        <p className="app-kicker">Outil MW</p>
        <h1 className="app-h1">Boussole destination</h1>
        <p className="app-lead">
          Trois questions. Un classement personnalise pour trouver votre cap,
          avant meme d ouvrir un dossier.
        </p>
      </section>
      <BoussoleWizard />
    </AppShell>
  );
}
