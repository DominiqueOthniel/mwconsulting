"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import type { SessionUser } from "@/lib/auth";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/", label: "Tableau de bord" },
  { href: "/dossiers", label: "Dossiers" },
  { href: "/agenda", label: "Agenda" },
  { href: "/audit", label: "Journal" },
];

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar print:hidden">
      <div className="brand">
        <BrandLogo size={72} />
        <p className="mt-3 font-serif text-2xl tracking-tight">Relais</p>
        <p className="mt-1 text-xs text-paper/70">MW Consulting</p>
        <p className="text-xs text-paper/50">Le TGV de l'Immigration</p>
      </div>
      <nav className="flex flex-1 flex-col py-4">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${active ? "is-active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-sm font-medium">{user.nom}</p>
        <p className="text-xs text-paper/60">
          {user.role === "ADMIN" ? "Informatique" : "Conseiller"}
        </p>
        <form action={logoutAction} className="mt-3">
          <button type="submit" className="text-xs text-paper/70 underline">
            Se deconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
