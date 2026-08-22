import { prisma } from "@/lib/db";
import { PageFrame } from "@/components/PageFrame";
import { formatDateTime } from "@/lib/labels";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 80,
  });

  return (
    <PageFrame kicker="Tracabilite" title="Journal">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quand</th>
                <th>Qui</th>
                <th>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td data-label="Quand" className="whitespace-nowrap text-sage">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td data-label="Qui">{log.user?.nom ?? "Systeme"}</td>
                  <td data-label="Action">
                    {log.action} · {log.entite}
                  </td>
                  <td data-label="Detail">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}
