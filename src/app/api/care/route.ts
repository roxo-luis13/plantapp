import { NextResponse } from "next/server";
import { getCareInfo } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const scientificName = typeof body?.scientificName === "string" ? body.scientificName.trim() : undefined;

  if (!name) {
    return NextResponse.json({ error: "Informe o nome da planta." }, { status: 400 });
  }

  try {
    const careInfo = await getCareInfo(name, scientificName);
    return NextResponse.json({ careInfo });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar cuidados da planta.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
