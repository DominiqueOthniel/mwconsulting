import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import path from "path";

function isServerless() {
  return Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT,
  );
}

function findBundledDatabase() {
  const names = ["relais.db", "dev.db"];
  const roots = [
    process.cwd(),
    process.env.LAMBDA_TASK_ROOT || "",
    path.join(process.cwd(), "prisma"),
    path.join(process.cwd(), "node_modules", ".prisma", "client"),
    path.join(process.env.LAMBDA_TASK_ROOT || "", "prisma"),
    path.join(process.env.LAMBDA_TASK_ROOT || "", "node_modules", ".prisma", "client"),
  ].filter(Boolean);

  for (const root of roots) {
    for (const name of names) {
      const candidate = path.join(root, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

function databaseUrl() {
  if (!isServerless()) {
    return process.env.DATABASE_URL || "file:./dev.db";
  }

  const dest = "/tmp/relais.db";
  if (!existsSync(dest)) {
    const src = findBundledDatabase();
    if (src) copyFileSync(src, dest);
  }

  if (existsSync(dest)) {
    return `file:${dest}`;
  }

  return process.env.DATABASE_URL || "file:./dev.db";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: databaseUrl() },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
