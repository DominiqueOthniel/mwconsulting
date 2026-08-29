import { AppShell } from "@/components/app/AppShell";
import { RendezVousForm } from "@/components/app/RendezVousForm";
import { AGENCE } from "@/lib/agence";
import { getSession, isClientRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function RendezVousPage() {
  const session = await getSession();
  let prefill: {
    prenom?: string;
    nom?: string;
    email?: string;
    telephone?: string;
  } = {};

  if (session && isClientRole(session.role)) {
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (user) {
      const parts = user.nom.trim().split(/\s+/);
      prefill = {
        prenom: parts[0] ?? "",
        nom: parts.slice(1).join(" ") || "",
        email: user.email,
        telephone: user.telephone ?? "",
      };
    }
  }

  return (
    <AppShell title="Rendez-vous" backHref="/">
      <section className="app-page-head">
        <p className="app-kicker">Accueil agence</p>
        <h1 className="app-h1">Prendre un rendez-vous</h1>
        <p className="app-lead">
          {AGENCE.forme}. Bureaux a {AGENCE.bureaux.map((b) => b.ville).join(" et ")}.{" "}
          {AGENCE.horaires}
        </p>
      </section>

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

      <RendezVousForm {...prefill} />
    </AppShell>
  );
}
