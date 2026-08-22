import { configPays } from "@/lib/pays";
import { DESTINATIONS, ETAPES_AGENCE, type DestinationPortail } from "@/lib/portail";

export type ChatReply = {
  text: string;
  links?: { label: string; href: string }[];
  suggestions?: string[];
};

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ALIAS: Record<string, string[]> = {
  Canada: ["canada", "canadien", "ircc", "quebec", "ottawa", "toronto"],
  France: ["france", "francais", "paris", "tls", "schengen"],
  "Etats-Unis": ["etats unis", "usa", "us", "amerique", "americain", "green card", "ds 160"],
  Allemagne: ["allemagne", "allemand", "berlin", "carte bleue"],
  Belgique: ["belgique", "belge", "bruxelles"],
  "Royaume-Uni": ["royaume uni", "uk", "angleterre", "london", "ukvi", "grande bretagne"],
  Italie: ["italie", "italien", "rome", "milan"],
  Espagne: ["espagne", "espagnol", "madrid", "barcelone"],
  "Emirats arabes unis": ["emirats", "dubai", "abu dhabi", "eua", "uae", "golden visa"],
  Portugal: ["portugal", "portugais", "lisbonne", "d7"],
  Suisse: ["suisse", "geneve", "zurich", "permis b"],
};

