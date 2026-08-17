import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
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

  return (
    <div className="flex min-h-screen">
      <Sidebar user={session} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
