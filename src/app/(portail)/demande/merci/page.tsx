import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = (ref ?? "").trim();

  return (
    <AppShell title="Demande envoyee">
      <section className="app-merci">
        <p className="app-kicker">C est parti</p>
        <h1 className="app-h1">Demande bien recue</h1>
        <p className="app-lead">
          L equipe MW Consulting va traiter votre dossier dans Relais et vous
          recontacter.
        </p>
        {reference ? (
          <p className="app-merci-ref">
            Reference: <strong>{reference}</strong>
          </p>
        ) : null}
        <p className="app-muted">
          Suivez le statut de votre procedure dans votre profil.
        </p>
        <div className="app-actions app-actions-stack" style={{ marginTop: 24 }}>
          <Link href="/profil" className="app-btn app-btn-primary">
            Voir mon profil
          </Link>
          <Link href="/destinations" className="app-btn app-btn-secondary">
            Voir d autres destinations
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
