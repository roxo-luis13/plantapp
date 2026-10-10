"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UploadGardenPhotoState = { status: "idle" | "error"; message?: string };

export async function uploadGardenPhoto(
  _prevState: UploadGardenPhotoState,
  formData: FormData,
): Promise<UploadGardenPhotoState> {
  const supabase = await createClient();

  const caption = String(formData.get("caption") ?? "").trim() || null;
  const photo = formData.get("photo");

  if (!(photo instanceof Blob) || photo.size === 0) {
    return { status: "error", message: "Escolha uma foto." };
  }

  const extension = photo instanceof File && photo.name.includes(".")
    ? photo.name.split(".").pop()
    : "jpg";
  const photoPath = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("garden-photos")
    .upload(photoPath, photo, { contentType: photo.type || "image/jpeg" });

  if (uploadError) {
    return { status: "error", message: `Falha ao enviar a foto: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase
    .from("garden_photos")
    .insert({ photo_path: photoPath, caption });

  if (insertError) {
    await supabase.storage.from("garden-photos").remove([photoPath]);
    return { status: "error", message: `Falha ao salvar a foto: ${insertError.message}` };
  }

  revalidatePath("/jardim");
  return { status: "idle" };
}

export async function deleteGardenPhoto(photoId: string, photoPath: string) {
  const supabase = await createClient();

  await supabase.from("garden_photos").delete().eq("id", photoId);
  await supabase.storage.from("garden-photos").remove([photoPath]);

  revalidatePath("/jardim");
}
