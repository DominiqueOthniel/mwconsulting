import { prisma } from "@/lib/db";
import type { SessionUser } from "@/lib/auth";

export async function ecrireAudit(
  user: SessionUser,
  action: string,
  entite: string,
  entiteId: string,
  details: string,
) {
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action,
      entite,
      entiteId,
      details,
    },
  });
}
