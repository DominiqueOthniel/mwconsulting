import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { KitConvocation } from "@/components/app/KitConvocation";
import { TgvTrack } from "@/components/app/TgvTrack";
import { requireClientSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatDate,
  formatDateTime,
  labelsEvenement,
  labelsStatut,
  principalName,
} from "@/lib/labels";
import { configPays } from "@/lib/pays";
import {
  briefingDuJour,
  gareCourante,
  kitConvocation,
  messageMailDossier,
  messageWhatsAppDossier,
} from "@/lib/tgv";

export default async function DossierClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireClientSession();
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) notFound();

  const dossier = await prisma.dossier.findFirst({
    where: {
      id,
      OR: [{ clientId: user.id }, { email: user.email, source: "PORTAIL" }],
    },
    include: {
      personnes: true,
      evenements: { orderBy: { dateHeure: "asc" } },
    },
  });

  if (!dossier) notFound();

  const config = configPays(dossier.paysDestination);
  const gare = gareCourante(dossier.statut);
  const prochain = dossier.evenements.find((e) => e.statut === "PLANIFIE");
  const kitType =
    prochain?.type === "BIOMETRIE" ||
    prochain?.type === "MEDICAL" ||
    prochain?.type === "ENTRETIEN"
      ? prochain.type
      : dossier.statut === "BIOMETRIE" ||
          dossier.statut === "MEDICAL" ||
          dossier.statut === "ENTRETIEN"
        ? dossier.statut
        : undefined;
  const kit = kitConvocation(dossier.paysDestination, kitType);
  const briefing = briefingDuJour({
    statut: dossier.statut,
    pays: dossier.paysDestination,
  });
  const shareOpts = {
    reference: dossier.referenceInterne,
    pays: dossier.paysDestination,
    programme: dossier.programme,
    nom: user.nom,
  };

  return (
    <AppShell title={dossier.referenceInterne} backHref="/profil">
      <section className="app-page-head">
        <p className="app-kicker">{dossier.paysDestination}</p>
        <h1 className="app-h1">{principalName(dossier.personnes)}</h1>
        <p className="app-lead">
          {dossier.programme} · {labelsStatut[dossier.statut] ?? dossier.statut}
        </p>
      </section>

      <TgvTrack statut={dossier.statut} />

      <section className="app-briefing">
        <p className="app-kicker">{briefing.kicker}</p>
        <h2 className="app-h2">{briefing.titre}</h2>
        <p>{briefing.texte}</p>
        <p className="app-muted" style={{ marginTop: 10 }}>
          Autorite: {config.autorite} · {config.rdvLieu}
        </p>
      </section>

      {prochain ? (
        <section className="app-rdv-card">
          <p className="app-kicker">Prochain rendez-vous</p>
          <h2 className="app-h2">
            {labelsEvenement[prochain.type] ?? prochain.type}
          </h2>
          <p>{formatDateTime(prochain.dateHeure)}</p>
          <p className="app-muted">{prochain.lieu}</p>
          {prochain.consignes ? (
            <p className="app-rdv-note">{prochain.consignes}</p>
          ) : null}
        </section>
      ) : null}

      <section className="app-profil-section">
        <h2 className="app-h2">Kit pour la gare {gare.nom}</h2>
        <KitConvocation dossierId={dossier.id} items={kit} />
      </section>

      {dossier.evenements.length > 0 ? (
        <section className="app-profil-section">
          <h2 className="app-h2">Calendrier</h2>
          <ul className="app-profil-list">
            {dossier.evenements.map((e) => (
              <li key={e.id} className="app-profil-demande">
                <p className="app-profil-demande-title">
                  {labelsEvenement[e.type] ?? e.type}
                </p>
                <p className="app-muted">
                  {formatDateTime(e.dateHeure)} · {e.lieu}
                </p>
                <p className="app-profil-meta">{e.statut}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="app-profil-section">
        <h2 className="app-h2">Signal a MW</h2>
        <p className="app-muted" style={{ marginBottom: 12 }}>
          Envoye le {formatDate(dossier.createdAt)}. Un message prerempli avec
          votre reference.
        </p>
        <div className="app-actions app-actions-stack">
          <a
            href={messageWhatsAppDossier(shareOpts)}
            className="app-btn app-btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp prerempli
          </a>
          <a href={messageMailDossier(shareOpts)} className="app-btn app-btn-secondary">
            Email prerempli
          </a>
          <Link href="/profil" className="app-btn app-btn-ghost">
            Retour au profil
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
