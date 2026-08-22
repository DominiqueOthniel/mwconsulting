export type AppNotification = {
  id: string;
  titre: string;
  message: string;
  type: "info" | "rappel" | "conseil" | "urgent";
  quand: string;
  lien?: string;
};

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    titre: "Preparez vos pieces a l avance",
    message:
      "Passeport valide, acte de naissance et preuves de fonds sont souvent demandes en premier. Demandez la checklist a votre conseiller.",
    type: "conseil",
    quand: "Aujourd hui",
    lien: "/aide",
  },
  {
    id: "n2",
    titre: "Canada: pensez a la famille",
    message:
      "Pour un entretien Canada, conjoint et enfants peuvent etre convoques meme s ils n accompagnent pas la demande.",
    type: "rappel",
    quand: "Hier",
    lien: "/pays/canada",
  },
  {
    id: "n3",
    titre: "Nouveaux parcours France et Allemagne",
    message:
      "Visa etudiant, talent et carte bleue: explorez les procedures mises a jour sur le portail.",
    type: "info",
    quand: "Il y a 2 jours",
    lien: "/destinations",
  },
  {
    id: "n4",
    titre: "Biometrie: arrivez 15 minutes avant",
    message:
      "Les centres de visas (TLS, VFS, VAC) refusent souvent les retards. Gardez votre convocation sous la main.",
    type: "urgent",
    quand: "Il y a 3 jours",
    lien: "/aide",
  },
  {
    id: "n5",
    titre: "Besoin d un conseil rapide ?",
    message:
      "L equipe MW Consulting recoit a Douala et Yaounde sur rendez-vous. Ecrivez-nous pour orienter votre dossier.",
    type: "info",
    quand: "Cette semaine",
    lien: "/aide",
  },
];

export const STORAGE_KEY = "mw_notifications_lues";

export function labelsType(type: AppNotification["type"]) {
  switch (type) {
    case "urgent":
      return "Important";
    case "rappel":
      return "Rappel";
    case "conseil":
      return "Conseil";
    default:
      return "Info";
  }
}
