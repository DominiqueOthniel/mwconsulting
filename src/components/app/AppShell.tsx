"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ChatBot } from "@/components/app/ChatBot";
import { NOTIFICATIONS, STORAGE_KEY } from "@/lib/notifications";

const tabs = [
  { href: "/", label: "Accueil", icon: IconHome },
  { href: "/destinations", label: "Pays", icon: IconGlobe },
  { href: "/notifications", label: "Alertes", icon: IconBell },
  { href: "/profil", label: "Profil", icon: IconUser },
] as const;

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
      />
    </svg>
  );
}

function IconGlobe({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <path
        d="M4 12h16M12 4c2.5 2.8 2.5 12.2 0 16M12 4c-2.5 2.8-2.5 12.2 0 16"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconBell({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 17h12l-1.2-1.2V11a4.8 4.8 0 1 0-9.6 0v4.8L6 17Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconUser({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="9"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
      />
      <path
        d="M5.5 19.5c1.6-3 4-4.5 6.5-4.5s4.9 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppShell({
  children,
  title,
  backHref,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
}) {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    function lire() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const lues: string[] = raw ? JSON.parse(raw) : [];
        setUnread(NOTIFICATIONS.filter((n) => !lues.includes(n.id)).length);
      } catch {
        setUnread(NOTIFICATIONS.length);
      }
    }
    lire();
    window.addEventListener("mw-notifs", lire);
    return () => window.removeEventListener("mw-notifs", lire);
  }, [pathname]);

  return (
    <div className="app">
      <a href="#contenu" className="app-skip">
        Aller au contenu
      </a>

      <header className="app-top">
        <div className="app-top-left">
          {backHref ? (
            <Link href={backHref} className="app-back" aria-label="Retour">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 5 8 12l7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <Link href="/" className="app-brand" aria-label="Accueil MW Consulting">
              <BrandLogo size={36} />
            </Link>
          )}
          <div className="app-top-titles">
            <p className="app-top-brand">MW Consulting</p>
            <p className="app-top-sub">{title ?? "Le TGV de l Immigration"}</p>
          </div>
        </div>
        <div className="app-top-actions">
          <Link
            href="/notifications"
            className="app-bell"
            aria-label={
              unread > 0
                ? `${unread} notifications non lues`
                : "Notifications"
            }
          >
            <IconBell active={pathname.startsWith("/notifications")} />
            {unread > 0 ? (
              <span className="app-badge">{unread > 9 ? "9+" : unread}</span>
            ) : null}
          </Link>
          <Link
            href="/profil"
            className="app-top-profil"
            aria-label="Mon profil"
          >
            <IconUser
              active={
                pathname.startsWith("/profil") || pathname.startsWith("/compte")
              }
            />
          </Link>
        </div>
      </header>

      <main id="contenu" className="app-main">
        {children}
      </main>

      <nav className="app-tabbar" aria-label="Navigation principale">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : tab.href === "/destinations"
                ? pathname.startsWith("/destinations") ||
                  pathname.startsWith("/pays")
                : tab.href === "/profil"
                  ? pathname.startsWith("/profil") ||
                    pathname.startsWith("/compte")
                  : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          const showBadge = tab.href === "/notifications" && unread > 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`app-tab ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="app-tab-icon">
                <Icon active={active} />
                {showBadge ? <span className="app-tab-dot" aria-hidden /> : null}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <ChatBot />
    </div>
  );
}
