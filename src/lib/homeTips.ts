import { unstable_cache } from "next/cache";
import { getHomeTips, type HomeTip, type HomeTipPlant } from "@/lib/gemini";

const getHomeTipsCached = unstable_cache(
  async (_cacheKey: string, plants: HomeTipPlant[]) => getHomeTips(plants),
  ["home-tips"],
  { revalidate: 60 * 60 * 12 },
);

/**
 * Busca dicas do início do app, com cache por meio dia — a chave inclui a
 * data e as plantas atuais, então o cache se renova sozinho quando o
 * catálogo muda ou quando um novo dia começa.
 */
export async function getCachedHomeTips(plants: HomeTipPlant[]): Promise<HomeTip[]> {
  if (plants.length === 0) {
    return [];
  }

  const today = new Date().toISOString().slice(0, 10);
  const signature = plants
    .map((plant) => `${plant.name}|${plant.scientificName ?? ""}|${plant.notes ?? ""}`)
    .join(";");
  const cacheKey = `${today}:${signature}`;

  try {
    return await getHomeTipsCached(cacheKey, plants);
  } catch {
    return [];
  }
}
