"use client";

import { useMemo, useState } from "react";
import { NOMS_PAYS, configPays } from "@/lib/pays";

type Props = {
  name?: string;
  autreName?: string;
  value: string;
  className?: string;
  inline?: boolean;
  onPaysChange?: (paysEffectif: string) => void;
};

export function PaysDestinationSelect({
  name = "paysDestination",
  autreName = "paysDestinationAutre",
  value,
  className = "field",
  inline = false,
  onPaysChange,
}: Props) {
  const connu = NOMS_PAYS.some(
    (p) => p.toLowerCase() === value.toLowerCase(),
  );
  const initial = connu ? value : value ? "Autre" : NOMS_PAYS[0];
  const [pays, setPays] = useState(initial);
  const [paysAutre, setPaysAutre] = useState(connu ? "" : value);
  const autre = pays === "Autre";
  const paysEffectif = autre ? paysAutre || "Autre" : pays;
  const config = useMemo(() => configPays(paysEffectif), [paysEffectif]);

  function notifier(nouveauPays: string, autreValue: string) {
    const effectif =
      nouveauPays === "Autre" ? autreValue || "Autre" : nouveauPays;
    onPaysChange?.(effectif);
  }

  return (
    <div className={inline ? "space-y-2" : "space-y-3"}>
      <select
        className={className}
        id={name}
        name={name}
        value={pays}
        onChange={(e) => {
          const next = e.target.value;
          setPays(next);
          notifier(next, paysAutre);
        }}
      >
        {NOMS_PAYS.map((nom) => (
          <option key={nom} value={nom}>
            {nom}
          </option>
        ))}
        <option value="Autre">Autre pays</option>
      </select>
      {autre ? (
        <div>
          <label className="lbl" htmlFor={autreName}>
            Nom du pays
          </label>
          <input
            className={inline ? "field-inline mt-1 w-full" : "field mt-1"}
            id={autreName}
            name={autreName}
            value={paysAutre}
            onChange={(e) => {
              const next = e.target.value;
              setPaysAutre(next);
              notifier("Autre", next);
            }}
            placeholder="Ex: Qatar, Senegal..."
            required
          />
        </div>
      ) : null}
      {!inline ? (
        <p className="text-xs text-sage">Autorite: {config.autorite}</p>
      ) : null}
    </div>
  );
}
