import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relais · MW Consulting",
  description: "Pilotage des dossiers d immigration, MW Consulting",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
