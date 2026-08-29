import { DESTINATIONS } from "@/lib/portail";
import { configPays } from "@/lib/pays";

/** Gares du TGV MW: le statut Relais devient une station. */
export const GARES = [
  {
    id: "SOUMIS",
    nom: "Embarquement",
    sousTitre: "Demande recue",
    tip: "Votre wagon est en gare. Un conseiller MW prend bientot le relais.",
  },
  {
    id: "BIOMETRIE",
    nom: "Biometrie",
    sousTitre: "Empreintes et photo",
    tip: "Preparez passeport, convocation VAC/TLS et arrivez 30 min avant.",
  },
  {
    id: "MEDICAL",
    nom: "Medical",
    sousTitre: "Examen panel",
    tip: "Jeune a jeun si demande. Apportez lunettes et carnet de sante.",
  },
  {
    id: "ENTRETIEN",
    nom: "Entretien",
    sousTitre: "Passage au guichet",
    tip: "Revisitez votre parcours, preuves de fonds et composition familiale.",
  },
  {
    id: "DECISION",
    nom: "Decision",
    sousTitre: "Verdict en approche",
    tip: "Surveillez email et profil. Gardez passeport a portee de main.",
  },
  {
    id: "CLOS",
    nom: "Arrivee",
    sousTitre: "Dossier termine",
    tip: "Bravo. Conservez vos pieces pour le sejour et le renouvellement.",
  },
] as const;

export type GareId = (typeof GARES)[number]["id"];

const ORDRE: Record<string, number> = {
  BROUILLON: -1,
  SOUMIS: 0,
  BIOMETRIE: 1,
  MEDICAL: 2,
  ENTRETIEN: 3,
  DECISION: 4,
  CLOS: 5,
};

export function indexGare(statut: string) {
  if (statut in ORDRE) return ORDRE[statut];
  return 0;
}

export function gareCourante(statut: string) {
  const idx = Math.max(0, indexGare(statut));
  return GARES[Math.min(idx, GARES.length - 1)];
}

export function progressionTgv(statut: string) {
  const idx = indexGare(statut);
  if (idx < 0) return 5;
  return Math.round((idx / (GARES.length - 1)) * 100);
}

export function briefingDuJour(opts: {
  statut?: string;
  pays?: string;
  heure?: number;
}) {
  const h = opts.heure ?? new Date().getHours();
  const gare = opts.statut ? gareCourante(opts.statut) : null;
  const config = opts.pays ? configPays(opts.pays) : null;

  if (gare && opts.pays) {
    return {
      kicker: `Gare ${gare.nom}`,
      titre: `${opts.pays} · ${gare.sousTitre}`,
      texte: `${gare.tip}${config ? ` Lieu typique: ${config.rdvLieu}.` : ""}`,
    };
  }

  if (h < 11) {
    return {
      kicker: "Briefing du matin",
      titre: "Le TGV demarre tôt a Douala et Yaounde",
      texte:
        "Choisissez une destination, lancez une demande, puis suivez chaque gare dans votre profil.",
    };
  }
  if (h < 17) {
    return {
      kicker: "Briefing de l apres-midi",
      titre: "Comparez avant de monter a bord",
      texte:
        "La Boussole range les pays selon votre projet. Le Radar montre les delais typiques.",
    };
  }
  return {
    kicker: "Briefing du soir",
    titre: "Preparez les pieces sans stress",
    texte:
      "Passeport, actes d etat civil, bulletins et preuves de fonds: avancez gare par gare.",
  };
}

export type KitItem = { id: string; label: string; detail?: string };

export function kitConvocation(pays: string, type?: string): KitItem[] {
  const config = configPays(pays);
  const base: KitItem[] = [
    {
      id: "passeport",
      label: "Passeport original",
      detail: "Valide, pages libres, photocopie en secours",
    },
    {
      id: "convocation",
      label: "Convocation imprimee ou PDF",
      detail: config.rdvLieu,
    },
    {
      id: "photo",
      label: "Photos d identite recentes",
      detail: "Selon le format du pays",
    },
    {
      id: "fonds",
      label: "Preuves de fonds / revenus",
      detail: "Releves, bulletins, attestation",
    },
    {
      id: "famille",
      label: "Composition familiale",
      detail: config.alerteFamille,
    },
    {
      id: "arrivee",
      label: "Arriver 30 minutes avant",
      detail: "Anticiper circulation Douala / Yaounde",
    },
  ];

  if (type === "BIOMETRIE") {
    return [
      base[0],
      base[1],
      {
        id: "mains",
        label: "Mains propres, sans henna recente",
        detail: "Les empreintes doivent etre lisibles",
      },
      base[5],
    ];
  }
  if (type === "MEDICAL") {
    return [
      base[0],
      base[1],
      {
        id: "jeune",
        label: "Respecter les consignes (jeune, lunettes)",
        detail: "Clinique panel / centre agree",
      },
      base[5],
    ];
  }
  return base;
}

export type ObjectifBoussole = "etudes" | "travail" | "famille" | "visiteur";
export type TempoBoussole = "rapide" | "standard" | "patient";
export type FamilleBoussole = "seul" | "couple" | "enfants";

export type ReponseBoussole = {
  objectif: ObjectifBoussole;
  tempo: TempoBoussole;
  famille: FamilleBoussole;
};

const SCORE_OBJECTIF: Record<ObjectifBoussole, string[]> = {
  etudes: ["etud", "student", "f1"],
  travail: ["travail", "worker", "talent", "h1b", "bleu", "golden", "flussi", "permis"],
  famille: ["famille", "parrain", "reagrup", "ricongiung", "fiance", "k1", "super visa"],
  visiteur: ["visite", "visiteur", "b1", "b2", "schengen"],
};

