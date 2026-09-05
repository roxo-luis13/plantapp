import { NextResponse } from "next/server";
import { askAboutPlant } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const scientificName = typeof body?.scientificName === "string" ? body.scientificName.trim() : null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const photoUrl = typeof body?.photoUrl === "string" ? body.photoUrl.trim() : null;

  if (!name || !question) {
    return NextResponse.json({ error: "Informe o nome da planta e a pergunta." }, { status: 400 });
  }

  try {
    const answer = await askAboutPlant(name, scientificName || null, question, photoUrl);
    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao perguntar sobre a planta.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
