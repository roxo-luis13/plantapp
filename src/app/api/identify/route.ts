import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { identifyPlant } from "@/lib/plantnet";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof Blob)) {
    return NextResponse.json({ error: "Envie uma foto no campo 'image'." }, { status: 400 });
  }

  try {
    const candidates = await identifyPlant(image, "foto.jpg");
    return NextResponse.json({ candidates });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao identificar a planta.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
