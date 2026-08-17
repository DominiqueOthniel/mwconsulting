# Relais

Cockpit interne pour une agence d immigration a Yaounde. Relais suit les dossiers vers plusieurs pays de destination, la composition familiale, les convocations et un journal d audit.

Le besoin metier: un mail de convocation arrive, il faut savoir qui se presente (y compris conjoint et enfants qui n accompagnent pas la demande), ou, quand, et quelles pieces prendre. WhatsApp et Excel perdent cette information.

## Fonctions

- Comptes conseiller et direction, session JWT en cookie httpOnly
- Dossiers par pays de destination, avec identifiant autorite, numero de dossier, programme et statut
- Catalogues pays: Canada, France, Etats-Unis, Allemagne, Belgique, Royaume-Uni, Italie, Espagne, Emirats arabes unis, Portugal, Suisse, plus saisie libre pour tout autre destination
- Famille: principal, conjoint, enfants, flag accompagne / doit assister a l entretien
- Echeances: entretien, biometrie, medical, depot
- Alerte automatique si un entretien est planifie et qu un non-accompagnant doit venir (texte selon le pays)
- Fiche convocation imprimable
- Journal d audit (qui a change quoi)

## Stack

Next.js (App Router), TypeScript, Prisma, SQLite, Tailwind CSS, jose, bcryptjs.

SQLite pour demarrer sans serveur de base. Le modele (User, Dossier, Personne, Evenement, AuditLog) se transfere tel quel vers Postgres.

## Lancer en local

Installer Node.js LTS, puis dans ce dossier:

```
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Ouvrir http://localhost:3000

Les comptes de demonstration sont crees par le seed. Les mots de passe ne sont pas publies ici.

Les donnees de seed sont fictives. Ne jamais y coller de vrais identifiants clients.

## Netlify

Le fichier `netlify.toml` fixe le build Next.js. Dans le site Netlify:

- Repository: DominiqueOthniel/mwconsulting
- Branche: main
- Publish directory: `.next` (pas `public`)

Puis Deploys, Trigger deploy, Deploy site.

## Architecture

- `src/app/(console)`: ecrans metier derriere session
- `src/lib/pays.ts`: autorites, programmes et libelles par pays
- `src/lib/actions.ts`: mutations serveur (ouverture de dossier, famille, echeances)
- `src/lib/auth.ts`: creation et lecture du cookie de session
- `src/middleware.ts`: garde les routes si le JWT est absent ou invalide
- `prisma/schema.prisma`: modele de donnees

Les donnees personnelles restent dans l agence. Relais n appelle pas les autorites (IRCC, consulat, UKVI, etc.).