export function scoriserDestination(
  dest: (typeof DESTINATIONS)[number],
  r: ReponseBoussole,
) {
  let score = 40;
  const raisons: string[] = [];

  const matchProc = dest.procedures.filter((p) => {
    const n = p.nom.toLowerCase();
    return SCORE_OBJECTIF[r.objectif].some((k) => n.includes(k));
  });

  if (matchProc.length > 0) {
    score += 28;
    raisons.push(`Procedure proche: ${matchProc[0].nom}`);
  } else {
    score -= 8;
    raisons.push("Peu de programmes alignes sur votre objectif");
  }

  if (r.tempo === "rapide") {
    if (dest.nom === "Emirats arabes unis" || dest.nom === "France") {
      score += 12;
      raisons.push("Souvent plus reactif selon le programme");
    }
    if (dest.nom === "Canada" || dest.nom === "Etats-Unis") {
      score -= 4;
      raisons.push("Delais parfois longs selon la file");
    }
  }
  if (r.tempo === "patient") {
    if (dest.nom === "Canada" || dest.nom === "Portugal" || dest.nom === "Allemagne") {
      score += 10;
      raisons.push("Bon pour un projet de vie prepare");
    }
  }

  if (r.famille === "enfants" || r.famille === "couple") {
    const config = configPays(dest.nom);
    if (config.alerteFamille.toLowerCase().includes("conjoint")) {
      score += 8;
      raisons.push("Attention particuliere a la composition familiale");
    }
  }

  if (r.objectif === "etudes" && ["Canada", "France", "Allemagne", "Royaume-Uni"].includes(dest.nom)) {
    score += 8;
    raisons.push("Forte offre campus");
  }
  if (r.objectif === "travail" && ["Allemagne", "Emirats arabes unis", "Canada", "Suisse"].includes(dest.nom)) {
    score += 8;
    raisons.push("Marche du travail porteur");
  }

  return {
    destination: dest,
    score: Math.max(12, Math.min(98, score)),
    raisons: raisons.slice(0, 3),
    procedureSuggeree: matchProc[0]?.nom ?? dest.procedures[0]?.nom,
  };
}

export function rangerBoussole(r: ReponseBoussole) {
  return DESTINATIONS.map((d) => scoriserDestination(d, r)).sort(
    (a, b) => b.score - a.score,
  );
}

/** Delai moyen estime en semaines (indicatif, pour le Radar). */
export const RADAR_SEMAINES: Record<
  string,
  Partial<Record<ObjectifBoussole | "residence", number>>
> = {
  Canada: { etudes: 10, travail: 14, famille: 28, visiteur: 6, residence: 40 },
  France: { etudes: 6, travail: 10, famille: 20, visiteur: 4, residence: 24 },
  "Etats-Unis": { etudes: 8, travail: 16, famille: 36, visiteur: 5, residence: 48 },
  Allemagne: { etudes: 8, travail: 12, famille: 22, visiteur: 5, residence: 30 },
  Belgique: { etudes: 7, travail: 11, famille: 20, visiteur: 4, residence: 26 },
  "Royaume-Uni": { etudes: 6, travail: 10, famille: 24, visiteur: 5, residence: 32 },
  Italie: { etudes: 8, travail: 14, famille: 22, visiteur: 5, residence: 28 },
  Espagne: { etudes: 7, travail: 12, famille: 20, visiteur: 4, residence: 26 },
  "Emirats arabes unis": { etudes: 5, travail: 6, famille: 10, visiteur: 3, residence: 12 },
  Portugal: { etudes: 8, travail: 14, famille: 18, visiteur: 5, residence: 22 },
  Suisse: { etudes: 8, travail: 12, famille: 20, visiteur: 5, residence: 28 },
};

export function lignesRadar(objectif: ObjectifBoussole | "residence") {
  const max = Math.max(
    ...DESTINATIONS.map((d) => RADAR_SEMAINES[d.nom]?.[objectif] ?? 12),
  );
  return DESTINATIONS.map((d) => {
    const semaines = RADAR_SEMAINES[d.nom]?.[objectif] ?? 12;
    return {
      destination: d,
      semaines,
      intensite: Math.round((semaines / max) * 100),
    };
  }).sort((a, b) => a.semaines - b.semaines);
}

export function messageWhatsAppDossier(opts: {
  reference: string;
  pays: string;
  programme: string;
  nom: string;
}) {
  const texte = [
    `Bonjour MW Consulting,`,
    `Je suis ${opts.nom}.`,
    `Reference: ${opts.reference}`,
    `Projet: ${opts.pays} · ${opts.programme}`,
    `Je souhaite un point sur mon dossier.`,
  ].join("\n");
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(texte)}`;
}

export function messageMailDossier(opts: {
  reference: string;
  pays: string;
  programme: string;
  nom: string;
}) {
  const sujet = encodeURIComponent(`Dossier ${opts.reference}`);
  const corps = encodeURIComponent(
    [
      `Bonjour MW Consulting,`,
      ``,
      `Je suis ${opts.nom}.`,
      `Reference: ${opts.reference}`,
      `Projet: ${opts.pays} · ${opts.programme}`,
      `Je souhaite un point sur mon dossier.`,
    ].join("\n"),
  );
  return `mailto:contact@mwconsulting.cm?subject=${sujet}&body=${corps}`;
}