function trouverPays(q: string): DestinationPortail | null {
  let best: { d: DestinationPortail; score: number } | null = null;
  for (const d of DESTINATIONS) {
    const keys = [norm(d.nom), ...(ALIAS[d.nom] ?? [])];
    let score = 0;
    for (const k of keys) {
      if (q.includes(k)) score += k.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { d, score };
  }
  return best?.d ?? null;
}

function trouverProcedure(d: DestinationPortail, q: string) {
  let best: { nom: string; score: number; delai: string; resume: string } | null =
    null;
  for (const p of d.procedures) {
    const pn = norm(p.nom);
    const tokens = pn.split(" ").filter((t) => t.length > 2);
    let score = 0;
    if (q.includes(pn)) score += 20;
    for (const t of tokens) {
      if (q.includes(t)) score += 3;
    }
    if (
      (q.includes("etud") || q.includes("student") || q.includes("ecole")) &&
      (pn.includes("etud") || pn.includes("student") || pn.includes("f1"))
    ) {
      score += 12;
    }
    if (
      (q.includes("travail") || q.includes("job") || q.includes("emploi") || q.includes("worker")) &&
      (pn.includes("travail") ||
        pn.includes("worker") ||
        pn.includes("talent") ||
        pn.includes("h1b") ||
        pn.includes("permis") ||
        pn.includes("bleu"))
    ) {
      score += 12;
    }
    if (
      (q.includes("famille") || q.includes("conjoint") || q.includes("enfant") || q.includes("parrain")) &&
      (pn.includes("famille") ||
        pn.includes("parrain") ||
        pn.includes("reagrup") ||
        pn.includes("ricongiung") ||
        pn.includes("super visa") ||
        pn.includes("fiance"))
    ) {
      score += 12;
    }
    if (
      (q.includes("visiteur") || q.includes("tourisme") || q.includes("visite")) &&
      (pn.includes("visiteur") || pn.includes("visitor") || pn.includes("b1") || pn.includes("b2"))
    ) {
      score += 12;
    }
    if (
      (q.includes("residence") || q.includes("permanente") || q.includes("immigr")) &&
      (pn.includes("residence") || pn.includes("permanente") || pn.includes("green") || pn.includes("d7"))
    ) {
      score += 12;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { nom: p.nom, score, delai: p.delai, resume: p.resume };
    }
  }
  return best;
}

function hasAny(q: string, words: string[]) {
  return words.some((w) => q.includes(w));
}

export function repondreChat(message: string): ChatReply {
  const raw = message.trim();
  if (!raw) {
    return {
      text: "Posez-moi une question, par exemple: « Visa etudes Canada » ou « Combien de temps pour la France ? ».",
      suggestions: [
        "Quels pays proposez-vous ?",
        "Visa etudes Canada",
        "Comment ca marche ?",
      ],
    };
  }

  const q = norm(raw);
  const pays = trouverPays(q);

  if (hasAny(q, ["bonjour", "bonsoir", "salut", "hello", "hey"])) {
    return {
      text: "Bonjour, je suis l assistant MW Consulting. Je peux vous guider sur les destinations, procedures, delais et rendez-vous. Que voulez-vous savoir ?",
      suggestions: [
        "Quels pays proposez-vous ?",
        "Residence permanente Canada",
        "Contacter l agence",
      ],
    };
  }

  if (hasAny(q, ["merci", "thanks", "ok cool", "parfait"])) {
    return {
      text: "Avec plaisir. Si vous voulez aller plus loin, un conseiller MW peut ouvrir votre dossier a Douala ou Yaounde.",
      links: [{ label: "Aide et contact", href: "/aide" }],
      suggestions: ["Quels pays proposez-vous ?", "Comment ca marche ?"],
    };
  }

  if (
    hasAny(q, [
      "contact",
      "telephone",
      "whatsapp",
      "email",
      "mail",
      "adresse",
      "douala",
      "yaounde",
      "rendez vous agence",
      "parler",
    ])
  ) {
    return {
      text: "Pour demarrer un dossier, ecrivez a contact@mwconsulting.cm ou passez a Douala / Yaounde sur rendez-vous. Un conseiller vous oriente selon votre pays et votre procedure.",
      links: [
        { label: "Page Aide", href: "/aide" },
        { label: "Voir les destinations", href: "/destinations" },
      ],
      suggestions: ["Visa etudes France", "Combien de temps pour le Canada ?"],
    };
  }

  if (
    hasAny(q, ["comment ca marche", "etapes", "parcours", "methode", "processus", "comment faire"])
  ) {
    const lignes = ETAPES_AGENCE.map(
      (e, i) => `${i + 1}. ${e.titre}: ${e.texte}`,
    ).join("\n");
    return {
      text: `Voici le parcours MW Consulting:\n${lignes}\n\nChoisissez ensuite un pays pour voir les procedures precises.`,
      links: [{ label: "Destinations", href: "/destinations" }],
      suggestions: ["Quels pays proposez-vous ?", "Visa travail Allemagne"],
    };
  }

  if (
    hasAny(q, [
      "quels pays",
      "liste pays",
      "destinations",
      "ou aller",
      "pays propose",
      "tous les pays",
    ]) ||
    (q.includes("pays") && !pays)
  ) {
    const liste = DESTINATIONS.map((d) => `${d.drapeau} ${d.nom}`).join(", ");
    return {
      text: `MW Consulting accompagne vers: ${liste}. Dites-moi un pays pour voir les procedures.`,
      links: [{ label: "Explorer les pays", href: "/destinations" }],
      suggestions: ["Canada", "France", "Etats-Unis", "Allemagne"],
    };
  }

  if (hasAny(q, ["famille", "conjoint", "enfant", "doit venir", "assister", "entretien"])) {
    if (pays) {
      const cfg = configPays(pays.nom);
      return {
        text: `${pays.nom}: ${cfg.alerteFamille} Consultez aussi les alertes dans l app.`,
        links: [
          { label: `Fiche ${pays.nom}`, href: `/pays/${pays.slug}` },
          { label: "Alertes", href: "/notifications" },
        ],
        suggestions: [
          `Procedures ${pays.nom}`,
          "Contacter l agence",
        ],
      };
    }
    return {
      text: "Selon le pays, conjoint et enfants peuvent etre convoques meme s ils n accompagnent pas. C est frequent pour le Canada. Precisez le pays pour un conseil plus precis.",
      links: [{ label: "Alertes utiles", href: "/notifications" }],
      suggestions: ["Famille Canada", "Famille France"],
    };
  }

  if (hasAny(q, ["biometrie", "medical", "vac", "tls", "vfs", "rdv", "convocation"])) {
    const lieu = pays
      ? ` Pour ${pays.nom}, lieux typiques: ${configPays(pays.nom).rdvLieu}.`
      : "";
    return {
      text: `Pour biometrie, medical ou entretien: arrivez en avance avec passeport et convocation.${lieu} MW prepare la checklist avec vous.`,
      links: pays
        ? [{ label: `Voir ${pays.nom}`, href: `/pays/${pays.slug}` }]
        : [{ label: "Aide", href: "/aide" }],
      suggestions: pays
        ? [`Procedures ${pays.nom}`, "Contacter l agence"]
        : ["Biometrie Canada", "Contacter l agence"],
    };
  }

  if (pays) {
    const proc = trouverProcedure(pays, q);
    const veutDelai = hasAny(q, [
      "delai",
      "temps",
      "combien",
      "duree",
      "semaine",
      "mois",
      "long",
    ]);

    if (proc) {
      const slugProc = proc.nom
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return {
        text: veutDelai
          ? `Pour « ${proc.nom} » vers ${pays.nom}: delai typique ${proc.delai}. ${proc.resume}`
          : `${pays.drapeau} ${pays.nom} · ${proc.nom}\n${proc.resume}\nDelai typique: ${proc.delai}. Un conseiller MW personnalise ensuite votre checklist.`,
        links: [
          {
            label: `Details ${proc.nom}`,
            href: `/pays/${pays.slug}/${slugProc}`,
          },
          { label: `Toutes les procedures ${pays.nom}`, href: `/pays/${pays.slug}` },
        ],
        suggestions: [
          `Delai ${proc.nom} ${pays.nom}`,
          "Comment ca marche ?",
          "Contacter l agence",
        ],
      };
    }

    if (veutDelai) {
      return {
        text: `Les delais pour ${pays.nom} dependent de la procedure (etudes, travail, famille...). Voici ce que nous proposons: ${pays.procedures.map((p) => p.nom).join(", ")}.`,
        links: [{ label: `Fiche ${pays.nom}`, href: `/pays/${pays.slug}` }],
        suggestions: pays.procedures.slice(0, 3).map((p) => `${p.nom} ${pays.nom}`),
      };
    }

    return {
      text: `${pays.drapeau} ${pays.nom}: ${pays.accroche}\nPour qui: ${pays.pourQui}\nProcedures: ${pays.procedures.map((p) => p.nom).join(", ")}.`,
      links: [{ label: `Ouvrir ${pays.nom}`, href: `/pays/${pays.slug}` }],
      suggestions: [
        ...pays.procedures.slice(0, 2).map((p) => `${p.nom}`),
        "Contacter l agence",
      ],
    };
  }

  if (hasAny(q, ["visa", "etud", "travail", "residence", "immigr", "procedure"])) {
    return {
      text: "Oui, on peut vous aider. Precisez le pays (ex: Canada, France, Allemagne) et le type de projet (etudes, travail, famille, visiteur).",
      links: [{ label: "Choisir un pays", href: "/destinations" }],
      suggestions: [
        "Visa etudes Canada",
        "Visa travail Allemagne",
        "Residence permanente Canada",
      ],
    };
  }

  return {
    text: "Je n ai pas tout compris. Essayez avec un pays et une procedure, par exemple « Visa etudes France » ou « Delai Canada residence ».",
    links: [
      { label: "Destinations", href: "/destinations" },
      { label: "Aide", href: "/aide" },
    ],
    suggestions: [
      "Quels pays proposez-vous ?",
      "Comment ca marche ?",
      "Visa etudes Canada",
    ],
  };
}
