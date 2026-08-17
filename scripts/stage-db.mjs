import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "prisma", "dev.db");

if (!existsSync(src)) {
  console.error("prisma/dev.db introuvable. Lance prisma db seed avant le build.");
  process.exit(1);
}

const dest = join(root, "node_modules", ".prisma", "client", "relais.db");
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("Base Relais copiee pour Netlify.");
