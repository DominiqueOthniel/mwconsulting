import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import {
  ProfilInfosForm,
  ProfilMotDePasseForm,
} from "@/components/app/ProfilForms";
import { logoutAction } from "@/lib/actions";
import { requireClientSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatDate,
  formatDateTime,
  labelsEvenement,
  labelsStatut,
} from "@/lib/labels";

export default async function ProfilPage() {
  const session = await requireClientSession();
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return null;
  }

  const demandes = await prisma.dossier.findMany({
    where: {
      OR: [{ clientId: user.id }, { email: user.email, source: "PORTAIL" }],
    },
    include: {
      evenements: {
        where: { statut: "PLANIFIE" },
        orderBy: { dateHeure: "asc" },
        take: 2,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const prenom = user.nom.split(" ")[0] || user.nom;

  return (
    <AppShell title="Mon profil">
      <section className="app-profil-hero">
        <div className="app-profil-avatar" aria-hidden>
          {initiales(user.nom)}
        </div>
        <div>
          <p className="app-kicker">Bonjour</p>
          <h1 className="app-h1">{prenom}</h1>
          <p className="app-muted">{user.email}</p>
        </div>
      </section>

      <section className="app-profil-section" aria-labelledby="titre-demandes">
        <div className="app-block-head">
          <h2 id="titre-demandes" className="app-h2">
            Mes demandes
          </h2>
          <Link href="/destinations" className="app-text-link">
            Nouvelle
          </Link>
        </div>

        {demandes.length === 0 ? (
          <div className="app-profil-empty">
            <p>Aucune demande pour le moment.</p>
            <Link href="/destinations" className="app-btn app-btn-primary">
              Demarrer un dossier
            </Link>
          </div>
        ) : (
          <ul className="app-profil-list">
            {demandes.map((d) => {
              const prochain = d.evenements[0];
              return (
                <li key={d.id} className="app-profil-demande">
                  <div className="app-profil-demande-top">
                    <div>
                      <p className="app-profil-ref">{d.referenceInterne}</p>
                      <p className="app-profil-demande-title">
                        {d.paysDestination}
                      </p>
                      <p className="app-muted">{d.programme}</p>
                    </div>
                    <span className={`app-statut app-statut-${d.statut.toLowerCase()}`}>
                      {labelsStatut[d.statut] ?? d.statut}
                    </span>
                  </div>
                  <p className="app-profil-meta">
                    Envoyee le {formatDate(d.createdAt)}
                  </p>
                  {prochain ? (
                    <p className="app-profil-next">
                      Prochain: {labelsEvenement[prochain.type] ?? prochain.type}{" "}
                      · {formatDateTime(prochain.dateHeure)}
                      {prochain.lieu ? ` · ${prochain.lieu}` : ""}
                    </p>
                  ) : (
                    <p className="app-profil-next app-muted">
                      En attente de traitement par votre conseiller.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="app-profil-section" aria-labelledby="titre-compte">
        <h2 id="titre-compte" className="app-h2">
          Informations du compte
        </h2>
        <ProfilInfosForm
          nom={user.nom}
          email={user.email}
          telephone={user.telephone ?? ""}
        />
      </section>

      <section className="app-profil-section" aria-labelledby="titre-securite">
        <h2 id="titre-securite" className="app-h2">
          Securite
        </h2>
        <p className="app-muted" style={{ marginBottom: 12 }}>
          Changez votre mot de passe regulierement.
        </p>
        <ProfilMotDePasseForm />
      </section>

      <section className="app-profil-section">
        <Link href="/aide" className="app-btn app-btn-secondary app-btn-block">
          Aide et contact
        </Link>
        <form action={logoutAction} style={{ marginTop: 10 }}>
          <button
            type="submit"
            className="app-btn app-btn-ghost app-btn-block"
          >
            Se deconnecter
          </button>
        </form>
      </section>
    </AppShell>
  );
}

function initiales(nom: string) {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
