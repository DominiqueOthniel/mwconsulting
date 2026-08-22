"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireSession } from "@/lib/auth";
import { ecrireAudit } from "@/lib/audit";
import { normaliserPays } from "@/lib/pays";

export type ActionState = { error?: string; ok?: boolean };

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Identifiants incorrects." };
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return { error: "Identifiants incorrects." };
    }

    await createSession({
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    const digest =
      error && typeof error === "object" && "digest" in error
        ? String((error as { digest: string }).digest)
        : "";
    if (digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("loginAction", error);
    return { error: "Connexion indisponible pour le moment." };
  }

  redirect("/relais");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

async function prochaineReference() {
  const year = new Date().getFullYear();
  const prefix = `REL-${year}-`;
  const last = await prisma.dossier.findFirst({
    where: { referenceInterne: { startsWith: prefix } },
    orderBy: { referenceInterne: "desc" },
  });
  const n = last ? Number(last.referenceInterne.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(n).padStart(4, "0")}`;
}

export async function creerDossierAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();

  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const programme = String(formData.get("programme") ?? "").trim();
  let paysDestination = String(formData.get("paysDestination") ?? "").trim();
  if (paysDestination === "Autre") {
    paysDestination = String(formData.get("paysDestinationAutre") ?? "").trim();
  }
  paysDestination = normaliserPays(paysDestination) || "Canada";
  const paysResidence = String(formData.get("paysResidence") ?? "Cameroun").trim();
  const dateNaissance = String(formData.get("dateNaissance") ?? "").trim();
  const iuc = String(formData.get("iuc") ?? "").trim();
  const numeroDossier = String(formData.get("numeroDossier") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!prenom || !nom || !programme) {
    return { error: "Prenom, nom et programme sont requis." };
  }

  const referenceInterne = await prochaineReference();

  const dossier = await prisma.dossier.create({
    data: {
      referenceInterne,
      programme,
      paysDestination,
      paysResidence: paysResidence || "Cameroun",
      statut: "BROUILLON",
      iuc: iuc || null,
      numeroDossier: numeroDossier || null,
      notes,
      conseillerId: session.id,
      personnes: {
        create: {
          roleFamilial: "PRINCIPAL",
          prenom,
          nom,
          dateNaissance: dateNaissance || null,
          accompagne: true,
          doitAssisterEntretien: true,
        },
      },
    },
  });

  await ecrireAudit(
    session,
    "CREATION",
    "Dossier",
    dossier.id,
    `Ouverture ${referenceInterne} vers ${paysDestination} pour ${prenom} ${nom}`,
  );

  revalidatePath("/relais");
  revalidatePath("/dossiers");
  redirect(`/dossiers/${dossier.id}`);
}

async function conseillerAccueilId() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
  });
  if (admin) return admin.id;
  const any = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!any) throw new Error("Aucun conseiller disponible");
  return any.id;
}

export async function soumettreDemandePortailAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const dateNaissance = String(formData.get("dateNaissance") ?? "").trim();
  const paysResidence = String(formData.get("paysResidence") ?? "Cameroun").trim();
  const message = String(formData.get("message") ?? "").trim();
  const programme = String(formData.get("programme") ?? "").trim();
  const paysDestination = normaliserPays(
    String(formData.get("paysDestination") ?? "").trim(),
  );

  if (!prenom || !nom || !email || !telephone || !programme || !paysDestination) {
    return {
      error: "Prenom, nom, email, telephone, pays et programme sont requis.",
    };
  }
  if (!email.includes("@")) {
    return { error: "Adresse email invalide." };
  }

  try {
    const referenceInterne = await prochaineReference();
    const conseillerId = await conseillerAccueilId();
    const notes = [
      "Demande recue via le portail public.",
      message ? `Message client: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const dossier = await prisma.dossier.create({
      data: {
        referenceInterne,
        programme,
        paysDestination,
        paysResidence: paysResidence || "Cameroun",
        email,
        telephone,
        source: "PORTAIL",
        statut: "SOUMIS",
        notes,
        conseillerId,
        personnes: {
          create: {
            roleFamilial: "PRINCIPAL",
            prenom,
            nom,
            dateNaissance: dateNaissance || null,
            accompagne: true,
            doitAssisterEntretien: true,
          },
        },
      },
    });

    await ecrireAudit(
      null,
      "CREATION",
      "Dossier",
      dossier.id,
      `Demande portail ${referenceInterne}: ${prenom} ${nom} · ${paysDestination} · ${programme}`,
    );

    revalidatePath("/relais");
    revalidatePath("/dossiers");
    revalidatePath("/demandes");
    redirect(`/demande/merci?ref=${encodeURIComponent(referenceInterne)}`);
  } catch (error) {
    const digest =
      error && typeof error === "object" && "digest" in error
        ? String((error as { digest: string }).digest)
        : "";
    if (digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("soumettreDemandePortailAction", error);
    return { error: "Envoi impossible pour le moment. Reessayez." };
  }
}

export async function prendreEnChargeAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.dossier.update({
    where: { id },
    data: { conseillerId: session.id },
  });
  await ecrireAudit(
    session,
    "MISE_A_JOUR",
    "Dossier",
    id,
    `Prise en charge par ${session.nom}`,
  );
  revalidatePath(`/dossiers/${id}`);
  revalidatePath("/demandes");
  revalidatePath("/relais");
  revalidatePath("/dossiers");
  redirect(`/dossiers/${id}`);
}

export async function majStatutDossierAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "");
  if (!id || !statut) return;

  await prisma.dossier.update({ where: { id }, data: { statut } });
  await ecrireAudit(session, "MISE_A_JOUR", "Dossier", id, `Statut: ${statut}`);
  revalidatePath(`/dossiers/${id}`);
  revalidatePath("/relais");
  revalidatePath("/dossiers");
}

