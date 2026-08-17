import { labelsStatut, labelsStatutEvenement, statutTone } from "@/lib/labels";

export function StatusBadge({
  value,
  kind = "dossier",
}: {
  value: string;
  kind?: "dossier" | "evenement";
}) {
  const label =
    kind === "evenement"
      ? labelsStatutEvenement[value] ?? value
      : labelsStatut[value] ?? value;
  const tone = statutTone(value);
  const classes: Record<string, string> = {
    clay: "bg-[#fff1ed] text-clay",
    leaf: "bg-[#e8f3ec] text-leaf",
    sage: "bg-[#eef1ee] text-sage",
    forest: "bg-[#e7efe9] text-forest",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes[tone]}`}
    >
      {label}
    </span>
  );
}
