import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import path from "path";

function prepareServerlessDatabase() {
  const serverless = Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT,
  );
  if (!serverless) return;

  const dest = "/tmp/relais.db";
  if (!existsSync(dest)) {
    const candidates = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
      path.join(__dirname, "..", "..", "prisma", "dev.db"),
    ];
    for (const src of candidates) {
      if (existsSync(src)) {
        copyFileSync(src, dest);
        break;
      }
    }
  }

  if (existsSync(dest)) {
    process.env.DATABASE_URL = "file:/tmp/relais.db";
  }
}

prepareServerlessDatabase();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
