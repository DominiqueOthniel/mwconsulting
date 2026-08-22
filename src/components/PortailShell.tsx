import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function PortailShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="portail">
      <header className="portail-nav">
        <Link href="/" className="portail-brand">
          <BrandLogo size={48} />
          <span className="portail-brand-text">
            <strong>MW Consulting</strong>
            <em>Le TGV de l Immigration</em>
          </span>
        </Link>
        <nav className="portail-nav-links">
          <a href="/#destinations">Destinations</a>
          <a href="/#parcours">Notre parcours</a>
          <a href="/#contact">Contact</a>
          <Link href="/login" className="portail-nav-login">
            Espace conseiller
          </Link>
        </nav>
      </header>
      {children}
      <footer className="portail-footer">
        <div className="portail-footer-inner">
          <div>
            <p className="portail-footer-brand">MW Consulting</p>
            <p className="portail-footer-tag">Le TGV de l Immigration</p>
          </div>
          <div className="portail-footer-meta">
            <p>Douala · Yaounde</p>
            <p>Accompagnement immigration multi-pays</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