export async function majPaysDestinationAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  let paysDestination = String(formData.get("paysDestination") ?? "").trim();
  if (paysDestination === "Autre") {
    paysDestination = String(formData.get("paysDestinationAutre") ?? "").trim();
  }
  paysDestination = normaliserPays(paysDestination);
  if (!id || !paysDestination) return;

  await prisma.dossier.update({ where: { id }, data: { paysDestination } });
  await ecrireAudit(
    session,
    "MISE_A_JOUR",
    "Dossier",
    id,
    `Pays de destination: ${paysDestination}`,
  );
  revalidatePath(`/dossiers/${id}`);
  revalidatePath(`/dossiers/${id}/fiche`);
  revalidatePath("/relais");
  revalidatePath("/dossiers");
}

export async function majNotesAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (!id) return;

  await prisma.dossier.update({ where: { id }, data: { notes } });
  await ecrireAudit(session, "MISE_A_JOUR", "Dossier", id, "Notes internes mises a jour");
  revalidatePath(`/dossiers/${id}`);
}

export async function ajouterPersonneAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const dossierId = String(formData.get("dossierId") ?? "");
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const roleFamilial = String(formData.get("roleFamilial") ?? "AUTRE");
  const dateNaissance = String(formData.get("dateNaissance") ?? "").trim();
  const accompagne = formData.get("accompagne") === "on";
  const doitAssisterEntretien = formData.get("doitAssisterEntretien") === "on";

  if (!dossierId || !prenom || !nom) {
    return { error: "Prenom et nom requis." };
  }

  const personne = await prisma.personne.create({
    data: {
      dossierId,
      prenom,
      nom,
      roleFamilial,
      dateNaissance: dateNaissance || null,
      accompagne,
      doitAssisterEntretien,
    },
  });

  await ecrireAudit(
    session,
    "CREATION",
    "Personne",
    personne.id,
    `${prenom} ${nom} ajoute au dossier (${roleFamilial})`,
  );

  revalidatePath(`/dossiers/${dossierId}`);
  revalidatePath("/relais");
  return { ok: true };
}

export async function retirerPersonneAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const dossierId = String(formData.get("dossierId") ?? "");
  if (!id) return;

  const personne = await prisma.personne.findUnique({ where: { id } });
  if (!personne || personne.roleFamilial === "PRINCIPAL") return;

  await prisma.personne.delete({ where: { id } });
  await ecrireAudit(
    session,
    "SUPPRESSION",
    "Personne",
    id,
    `${personne.prenom} ${personne.nom} retire du dossier`,
  );
  revalidatePath(`/dossiers/${dossierId}`);
  revalidatePath("/relais");
}

