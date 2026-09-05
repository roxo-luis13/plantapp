import type { CareInfo } from "@/types/plant";

const FIELDS: Array<{ key: keyof CareInfo; label: string; icon: string }> = [
  { key: "rega", label: "Rega", icon: "💧" },
  { key: "luz", label: "Luz", icon: "☀️" },
  { key: "temperatura", label: "Temperatura", icon: "🌡️" },
  { key: "solo_e_adubo", label: "Solo e adubo", icon: "🪴" },
  { key: "umidade", label: "Umidade", icon: "💨" },
  { key: "toxicidade", label: "Toxicidade", icon: "⚠️" },
  { key: "problemas_comuns", label: "Problemas comuns", icon: "🐛" },
  { key: "dicas_extra", label: "Dicas extra", icon: "✨" },
];

export function CareInfoView({ careInfo }: { careInfo: CareInfo }) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {FIELDS.map(({ key, label, icon }) => (
        <div
          key={key}
          className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <dt className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {icon} {label}
          </dt>
          <dd className="text-sm text-neutral-600 dark:text-neutral-400">{careInfo[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
