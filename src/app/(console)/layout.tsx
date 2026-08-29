import { redirect } from "next/navigation";
import { getSession, isClientRole, isStaffRole } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (isClientRole(session.role)) {
    redirect("/profil");
  }
  if (!isStaffRole(session.role)) {
    redirect("/login");
  }

  return (
    <div className="console-shell">
      <Sidebar user={session} />
      <main className="console-main">{children}</main>
    </div>
  );
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
