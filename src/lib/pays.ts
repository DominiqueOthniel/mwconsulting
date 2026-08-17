export type PaysConfig = {
  nom: string;
  autorite: string;
  identifiant: string;
  numeroDossier: string;
  programmes: string[];
  alerteFamille: string;
  rdvLieu: string;
};

function configGenerique(nom: string): PaysConfig {
  return {
    nom,
    autorite: "Autorite consulaire",
    identifiant: "Identifiant dossier",
    numeroDossier: "Reference dossier",
    programmes: [
      "Visa visiteur",
      "Visa etudes",
      "Visa travail",
      "Residence",
      "Regroupement familial",
      "Autre",
    ],
    alerteFamille:
      "Verifier si conjoint et enfants doivent assister au rendez-vous pour ce pays.",
    rdvLieu: "Consulat, centre de visas, prefecture...",
  };
}

export const PAYS: PaysConfig[] = [
  {
    nom: "Canada",
    autorite: "IRCC",
    identifiant: "IUC",
    numeroDossier: "Numero IRCC",
    programmes: [
      "Residence permanente",
      "Permis d etudes",
      "Permis de travail",
      "Parrainage familial",
      "Super visa",
      "Visa visiteur",
    ],
    alerteFamille:
      "L autorite canadienne exige souvent la presence du conjoint et des enfants, meme s ils n accompagnent pas.",
    rdvLieu: "VAC, bureau IRCC, clinique panel...",
  },
  {
    nom: "France",
    autorite: "France Visas / consulat",
    identifiant: "Numero France Visas",
    numeroDossier: "Numero consulaire",
    programmes: [
      "Visa visiteur",
      "Visa etudiant",
      "Visa talent",
      "Passeport talent",
      "Regroupement familial",
      "Visa visiteur long sejour",
    ],
    alerteFamille:
      "Le consulat peut convoquer toute la famille declaree, y compris les personnes qui ne partent pas.",
    rdvLieu: "TLS Contact, consulat, prefecture...",
  },
  {
    nom: "Etats-Unis",
    autorite: "USCIS / consulat US",
    identifiant: "Case number",
    numeroDossier: "Receipt number",
    programmes: [
      "Visa B1/B2",
      "Visa F1 etudes",
      "Visa H1B travail",
      "Green Card",
      "Visa K1 fiance",
    ],
    alerteFamille:
      "Le consulat americain peut exiger tous les dependants listes au rendez-vous DS-160.",
    rdvLieu: "Ambassade, VAC, consulat...",
  },
  {
    nom: "Allemagne",
    autorite: "Auslanderbehorde / consulat",
    identifiant: "Vorgangsnummer",
    numeroDossier: "Aktenzeichen",
    programmes: [
      "Visa visiteur",
      "Visa etudes",
      "Visa travail",
      "Carte bleue europeenne",
      "Regroupement familial",
    ],
    alerteFamille:
      "L office des etrangers peut demander la presence des membres de famille inscrits au dossier.",
    rdvLieu: "Consulat, VFS, Auslanderbehorde...",
  },
  {
    nom: "Belgique",
    autorite: "Office des etrangers",
    identifiant: "Numero OE",
    numeroDossier: "Reference consulat",
    programmes: [
      "Visa visiteur",
      "Visa etudes",
      "Permis unique travail",
      "Regroupement familial",
    ],
    alerteFamille:
      "L office des etrangers peut convoquer conjoint et enfants meme s ils ne migrent pas.",
    rdvLieu: "TLS, consulat, commune...",
  },
  {
    nom: "Royaume-Uni",
    autorite: "UKVI",
    identifiant: "UAN",
    numeroDossier: "GWF / application",
    programmes: [
      "Visitor visa",
      "Student visa",
      "Skilled Worker",
      "Family visa",
    ],
    alerteFamille:
      "UKVI peut exiger biometrie et entretien pour chaque dependant declare.",
    rdvLieu: "VAC TLS, UKVI...",
  },
  {
    nom: "Italie",
    autorite: "Questura / consulat",
    identifiant: "Codice pratica",
    numeroDossier: "Numero domanda",
    programmes: [
      "Visa visiteur",
      "Visa etudes",
      "Decreto flussi travail",
      "Ricongiungimento familiare",
    ],
    alerteFamille:
      "Le consulat italien peut convoquer tous les membres mentionnes dans la demande.",
    rdvLieu: "Consulat, prenot@mi...",
  },
  {
    nom: "Espagne",
    autorite: "Consulat / extranjeria",
    identifiant: "NIE / numero expediente",
    numeroDossier: "Numero de expediente",
    programmes: [
      "Visa visiteur",
      "Visa etudes",
      "Visa travail",
      "Reagrupacion familiar",
    ],
    alerteFamille:
      "L administration espagnole peut exiger la presence des familiars inclus au dossier.",
    rdvLieu: "BLS, consulat, extranjeria...",
  },
  {
    nom: "Emirats arabes unis",
    autorite: "ICP / GDRFA",
    identifiant: "UID / Emirates ID",
    numeroDossier: "Application ID",
    programmes: [
      "Visa visiteur",
      "Residence travail",
      "Golden Visa",
      "Visa etudes",
    ],
    alerteFamille:
      "L autorite emiratie peut demander medical et biometrie pour chaque dependant.",
    rdvLieu: "Amer, typing center, clinique...",
  },
  {
    nom: "Portugal",
    autorite: "SEF / consulat",
    identifiant: "Numero processo",
    numeroDossier: "Referencia consular",
    programmes: [
      "Visa visiteur",
      "Visa D7",
      "Visa etudes",
      "Regroupement familial",
    ],
    alerteFamille:
      "Le consulat portugais peut convoquer la famille declaree au rendez-vous.",
    rdvLieu: "VFS, consulat, SEF...",
  },
  {
    nom: "Suisse",
    autorite: "SEM / consulat",
    identifiant: "Numero dossier",
    numeroDossier: "Reference SEM",
    programmes: [
      "Visa visiteur",
      "Visa etudes",
      "Permis B travail",
      "Regroupement familial",
    ],
    alerteFamille:
      "Le SEM peut exiger la presence des personnes inscrites au dossier familial.",
    rdvLieu: "Consulat, VFS, canton...",
  },
];

export function configPays(nom: string | null | undefined): PaysConfig {
  const value = (nom ?? "").trim();
  if (!value) return PAYS[0];
  const found = PAYS.find((p) => p.nom.toLowerCase() === value.toLowerCase());
  return found ?? configGenerique(value);
}

export function normaliserPays(nom: string | null | undefined): string {
  const value = (nom ?? "").trim();
  if (!value || value === "Autre") return "";
  const found = PAYS.find((p) => p.nom.toLowerCase() === value.toLowerCase());
  return found?.nom ?? value;
}

export const NOMS_PAYS = PAYS.map((p) => p.nom);

export const PROGRAMMES = Array.from(
  new Set(PAYS.flatMap((p) => p.programmes)),
);
