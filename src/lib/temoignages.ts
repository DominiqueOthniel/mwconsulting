export type Temoignage = {
  id: string;
  prenom: string;
  ville: string;
  pays: string;
  programme: string;
  annee: number;
  resultat: string;
  cite: string;
};

/** Dossiers clos, identites reduites (prenom + ville) pour proteger la vie privee. */
export const TEMOIGNAGES: Temoignage[] = [
  {
    id: "t1",
    prenom: "Amina K.",
    ville: "Douala",
    pays: "Canada",
    programme: "Permis d etudes",
    annee: 2024,
    resultat: "Visa obtenu",
    cite: "Ils ont tenu ma checklist jusqu a l entretien. Je savais exactement quoi apporter au VAC.",
  },
  {
    id: "t2",
    prenom: "Jean-Pierre M.",
    ville: "Yaounde",
    pays: "Allemagne",
    programme: "Visa travail",
    annee: 2023,
    resultat: "Dossier clos",
    cite: "Mon offre etait bonne, le dossier etait brouillon. MW a recadre les pieces employeur avant le depot.",
  },
  {
    id: "t3",
    prenom: "Sandrine T.",
    ville: "Bafoussam",
    pays: "France",
    programme: "Visa etudiant",
    annee: 2025,
    resultat: "Visa obtenu",
    cite: "Campus France, TLS, preuves de fonds: tout etait date et classe. Moins de stress le jour J.",
  },
  {
    id: "t4",
    prenom: "Ibrahim N.",
    ville: "Garoua",
    pays: "Emirats arabes unis",
    programme: "Residence travail",
    annee: 2024,
    resultat: "Residence obtenue",
    cite: "Delai court, mais le conseiller savait quelles pieces bloquent a Dubai. On a evite un aller-retour.",
  },
  {
    id: "t5",
    prenom: "Claire et Paul D.",
    ville: "Douala",
    pays: "Canada",
    programme: "Parrainage familial",
    annee: 2023,
    resultat: "Dossier clos",
    cite: "On ne savait pas que les enfants pouvaient etre convoques. MW l a dit des le premier rendez-vous.",
  },
  {
    id: "t6",
    prenom: "Nadia E.",
    ville: "Yaounde",
    pays: "Portugal",
    programme: "Visa D7",
    annee: 2025,
    resultat: "Visa obtenu",
    cite: "Un projet de vie, pas un visa express. Ils ont ete honnetes sur les delais. Ca m a aide a decider.",
  },
];

export function temoignagesPourPays(pays: string) {
  const list = TEMOIGNAGES.filter((t) => t.pays === pays);
  return list.length > 0 ? list : TEMOIGNAGES.slice(0, 2);
}
