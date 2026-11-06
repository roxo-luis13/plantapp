import { getCachedHomeTips } from "@/lib/homeTips";
import type { HomeTip } from "@/lib/gemini";
import type { Plant } from "@/types/plant";

const CATEGORY_LABEL: Record<HomeTip["category"], string> = {
  rega: "💧 Rega",
  poda: "✂️ Poda",
  cultivo: "🌱 Cultivo",
  alerta: "⚠️ Atenção",
};

export async function HomeTips({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) {
    return null;
  }

  const tips = await getCachedHomeTips(
    plants.map((plant) => ({
      name: plant.name,
      scientificName: plant.scientific_name,
      notes: plant.notes,
    })),
  );

  if (tips.length === 0) {
    return null;
  }

  return (
    <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-3 text-sm font-semibold text-green-900 dark:text-green-400">
        Dicas para o seu jardim hoje
      </h2>
      <ul className="flex flex-col gap-3">
        {tips.map((tip, index) => (
          <li key={index} className="text-sm text-neutral-700 dark:text-neutral-300">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {CATEGORY_LABEL[tip.category]} · {tip.plantName}:
            </span>{" "}
            {tip.tip}
          </li>
        ))}
      </ul>
    </section>
  );
}
