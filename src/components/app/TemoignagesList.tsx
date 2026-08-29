import type { Temoignage } from "@/lib/temoignages";

export function TemoignagesList({ items }: { items: Temoignage[] }) {
  return (
    <ul className="app-temoin-list" role="list">
      {items.map((t) => (
        <li key={t.id} className="app-temoin-card">
          <p className="app-temoin-quote">« {t.cite} »</p>
          <div className="app-temoin-meta">
            <strong>{t.prenom}</strong>
            <span>
              {t.ville} · {t.pays}
            </span>
            <span className="app-temoin-result">{t.resultat}</span>
          </div>
          <p className="app-temoin-prog">
            {t.programme} · {t.annee}
          </p>
        </li>
      ))}
    </ul>
  );
}
