import { PageFrame } from "@/components/PageFrame";
import { NouveauDossierForm } from "@/components/NouveauDossierForm";

export default function NouveauDossierPage() {
  return (
    <PageFrame kicker="Ouverture" title="Nouveau dossier">
      <div className="card card-pad max-w-xl">
        <NouveauDossierForm />
      </div>
    </PageFrame>
  );
}
