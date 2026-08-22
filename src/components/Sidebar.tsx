"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/lib/actions";
import type { SessionUser } from "@/lib/auth";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/relais", label: "Tableau de bord" },
  { href: "/demandes", label: "Demandes" },
  { href: "/dossiers", label: "Dossiers" },
  { href: "/agenda", label: "Agenda" },
  { href: "/audit", label: "Journal" },
];

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("console-nav-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("console-nav-open");
    };
  }, [open]);

  return (
    <>
      <header className="console-topbar print:hidden">
        <button
          type="button"
          className="console-menu-btn"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`console-burger ${open ? "is-open" : ""}`} aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
        <Link href="/relais" className="console-topbar-brand">
          <BrandLogo size={36} />
          <span>
            <strong>Relais</strong>
            <em>MW Consulting</em>
          </span>
        </Link>
        <p className="console-topbar-user">{user.nom.split(" ")[0]}</p>
      </header>

      {open ? (
        <button
          type="button"
          className="console-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className={`sidebar print:hidden ${open ? "is-open" : ""}`}>
        <div className="brand">
          <BrandLogo size={64} />
          <p className="mt-3 font-serif text-2xl tracking-tight">Relais</p>
          <p className="mt-1 text-xs text-paper/70">MW Consulting</p>
          <p className="text-xs text-paper/50">Le TGV de l Immigration</p>
        </div>
        <nav className="flex flex-1 flex-col py-4" aria-label="Navigation Relais">
          {links.map((link) => {
            const active =
              link.href === "/relais"
                ? pathname === "/relais"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
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
          <Link
            href="/"
            className="mt-3 block text-xs text-paper/50 hover:text-paper/80"
            onClick={() => setOpen(false)}
          >
            Voir le portail public
          </Link>
        </div>
      </aside>
    </>
  );
}
