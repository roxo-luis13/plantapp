import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AskPlantAI } from "@/components/AskPlantAI";
import { CareSection } from "@/components/CareSection";
import { DeleteGrowthPhotoButton } from "@/components/DeleteGrowthPhotoButton";
import { DeletePlantButton } from "@/components/DeletePlantButton";
import { EditablePlantName } from "@/components/EditablePlantName";
import { EditablePlantNotes } from "@/components/EditablePlantNotes";
import { GrowthPhotoForm } from "@/components/GrowthPhotoForm";
import { PageHeader } from "@/components/PageHeader";
import type { GrowthPhoto, Plant } from "@/types/plant";

export default async function PlantDetailPage({ params }: PageProps<"/plants/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: plant } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .maybeSingle<Plant>();

  if (!plant) {
    notFound();
  }

  const { data: photo } = supabase.storage.from("plant-photos").getPublicUrl(plant.photo_path);
  const purchaseDate = new Date(`${plant.purchase_date}T00:00:00`).toLocaleDateString("pt-BR");

  const { data: growthPhotos } = await supabase
    .from("plant_growth_photos")
    .select("*")
    .eq("plant_id", plant.id)
    .order("created_at", { ascending: false })
    .returns<GrowthPhoto[]>();

  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <PageHeader backHref="/" actions={<DeletePlantButton plantId={plant.id} photoPath={plant.photo_path} />} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Image src={photo.publicUrl} alt={plant.name} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
        </div>

        <EditablePlantName
          plantId={plant.id}
          name={plant.name}
          scientificName={plant.scientific_name}
        />
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Comprada em {purchaseDate}</p>
        {plant.identification_confidence != null && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Identificada por IA com {Math.round(plant.identification_confidence * 100)}% de confiança
          </p>
        )}

        <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-green-900 dark:text-green-400">Observações</h2>
          <EditablePlantNotes plantId={plant.id} notes={plant.notes} />
        </div>

        <CareSection
          plantId={plant.id}
          name={plant.name}
          scientificName={plant.scientific_name}
          careInfo={plant.care_info}
        />

        <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <h2 className="mb-3 text-sm font-semibold text-green-900 dark:text-green-400">Crescimento</h2>
          <GrowthPhotoForm plantId={plant.id} />

          {growthPhotos && growthPhotos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {growthPhotos.map((growthPhoto) => {
                const { data } = supabase.storage
                  .from("plant-growth-photos")
                  .getPublicUrl(growthPhoto.photo_path);
                const date = new Date(growthPhoto.created_at).toLocaleDateString("pt-BR");
                return (
                  <div
                    key={growthPhoto.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={data.publicUrl}
                        alt={growthPhoto.caption ?? "Foto de crescimento"}
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                      <div className="absolute right-1 top-1">
                        <DeleteGrowthPhotoButton
                          plantId={plant.id}
                          photoId={growthPhoto.id}
                          photoPath={growthPhoto.photo_path}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 p-1.5">
                      {growthPhoto.caption && (
                        <p className="line-clamp-2 text-xs text-neutral-700 dark:text-neutral-300">
                          {growthPhoto.caption}
                        </p>
                      )}
                      <p className="text-[0.65rem] text-neutral-400 dark:text-neutral-500">{date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-green-900 dark:text-green-400">
            Pergunte à IA
          </h2>
          <AskPlantAI
            name={plant.name}
            scientificName={plant.scientific_name}
            photo={{ url: photo.publicUrl }}
          />
        </section>
      </main>
    </div>
  );
}
