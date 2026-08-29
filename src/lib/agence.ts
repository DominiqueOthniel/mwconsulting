export const AGENCE = {
  nom: "MW Consulting",
  slogan: "Le TGV de l Immigration",
  fondee: 2018,
  forme: "Cabinet d accompagnement aux demarches d immigration",
  villes: ["Douala", "Yaounde"],
  paysSiege: "Cameroun",
  destCount: 11,
  horaires: "Lun a ven, 8h30 a 17h. Samedi matin sur rendez-vous.",
  email: "contact@mwconsulting.cm",
  bureaux: [
    {
      ville: "Douala",
      quartier: "Akwa",
      detail: "Accueil sur rendez-vous, centre ville",
    },
    {
      ville: "Yaounde",
      quartier: "Bastos",
      detail: "Accueil sur rendez-vous, quartier des ambassades",
    },
  ],
} as const;

export function anneesExperience(annee = new Date().getFullYear()) {
  return Math.max(1, annee - AGENCE.fondee);
}
