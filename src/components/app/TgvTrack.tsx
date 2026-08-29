import { GARES, indexGare, progressionTgv, type GareId } from "@/lib/tgv";

export function TgvTrack({
  statut,
  compact = false,
}: {
  statut: string;
  compact?: boolean;
}) {
  const idx = Math.max(0, indexGare(statut));
  const pct = progressionTgv(statut);
  const gareId = (statut === "BROUILLON" ? "SOUMIS" : statut) as GareId;

  return (
    <div className={`app-tgv ${compact ? "is-compact" : ""}`}>
      <div className="app-tgv-meta">
        <p className="app-kicker">Votre TGV</p>
        <p className="app-tgv-pct">{pct}% du parcours</p>
      </div>
      <div className="app-tgv-rail" aria-hidden>
        <div className="app-tgv-fill" style={{ width: `${pct}%` }} />
        <div className="app-tgv-train" style={{ left: `calc(${pct}% - 14px)` }}>
          <span />
        </div>
      </div>
      {!compact ? (
        <ol className="app-tgv-gares">
          {GARES.map((g, i) => {
            const state =
              i < idx ? "is-past" : i === idx || g.id === gareId ? "is-now" : "is-next";
            return (
              <li key={g.id} className={`app-tgv-gare ${state}`}>
                <span className="app-tgv-dot" />
                <span className="app-tgv-gare-nom">{g.nom}</span>
                {state === "is-now" ? (
                  <span className="app-tgv-gare-sub">{g.sousTitre}</span>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
