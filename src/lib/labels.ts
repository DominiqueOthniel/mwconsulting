export const STATUTS = [
  "BROUILLON",
  "SOUMIS",
  "BIOMETRIE",
  "MEDICAL",
  "ENTRETIEN",
  "DECISION",
  "CLOS",
] as const;

export const ROLES_FAMILLE = ["PRINCIPAL", "CONJOINT", "ENFANT", "AUTRE"] as const;

export const TYPES_EVENEMENT = [
  "ENTRETIEN",
  "BIOMETRIE",
  "MEDICAL",
  "DEPOT",
  "AUTRE",
] as const;

export const STATUTS_EVENEMENT = ["PLANIFIE", "TERMINE", "ANNULE", "MANQUE"] as const;

export const labelsStatut: Record<string, string> = {
  BROUILLON: "Brouillon",
  SOUMIS: "Soumis",
  BIOMETRIE: "Biometrie",
  MEDICAL: "Medical",
  ENTRETIEN: "Entretien",
  DECISION: "Decision",
  CLOS: "Clos",
};

export const labelsRole: Record<string, string> = {
  PRINCIPAL: "Demandeur principal",
  CONJOINT: "Conjoint / conjointe",
  ENFANT: "Enfant",
  AUTRE: "Autre",
};

export const labelsEvenement: Record<string, string> = {
  ENTRETIEN: "Entretien",
  BIOMETRIE: "Biometrie",
  MEDICAL: "Examen medical",
  DEPOT: "Depot",
  AUTRE: "Autre",
};

export const labelsStatutEvenement: Record<string, string> = {
  PLANIFIE: "Planifie",
  TERMINE: "Termine",
  ANNULE: "Annule",
  MANQUE: "Manque",
};

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function principalName(
  personnes: { roleFamilial: string; prenom: string; nom: string }[],
) {
  const principal = personnes.find((p) => p.roleFamilial === "PRINCIPAL");
  if (!principal) return "Dossier sans principal";
  return `${principal.prenom} ${principal.nom}`;
}

export function statutTone(statut: string) {
  if (statut === "ENTRETIEN" || statut === "PLANIFIE") return "clay";
  if (statut === "DECISION" || statut === "TERMINE") return "leaf";
  if (statut === "CLOS" || statut === "ANNULE") return "sage";
  return "forest";
}

export function formatFcfa(n: number) {
  return `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;
}

export { PROGRAMMES } from "@/lib/pays";
