import { LoginForm } from "@/components/LoginForm";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginPage() {
  return (
    <div className="login-split">
      <section className="login-panel">
        <BrandLogo size={96} />
        <div>
          <h1 className="max-w-md font-serif text-4xl leading-tight">
            Relais, le bureau des dossiers MW Consulting.
          </h1>
          <p className="mt-4 max-w-md text-sm text-paper/75">
            Le TGV de l'Immigration. Dossiers vers plusieurs pays,
            convocations, composition familiale, biometrie, medicaux et
            preuves d'emploi.
          </p>
        </div>
        <p className="text-xs text-paper/50">Douala · Yaounde</p>
      </section>
      <section className="login-form-wrap">
        <div className="w-full max-w-sm">
          <div className="mb-4 lg:hidden">
            <BrandLogo size={64} />
          </div>
          <h2 className="mb-6 font-serif text-2xl text-ink">Connexion conseiller</h2>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-sage">
            <a href="/" className="link">
              Retour au portail public
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
