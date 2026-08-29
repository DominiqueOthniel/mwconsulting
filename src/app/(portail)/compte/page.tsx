import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { CompteAuthForms } from "@/components/app/CompteAuthForms";
import { getSession, isClientRole, isStaffRole } from "@/lib/auth";

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const session = await getSession();
  if (session && isClientRole(session.role)) {
    redirect("/profil");
  }
  if (session && isStaffRole(session.role)) {
    redirect("/relais");
  }

  const { mode } = await searchParams;
  const modeDefaut = mode === "inscription" ? "inscription" : "connexion";

  return (
    <AppShell title="Mon compte" backHref="/">
      <section className="app-page-head">
        <h1 className="app-h1">Votre espace</h1>
        <p className="app-lead">
          Suivez vos demandes, le statut de vos procedures et gerez vos
          informations.
        </p>
      </section>

      <CompteAuthForms modeDefaut={modeDefaut} />

      <p className="app-muted app-center" style={{ marginTop: 20 }}>
        Pas encore de projet ?{" "}
        <Link href="/destinations" className="app-text-link">
          Choisir une destination
        </Link>
      </p>
    </AppShell>
  );
}
