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

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

function plantLabel(name: string, scientificName?: string | null) {
  return scientificName ? `${name} (${scientificName})` : name;
}

async function fetchImageAsInlineData(url: string): Promise<GeminiPart | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const mimeType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();
    return { inlineData: { mimeType, data: Buffer.from(buffer).toString("base64") } };
  } catch {
    return null;
  }
}

async function callGemini(parts: GeminiPart[], responseSchema?: object): Promise<string> {
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
      contents: [{ role: "user", parts }],
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

  const text = await callGemini([{ text: prompt }], CARE_INFO_SCHEMA);
  return JSON.parse(text) as CareInfo;
}

export type PlantPhotoInput = {
  url?: string | null;
  base64?: string | null;
  mimeType?: string | null;
};

/**
 * Responde a uma pergunta livre sobre uma planta (origem, usos, curiosidades
 * etc.), usando o Gemini. A foto pode vir de uma URL pública (planta já
 * salva) ou já em base64 (foto ainda não enviada, ex: identificação rápida) —
 * em ambos os casos ela é enviada junto para perguntas sobre a aparência
 * dela na imagem. Sem nome identificado, a pergunta é feita sobre "a planta
 * da foto anexada".
 */
export async function askAboutPlant(
  name: string,
  scientificName: string | null,
  question: string,
  photo?: PlantPhotoInput | null,
): Promise<string> {
  const hasPhoto = Boolean(photo?.base64 || photo?.url);
  const subject = name ? `a planta "${plantLabel(name, scientificName)}"` : "a planta que aparece na foto anexada";

  const prompt = `Você é um especialista em botânica e jardinagem. Responda em português do
Brasil, de forma clara, objetiva e sem markdown, à pergunta abaixo sobre ${subject}${hasPhoto ? ", usando também a foto anexada quando ela ajudar a responder" : ""}.
Se não tiver certeza de algo, diga isso em vez de inventar.

Pergunta: ${question}`;

  const parts: GeminiPart[] = [{ text: prompt }];

  if (photo?.base64) {
    parts.push({ inlineData: { mimeType: photo.mimeType || "image/jpeg", data: photo.base64 } });
  } else if (photo?.url) {
    const image = await fetchImageAsInlineData(photo.url);
    if (image) {
      parts.push(image);
    }
  }

  const text = await callGemini(parts);
  return text.trim();
}
