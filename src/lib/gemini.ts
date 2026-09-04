import type { CareInfo } from "@/types/plant";

const CARE_INFO_SCHEMA = {
  type: "object",
  properties: {
    rega: { type: "string" },
    luz: { type: "string" },
    temperatura: { type: "string" },
    solo_e_adubo: { type: "string" },
    umidade: { type: "string" },
    toxicidade: { type: "string" },
    problemas_comuns: { type: "string" },
    dicas_extra: { type: "string" },
  },
  required: [
    "rega",
    "luz",
    "temperatura",
    "solo_e_adubo",
    "umidade",
    "toxicidade",
    "problemas_comuns",
    "dicas_extra",
  ],
};

/**
 * Gera dicas de cuidado para uma planta usando a API gratuita do Google
 * Gemini (https://aistudio.google.com/apikey), a partir do nome (científico
 * e/ou popular) identificado.
 */
export async function getCareInfo(name: string, scientificName?: string | null): Promise<CareInfo> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const plantLabel = scientificName ? `${name} (${scientificName})` : name;
  const prompt = `Você é um especialista em jardinagem e plantas de interior/exterior.
Escreva um guia de cuidados curto e prático, em português do Brasil, para a planta: ${plantLabel}.
Preencha cada campo do JSON com 1 a 3 frases objetivas, sem markdown, focadas em quem tem a planta em casa.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: CARE_INFO_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Falha ao buscar cuidados (Gemini ${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Resposta do Gemini sem conteúdo.");
  }

  return JSON.parse(text) as CareInfo;
}
