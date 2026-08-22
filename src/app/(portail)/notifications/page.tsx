import { AppShell } from "@/components/app/AppShell";
import { NotificationsList } from "@/components/app/NotificationsList";

export default function NotificationsPage() {
  return (
    <AppShell title="Alertes">
      <section className="app-page-head">
        <h1 className="app-h1">Notifications</h1>
        <p className="app-lead">
          Conseils, rappels et infos utiles pour vos demarches. Touchez une
          alerte pour l ouvrir.
        </p>
      </section>
      <NotificationsList />
    </AppShell>
  );
}
