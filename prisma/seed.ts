import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type PersonneSeed = {
  roleFamilial: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  sexe: string;
  accompagne: boolean;
  doitAssisterEntretien: boolean;
};

type EvenementSeed = {
  type: string;
  dateHeure: string;
  lieu: string;
  arriverMinutesAvant: number;
  statut: string;
  consignes: string;
};

type EmploiSeed = {
  raisonSociale: string;
  ville: string;
  niu: string | null;
  telephone: string | null;
  poste: string;
  departement: string | null;
  dateEmbauche: string | null;
  anciennete: string | null;
  bulletins: {
    annee: number;
    periode: string;
    dateVisa: string | null;
    salaireBase: number;
    cnpsRetraite: number;
    cnpsLogement: number;
    irpp: number;
    totalDeductions: number;
    salaireNet: number;
  }[];
};

type DossierSeed = {
  referenceInterne: string;
  paysDestination?: string;
  iuc: string | null;
  numeroDossier: string | null;
  programme: string;
  statut: string;
  notes: string;
  conseillerEmail: string;
  personnes: PersonneSeed[];
  evenements: EvenementSeed[];
  emploi?: EmploiSeed;
};

const dossiers: DossierSeed[] = [
  {
    referenceInterne: "REL-2026-0001",
    paysDestination: "Canada",
    iuc: "1122041783",
    numeroDossier: "E004512330",
    programme: "Residence permanente",
    statut: "ENTRETIEN",
    notes:
      "Convocation Dakar recue le 17 aout 2026. Entretien a Yaounde. Conjoint et enfant n'accompagnent pas mais doivent assister.",
    conseillerEmail: "jean.mbarga@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Abena",
        nom: "Fokou",
        dateNaissance: "1992-03-14",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "CONJOINT",
        prenom: "Paul",
        nom: "Fokou",
        dateNaissance: "1989-11-02",
        sexe: "M",
        accompagne: false,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "ENFANT",
        prenom: "Eliane",
        nom: "Fokou",
        dateNaissance: "2018-07-21",
        sexe: "F",
        accompagne: false,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "BIOMETRIE",
        dateHeure: "2026-07-22T10:00:00",
        lieu: "VAC Yaounde",
        arriverMinutesAvant: 15,
        statut: "TERMINE",
        consignes: "Passeport original.",
      },
      {
        type: "ENTRETIEN",
        dateHeure: "2026-09-29T08:30:00",
        lieu: "Bureau IRCC, Yaounde",
        arriverMinutesAvant: 30,
        statut: "PLANIFIE",
        consignes:
          "Se presenter 30 minutes avant. Conjoint et enfant non accompagnants doivent tout de meme assister.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0002",
    paysDestination: "France",
    iuc: "FV-2026-109883",
    numeroDossier: "YDE-771204",
    programme: "Visa etudiant",
    statut: "BIOMETRIE",
    notes:
      "Lettre d'admission Universite Paris-Saclay. Preuve de fonds a completer avant TLS.",
    conseillerEmail: "jean.mbarga@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Samuel",
        nom: "Tchoumi",
        dateNaissance: "2003-01-09",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "BIOMETRIE",
        dateHeure: "2026-08-24T10:00:00",
        lieu: "TLS Contact Yaounde",
        arriverMinutesAvant: 15,
        statut: "PLANIFIE",
        consignes: "Passeport original et convocation TLS.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0003",
    paysDestination: "Canada",
    iuc: "1109928834",
    numeroDossier: "E004601118",
    programme: "Residence permanente",
    statut: "MEDICAL",
    notes: "Examen medical panel physician Douala pour le couple.",
    conseillerEmail: "marie.nana@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Clarisse",
        nom: "Nguemo",
        dateNaissance: "1990-05-30",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "CONJOINT",
        prenom: "Eric",
        nom: "Nguemo",
        dateNaissance: "1988-09-12",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "MEDICAL",
        dateHeure: "2026-08-18T09:00:00",
        lieu: "Clinique panel, Douala",
        arriverMinutesAvant: 20,
        statut: "PLANIFIE",
        consignes: "A jeun. Pieces d'identite de toute la famille accompagnante.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0004",
    paysDestination: "Belgique",
    iuc: null,
    numeroDossier: null,
    programme: "Regroupement familial",
    statut: "SOUMIS",
    notes: "Dossier depose le 2 aout. En attente de l office des etrangers.",
    conseillerEmail: "jean.mbarga@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Herve",
        nom: "Atangana",
        dateNaissance: "1985-12-03",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "CONJOINT",
        prenom: "Sandrine",
        nom: "Atangana",
        dateNaissance: "1987-02-19",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "DEPOT",
        dateHeure: "2026-08-02T11:30:00",
        lieu: "TLS Contact Yaounde",
        arriverMinutesAvant: 0,
        statut: "TERMINE",
        consignes: "",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0005",
    paysDestination: "Canada",
    iuc: "1083345561",
    numeroDossier: "V002118904",
    programme: "Super visa",
    statut: "DECISION",
    notes: "Decision favorable. Passeport a envoyer pour vignette visa.",
    conseillerEmail: "marie.nana@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Therese",
        nom: "Owona",
        dateNaissance: "1961-04-18",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: false,
      },
    ],
    evenements: [
      {
        type: "DEPOT",
        dateHeure: "2026-06-11T14:00:00",
        lieu: "Portail IRCC",
        arriverMinutesAvant: 0,
        statut: "TERMINE",
        consignes: "",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0006",
    paysDestination: "Canada",
    iuc: "1132209981",
    numeroDossier: "E004712880",
    programme: "Residence permanente",
    statut: "ENTRETIEN",
    notes: "Entretien Yaounde. Conjoint reste au Cameroun, presence obligatoire.",
    conseillerEmail: "aisha.bello@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Nadine",
        nom: "Kamga",
        dateNaissance: "1994-08-08",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "CONJOINT",
        prenom: "Martin",
        nom: "Kamga",
        dateNaissance: "1991-01-25",
        sexe: "M",
        accompagne: false,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "ENTRETIEN",
        dateHeure: "2026-09-08T09:00:00",
        lieu: "Bureau IRCC, Yaounde",
        arriverMinutesAvant: 30,
        statut: "PLANIFIE",
        consignes: "Livret de famille et passeports. Martin doit etre present.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0007",
    paysDestination: "Allemagne",
    iuc: "VG-2026-107661",
    numeroDossier: "AB-1445672",
    programme: "Visa travail",
    statut: "BIOMETRIE",
    notes: "Offre emploi Berlin. Biometrie VFS Yaounde cette semaine.",
    conseillerEmail: "jean.mbarga@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Ibrahim",
        nom: "Moussa",
        dateNaissance: "1996-06-11",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "BIOMETRIE",
        dateHeure: "2026-08-19T09:30:00",
        lieu: "VFS Global Yaounde",
        arriverMinutesAvant: 15,
        statut: "PLANIFIE",
        consignes: "Convocation VFS et passeport.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0008",
    paysDestination: "Etats-Unis",
    iuc: "AA00FOTSO118",
    numeroDossier: "YDE2026220118",
    programme: "Visa B1/B2",
    statut: "SOUMIS",
    notes: "Visite famille a Washington, 3 semaines. DS-160 depose.",
    conseillerEmail: "aisha.bello@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Carine",
        nom: "Fotso",
        dateNaissance: "1998-10-04",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: false,
      },
    ],
    evenements: [
      {
        type: "DEPOT",
        dateHeure: "2026-08-12T16:20:00",
        lieu: "Portail CEAC",
        arriverMinutesAvant: 0,
        statut: "TERMINE",
        consignes: "",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0009",
    paysDestination: "Canada",
    iuc: "1140027765",
    numeroDossier: "E004800221",
    programme: "Residence permanente",
    statut: "MEDICAL",
    notes: "Famille de 5. Tous accompagnent. Medical groupe a Yaounde.",
    conseillerEmail: "marie.nana@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Joel",
        nom: "Essomba",
        dateNaissance: "1984-09-17",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "CONJOINT",
        prenom: "Patricia",
        nom: "Essomba",
        dateNaissance: "1986-11-29",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "ENFANT",
        prenom: "Noah",
        nom: "Essomba",
        dateNaissance: "2014-03-03",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "ENFANT",
        prenom: "Ines",
        nom: "Essomba",
        dateNaissance: "2016-12-11",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "ENFANT",
        prenom: "Yanis",
        nom: "Essomba",
        dateNaissance: "2021-05-07",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "MEDICAL",
        dateHeure: "2026-08-21T08:30:00",
        lieu: "Clinique panel, Yaounde",
        arriverMinutesAvant: 20,
        statut: "PLANIFIE",
        consignes: "Toute la famille. Carnets de sante des enfants.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0010",
    paysDestination: "Royaume-Uni",
    iuc: "1115-5677-8200-4412",
    numeroDossier: "GWF08902441",
    programme: "Student visa",
    statut: "SOUMIS",
    notes: "CAS University of Manchester. Attente decision Student visa.",
    conseillerEmail: "aisha.bello@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Blanche",
        nom: "Manga",
        dateNaissance: "2004-02-22",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "BIOMETRIE",
        dateHeure: "2026-08-25T11:15:00",
        lieu: "VAC TLS Douala",
        arriverMinutesAvant: 15,
        statut: "PLANIFIE",
        consignes: "Convocation TLS et passeport.",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0011",
    paysDestination: "Canada",
    iuc: "1058890012",
    numeroDossier: "E004199330",
    programme: "Residence permanente",
    statut: "DECISION",
    notes: "Passeport demande pour visa RP. Client prevenu le 10 aout.",
    conseillerEmail: "jean.mbarga@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Pierre",
        nom: "Ndongo",
        dateNaissance: "1987-07-01",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
      {
        roleFamilial: "CONJOINT",
        prenom: "Alice",
        nom: "Ndongo",
        dateNaissance: "1990-01-16",
        sexe: "F",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "ENTRETIEN",
        dateHeure: "2026-05-19T09:00:00",
        lieu: "Bureau IRCC, Yaounde",
        arriverMinutesAvant: 30,
        statut: "TERMINE",
        consignes: "",
      },
    ],
  },
  {
    referenceInterne: "REL-2026-0012",
    iuc: null,
    numeroDossier: null,
    programme: "Permis d etudes",
    statut: "BROUILLON",
    notes: "Pieces manquantes: releve bancaire 4 mois et lettre de motivation.",
    conseillerEmail: "aisha.bello@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Yannick",
        nom: "Biwole",
        dateNaissance: "2002-11-30",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [],
  },
  {
    referenceInterne: "REL-2026-0013",
    paysDestination: "Canada",
    iuc: null,
    numeroDossier: null,
    programme: "Residence permanente",
    statut: "ENTRETIEN",
    notes:
      "Dossier interne cabinet. Informaticien MW Consulting, departement Informatique, embauche le 17/10/2022. Convocation entretien a Yaounde.",
    conseillerEmail: "rudy.pougom@relais.cm",
    personnes: [
      {
        roleFamilial: "PRINCIPAL",
        prenom: "Rudy Morvan",
        nom: "Pougom Tcheugoue",
        dateNaissance: "",
        sexe: "M",
        accompagne: true,
        doitAssisterEntretien: true,
      },
    ],
    evenements: [
      {
        type: "ENTRETIEN",
        dateHeure: "2026-09-29T08:30:00",
        lieu: "Yaounde, Cameroun",
        arriverMinutesAvant: 30,
        statut: "PLANIFIE",
        consignes:
          "Se presenter 30 minutes avant. Verifier que le nom IRCC correspond au bulletin de paie.",
      },
    ],
    emploi: {
      raisonSociale: "MW CONSULTING",
      ville: "Douala",
      niu: null,
      telephone: null,
      poste: "Informaticien",
      departement: "Informatique",
      dateEmbauche: "2022-10-17",
      anciennete: "2 ans 9 mois (au 07/2025)",
      bulletins: [],
    },
  },
];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.bulletinPaie.deleteMany();
  await prisma.emploi.deleteMany();
  await prisma.evenement.deleteMany();
  await prisma.personne.deleteMany();
  await prisma.dossier.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("RelaisAdmin2026", 10);
  const conseillerHash = await bcrypt.hash("RelaisDemo2026", 10);

  const marie = await prisma.user.create({
    data: {
      nom: "Marie Nana",
      email: "marie.nana@relais.cm",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const jean = await prisma.user.create({
    data: {
      nom: "Jean Mbarga",
      email: "jean.mbarga@relais.cm",
      passwordHash: conseillerHash,
      role: "CONSEILLER",
    },
  });

  const aisha = await prisma.user.create({
    data: {
      nom: "Aisha Bello",
      email: "aisha.bello@relais.cm",
      passwordHash: conseillerHash,
      role: "CONSEILLER",
    },
  });

  const rudy = await prisma.user.create({
    data: {
      nom: "Rudy Morvan Pougom Tcheugoue",
      email: "rudy.pougom@relais.cm",
      passwordHash: conseillerHash,
      role: "ADMIN",
    },
  });

  const byEmail: Record<string, string> = {
    [marie.email]: marie.id,
    [jean.email]: jean.id,
    [aisha.email]: aisha.id,
    [rudy.email]: rudy.id,
  };

  for (const d of dossiers) {
    const created = await prisma.dossier.create({
      data: {
        referenceInterne: d.referenceInterne,
        paysDestination: d.paysDestination ?? "Canada",
        iuc: d.iuc,
        numeroDossier: d.numeroDossier,
        programme: d.programme,
        statut: d.statut,
        notes: d.notes,
        conseillerId: byEmail[d.conseillerEmail],
        personnes: { create: d.personnes },
        evenements: {
          create: d.evenements.map((e) => ({
            type: e.type,
            dateHeure: new Date(e.dateHeure),
            lieu: e.lieu,
            arriverMinutesAvant: e.arriverMinutesAvant,
            statut: e.statut,
            consignes: e.consignes,
          })),
        },
        emplois: d.emploi
          ? {
              create: {
                raisonSociale: d.emploi.raisonSociale,
                ville: d.emploi.ville,
                niu: d.emploi.niu,
                telephone: d.emploi.telephone,
                poste: d.emploi.poste,
                departement: d.emploi.departement,
                dateEmbauche: d.emploi.dateEmbauche,
                anciennete: d.emploi.anciennete,
                bulletins: { create: d.emploi.bulletins },
              },
            }
          : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: byEmail[d.conseillerEmail],
        action: "CREATION",
        entite: "Dossier",
        entiteId: created.id,
        details: `Ouverture ${d.referenceInterne}, ${d.paysDestination ?? "Canada"}, ${d.programme}, ${d.personnes[0].prenom} ${d.personnes[0].nom}`,
      },
    });
  }

  console.log("Seed Relais termine:", dossiers.length, "dossiers");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
