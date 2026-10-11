import { NextResponse } from "next/server";
import { searchPlantByText } from "@/lib/gemini";
import { findPlantPhoto } from "@/lib/wikipedia";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";

  if (!query) {
    return NextResponse.json({ error: "Digite o nome ou uma descrição da planta." }, { status: 400 });
  }

  try {
    const result = await searchPlantByText(query);
    const photo = await findPlantPhoto(result.commonName, result.scientificName);

    return NextResponse.json({
      ...result,
      photoUrl: photo?.photoUrl ?? null,
      photoPageUrl: photo?.pageUrl ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao pesquisar a planta.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
