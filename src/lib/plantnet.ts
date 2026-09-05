import type { IdentificationCandidate } from "@/types/plant";

const PLANTNET_ENDPOINT = "https://my-api.plantnet.org/v2/identify";

type PlantNetResponse = {
  results?: Array<{
    score: number;
    species: {
      scientificNameWithoutAuthor: string;
      commonNames: string[];
    };
  }>;
};

/**
 * Identifica uma planta a partir de uma foto usando a API gratuita do
 * Pl@ntNet (https://my.plantnet.org/). Retorna as espécies mais prováveis,
 * ordenadas por confiança.
 */
export async function identifyPlant(image: Blob, filename: string): Promise<IdentificationCandidate[]> {
  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    throw new Error("PLANTNET_API_KEY não configurada.");
  }

  const project = process.env.PLANTNET_PROJECT || "all";
  const url = `${PLANTNET_ENDPOINT}/${project}?api-key=${apiKey}&lang=pt`;

  const form = new FormData();
  form.append("images", image, filename);
  form.append("organs", "auto");

  const response = await fetch(url, { method: "POST", body: form });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Falha ao identificar planta (Pl@ntNet ${response.status}): ${detail}`);
  }

  const data = (await response.json()) as PlantNetResponse;

  return (data.results ?? []).slice(0, 5).map((result) => ({
    scientificName: result.species.scientificNameWithoutAuthor,
    commonNames: result.species.commonNames ?? [],
    score: result.score,
  }));
}
