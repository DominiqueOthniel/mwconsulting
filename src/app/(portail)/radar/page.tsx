import { AppShell } from "@/components/app/AppShell";
import { RadarDelais } from "@/components/app/RadarDelais";

export default function RadarPage() {
  return (
    <AppShell title="Radar" backHref="/">
      <section className="app-page-head">
        <p className="app-kicker">Outil MW</p>
        <h1 className="app-h1">Radar des delais</h1>
        <p className="app-lead">
          Visualisez, pays par pays, les delais typiques selon votre type de
          projet. Indicatif, pour comparer vite.
        </p>
      </section>
      <RadarDelais />
    </AppShell>
  );
}
