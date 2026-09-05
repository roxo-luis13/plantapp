"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCareInfo } from "@/lib/gemini";

export type CreatePlantState = { status: "idle" | "error"; message?: string };

export async function createPlant(
  _prevState: CreatePlantState,
  formData: FormData,
): Promise<CreatePlantState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const scientificName = String(formData.get("scientificName") ?? "").trim() || null;
  const purchaseDate = String(formData.get("purchaseDate") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const confidenceRaw = formData.get("confidence");
  const confidence = confidenceRaw ? Number(confidenceRaw) : null;
  const photo = formData.get("photo");

  if (!name || !purchaseDate || !(photo instanceof Blob) || photo.size === 0) {
    return { status: "error", message: "Preencha o nome, a data de compra e a foto." };
  }

  const extension = photo instanceof File && photo.name.includes(".")
    ? photo.name.split(".").pop()
    : "jpg";
  const photoPath = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("plant-photos")
    .upload(photoPath, photo, { contentType: photo.type || "image/jpeg" });

  if (uploadError) {
    return { status: "error", message: `Falha ao enviar a foto: ${uploadError.message}` };
  }

  let careInfo = null;
  try {
    careInfo = await getCareInfo(name, scientificName);
  } catch {
    // Segue sem os cuidados pré-gerados; a página de detalhe permite tentar de novo.
  }

  const { data: inserted, error: insertError } = await supabase
    .from("plants")
    .insert({
      name,
      scientific_name: scientificName,
      purchase_date: purchaseDate,
      photo_path: photoPath,
      notes,
      identification_confidence: confidence,
      care_info: careInfo,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    await supabase.storage.from("plant-photos").remove([photoPath]);
    return { status: "error", message: `Falha ao salvar a planta: ${insertError?.message}` };
  }

  revalidatePath("/");
  redirect(`/plants/${inserted.id}`);
}

export async function deletePlant(plantId: string, photoPath: string) {
  const supabase = await createClient();

  await supabase.from("plants").delete().eq("id", plantId);
  await supabase.storage.from("plant-photos").remove([photoPath]);

  revalidatePath("/");
  redirect("/");
}

export async function refreshCareInfo(plantId: string, name: string, scientificName: string | null) {
  const supabase = await createClient();

  const careInfo = await getCareInfo(name, scientificName);

  await supabase.from("plants").update({ care_info: careInfo }).eq("id", plantId);

  revalidatePath(`/plants/${plantId}`);
}
