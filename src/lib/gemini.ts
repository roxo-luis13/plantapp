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

function plantLabel(name: string, scientificName?: string | null) {
  return scientificName ? `${name} (${scientificName})` : name;
}

async function callGemini(prompt: string, responseSchema?: object): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      ...(responseSchema && {
        generationConfig: { responseMimeType: "application/json", responseSchema },
      }),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Falha ao falar com o Gemini (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Resposta do Gemini sem conteúdo.");
  }

  return text;
}

/**
 * Gera dicas de cuidado para uma planta usando a API gratuita do Google
 * Gemini (https://aistudio.google.com/apikey), a partir do nome (científico
 * e/ou popular) identificado.
 */
export async function getCareInfo(name: string, scientificName?: string | null): Promise<CareInfo> {
  const prompt = `Você é um especialista em jardinagem e plantas de interior/exterior.
Escreva um guia de cuidados curto e prático, em português do Brasil, para a planta: ${plantLabel(name, scientificName)}.
Preencha cada campo do JSON com 1 a 3 frases objetivas, sem markdown, focadas em quem tem a planta em casa.`;

  const text = await callGemini(prompt, CARE_INFO_SCHEMA);
  return JSON.parse(text) as CareInfo;
}

/**
 * Responde a uma pergunta livre sobre uma planta específica (origem, usos,
 * curiosidades etc.), usando o Gemini.
 */
export async function askAboutPlant(
  name: string,
  scientificName: string | null,
  question: string,
): Promise<string> {
  const prompt = `Você é um especialista em botânica e jardinagem. Responda em português do
Brasil, de forma clara, objetiva e sem markdown, à pergunta abaixo sobre a planta
"${plantLabel(name, scientificName)}". Se não tiver certeza de algo, diga isso em vez de inventar.

Pergunta: ${question}`;

  const text = await callGemini(prompt);
  return text.trim();
}
