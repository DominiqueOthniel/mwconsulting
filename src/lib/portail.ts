import { PAYS } from "@/lib/pays";
import { DEST_GALLERY, DEST_IMAGES, FALLBACK_IMAGE } from "@/lib/images";

export type ProcedurePortail = {
  nom: string;
  resume: string;
  delai: string;
  etapes: string[];
};

export type DestinationPortail = {
  slug: string;
  nom: string;
  drapeau: string;
  image: string;
  gallery: string[];
  accroche: string;
  ambiance: string;
  pourQui: string;
  procedures: ProcedurePortail[];
};

function slugify(nom: string) {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ACCROCHES: Record<string, { accroche: string; ambiance: string; pourQui: string }> = {
  Canada: {
    accroche: "Etudes, travail ou residence permanente, on vous guide jusqu a l entretien.",
    ambiance: "Grands espaces, campuses et opportunites professionnelles.",
    pourQui: "Etudiants, travailleurs qualifies, familles et visiteurs.",
  },
  France: {
    accroche: "Visa etudes, talent ou famille: un parcours clair vers l Europe.",
    ambiance: "Universites, metiers en tension et vie en France.",
    pourQui: "Etudiants, talents, conjoints et visiteurs long sejour.",
  },
  "Etats-Unis": {
    accroche: "Du visa visiteur a la green card, chaque etape est preparee avec vous.",
    ambiance: "Entreprises, campuses et reunions familiales.",
    pourQui: "Visiteurs, etudiants, travailleurs et reunification familiale.",
  },
  Allemagne: {
    accroche: "Visa etudes, travail ou carte bleue: un dossier solide pour Berlin et au dela.",
    ambiance: "Industrie, recherche et qualite de vie europeenne.",
    pourQui: "Ingenieurs, etudiants et familles.",
  },
  Belgique: {
    accroche: "Bruxelles et les regions: permis unique, etudes et regroupement.",
    ambiance: "Institutions europeennes et campus francophones.",
    pourQui: "Etudiants, travailleurs et familles.",
  },
  "Royaume-Uni": {
    accroche: "Student visa, Skilled Worker ou famille: UKVI sans stress.",
    ambiance: "Universites britanniques et metiers en demande.",
    pourQui: "Etudiants, travailleurs qualifies et dependants.",
  },
  Italie: {
    accroche: "Visa etudes, travail ou famille: on prepare votre dossier italien.",
    ambiance: "Universites, decreto flussi et vie mediterraneenne.",
    pourQui: "Etudiants, travailleurs saisonniers et familles.",
  },
  Espagne: {
    accroche: "Visa etudes, travail ou reagrupacion: un accompagnement en francais.",
    ambiance: "Campuses, soleil et opportunites hispanophones.",
    pourQui: "Etudiants, travailleurs et familles.",
  },
  "Emirats arabes unis": {
    accroche: "Residence travail, Golden Visa ou etudes: Dubai et Abu Dhabi accessibles.",
    ambiance: "Hubs internationaux et salaries competitifs.",
    pourQui: "Professionnels, entrepreneurs et familles.",
  },
  Portugal: {
    accroche: "Visa D7, etudes ou famille: une porte douce vers l Europe.",
    ambiance: "Cote atlantique, teletravail et serenite.",
    pourQui: "Independants, etudiants et familles.",
  },
  Suisse: {
    accroche: "Permis B, etudes ou famille: precision helvetique, dossier prepare ici.",
    ambiance: "Salaires eleves, campuses et cantons.",
    pourQui: "Travailleurs qualifies, etudiants et conjoints.",
  },
};

const DELAIS: Record<string, string> = {
  etudes: "Souvent 4 a 12 semaines selon le pays",
  travail: "Souvent 6 a 16 semaines selon le programme",
  famille: "Souvent 3 a 12 mois selon le dossier",
  visiteur: "Souvent 2 a 8 semaines",
  residence: "Souvent plusieurs mois, selon le programme",
};

function categoriser(programme: string): keyof typeof DELAIS {
  const p = programme.toLowerCase();
  if (p.includes("etud") || p.includes("student") || p.includes("f1")) return "etudes";
  if (
    p.includes("travail") ||
    p.includes("worker") ||
    p.includes("talent") ||
    p.includes("h1b") ||
    p.includes("bleu") ||
    p.includes("permis b") ||
    p.includes("golden") ||
    p.includes("flussi")
  )
    return "travail";
  if (
    p.includes("famille") ||
    p.includes("parrain") ||
    p.includes("reagrup") ||
    p.includes("ricongiung") ||
    p.includes("fiance") ||
    p.includes("k1") ||
    p.includes("super visa")
  )
    return "famille";
  if (
    p.includes("residence") ||
    p.includes("permanente") ||
    p.includes("green") ||
    p.includes("d7")
  )
    return "residence";
  return "visiteur";
}

function resumeProcedure(programme: string, pays: string): string {
  const cat = categoriser(programme);
  const map: Record<keyof typeof DELAIS, string> = {
    etudes: `Vous accompagne pour etudier au ${pays}: admission, preuves de fonds et depot du dossier.`,
    travail: `Vous prepare pour travailler au ${pays}: offre, pieces employeur et suivi jusqu a la decision.`,
    famille: `Vous guide pour reunir la famille au ${pays}: pieces d etat civil, preuves de lien et entretiens.`,
    visiteur: `Vous aide a preparer un sejour temporaire au ${pays}: itineraires, fonds et rendez-vous.`,
    residence: `Vous suit sur un projet de vie au ${pays}: eligibilite, pieces et preparation aux entretiens.`,
  };
  return map[cat];
}

function etapesProcedure(programme: string): string[] {
  const cat = categoriser(programme);
  const base = [
    "Entretien conseil pour comprendre votre projet",
    "Liste de pieces personnalisee et checklist",
    "Montage du dossier et controle qualite",
    "Depot aupres de l autorite competente",
    "Preparation biometrie, medical ou entretien",
    "Suivi jusqu a la decision",
  ];
  if (cat === "etudes") {
    return [
      "Choix du programme et verification d admission",
      ...base.slice(1),
    ];
  }
  if (cat === "travail") {
    return [
      "Analyse de l offre et du profil professionnel",
      ...base.slice(1),
    ];
  }
  return base;
}

const DRAPEAUX: Record<string, string> = {
  Canada: "🇨🇦",
  France: "🇫🇷",
  "Etats-Unis": "🇺🇸",
  Allemagne: "🇩🇪",
  Belgique: "🇧🇪",
  "Royaume-Uni": "🇬🇧",
  Italie: "🇮🇹",
  Espagne: "🇪🇸",
  "Emirats arabes unis": "🇦🇪",
  Portugal: "🇵🇹",
  Suisse: "🇨🇭",
};

export const DESTINATIONS: DestinationPortail[] = PAYS.map((pays) => {
  const meta = ACCROCHES[pays.nom] ?? {
    accroche: `Accompagnement complet pour vos demarches vers ${pays.nom}.`,
    ambiance: "Un parcours clair, humain et suivi de bout en bout.",
    pourQui: "Etudiants, travailleurs, familles et visiteurs.",
  };

  return {
    slug: slugify(pays.nom),
    nom: pays.nom,
    drapeau: DRAPEAUX[pays.nom] ?? "🌍",
    image: DEST_IMAGES[pays.nom] ?? FALLBACK_IMAGE,
    gallery: DEST_GALLERY[pays.nom] ?? [DEST_IMAGES[pays.nom] ?? FALLBACK_IMAGE],
    ...meta,
    procedures: pays.programmes.map((nom) => ({
      nom,
      resume: resumeProcedure(nom, pays.nom),
      delai: DELAIS[categoriser(nom)],
      etapes: etapesProcedure(nom),
    })),
  };
});

export const ETAPES_AGENCE = [
  {
    titre: "On ecoute votre projet",
    texte: "Un conseiller comprend votre situation, votre budget et votre destination.",
  },
  {
    titre: "On construit le dossier",
    texte: "Pieces, traductions, preuves: tout est prepare pour l autorite du pays vise.",
  },
  {
    titre: "On vous prepare aux RDV",
    texte: "Biometrie, medical, entretien: vous savez qui vient, ou, et avec quoi.",
  },
  {
    titre: "On reste avec vous",
    texte: "Jusqu a la decision, et pour la suite si la famille doit aussi se presenter.",
  },
];

export function destinationParSlug(slug: string) {
  return DESTINATIONS.find((d) => d.slug === slug) ?? null;
}

export function procedureParSlug(destination: DestinationPortail, procedureSlug: string) {
  return (
    destination.procedures.find(
      (p) => slugify(p.nom) === procedureSlug,
    ) ?? null
  );
}

export { slugify };