export async function ajouterEvenementAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const dossierId = String(formData.get("dossierId") ?? "");
  const type = String(formData.get("type") ?? "AUTRE");
  const dateHeureRaw = String(formData.get("dateHeure") ?? "");
  const lieu = String(formData.get("lieu") ?? "").trim();
  const consignes = String(formData.get("consignes") ?? "").trim();
  const arriverMinutesAvant = Number(formData.get("arriverMinutesAvant") ?? 30);

  if (!dossierId || !dateHeureRaw || !lieu) {
    return { error: "Date, heure et lieu sont requis." };
  }

  const evenement = await prisma.evenement.create({
    data: {
      dossierId,
      type,
      dateHeure: new Date(dateHeureRaw),
      lieu,
      consignes,
      arriverMinutesAvant: Number.isFinite(arriverMinutesAvant)
        ? arriverMinutesAvant
        : 30,
      statut: "PLANIFIE",
    },
  });

  if (type === "ENTRETIEN") {
    await prisma.dossier.update({
      where: { id: dossierId },
      data: { statut: "ENTRETIEN" },
    });
  }

  await ecrireAudit(
    session,
    "CREATION",
    "Evenement",
    evenement.id,
    `${type} planifie a ${lieu}`,
  );

  revalidatePath(`/dossiers/${dossierId}`);
  revalidatePath("/relais");
  revalidatePath("/agenda");
  return { ok: true };
}

export async function majStatutEvenementAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const dossierId = String(formData.get("dossierId") ?? "");
  const statut = String(formData.get("statut") ?? "");
  if (!id || !statut) return;

  await prisma.evenement.update({ where: { id }, data: { statut } });
  await ecrireAudit(session, "MISE_A_JOUR", "Evenement", id, `Statut evenement: ${statut}`);
  revalidatePath(`/dossiers/${dossierId}`);
  revalidatePath("/agenda");
  revalidatePath("/relais");
}

export async function ajouterEmploiAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const dossierId = String(formData.get("dossierId") ?? "");
  const poste = String(formData.get("poste") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const raisonSociale = String(formData.get("raisonSociale") ?? "").trim();
  const departement = String(formData.get("departement") ?? "").trim();
  const dateEmbauche = String(formData.get("dateEmbauche") ?? "").trim();
  const anciennete = String(formData.get("anciennete") ?? "").trim();
  const niu = String(formData.get("niu") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();

  if (!dossierId || !poste) {
    return { error: "Le poste est requis." };
  }

  const emploi = await prisma.emploi.create({
    data: {
      dossierId,
      poste,
      ville,
      raisonSociale,
      departement: departement || null,
      dateEmbauche: dateEmbauche || null,
      anciennete: anciennete || null,
      niu: niu || null,
      telephone: telephone || null,
    },
  });

  await ecrireAudit(session, "CREATION", "Emploi", emploi.id, `Poste: ${poste}`);
  revalidatePath(`/dossiers/${dossierId}`);
  return { ok: true };
}

export async function ajouterBulletinAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const emploiId = String(formData.get("emploiId") ?? "");
  const dossierId = String(formData.get("dossierId") ?? "");
  const annee = Number(formData.get("annee") ?? 0);
  const periode = String(formData.get("periode") ?? "").trim();
  const dateVisa = String(formData.get("dateVisa") ?? "").trim();
  const salaireBase = Number(formData.get("salaireBase") ?? 0);
  const cnpsRetraite = Number(formData.get("cnpsRetraite") ?? 0);
  const cnpsLogement = Number(formData.get("cnpsLogement") ?? 0);
  const irpp = Number(formData.get("irpp") ?? 0);
  const salaireNet = Number(formData.get("salaireNet") ?? 0);

  if (!emploiId || !periode || !annee || !salaireBase) {
    return { error: "Annee, periode et salaire de base sont requis." };
  }

  const totalDeductions = cnpsRetraite + cnpsLogement + irpp;
  const bulletin = await prisma.bulletinPaie.create({
    data: {
      emploiId,
      annee,
      periode,
      dateVisa: dateVisa || null,
      salaireBase,
      cnpsRetraite,
      cnpsLogement,
      irpp,
      totalDeductions,
      salaireNet: salaireNet || salaireBase - totalDeductions,
    },
  });

  await ecrireAudit(
    session,
    "CREATION",
    "BulletinPaie",
    bulletin.id,
    `Bulletin ${periode} ${annee}`,
  );
  revalidatePath(`/dossiers/${dossierId}`);
  return { ok: true };
}
